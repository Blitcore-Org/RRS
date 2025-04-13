import { NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/mongodb';
import logger from '@/utils/logger';



function calculateDistance(lat1, lng1, lat2, lng2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371000; // meters
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function isWithinGeofence(activityLatLng, center, radius) {
  if (!activityLatLng || activityLatLng.length < 2) return false;
  const distance = calculateDistance(
    activityLatLng[0],
    activityLatLng[1],
    center.lat,
    center.lng
  );
  return distance <= radius;
}

async function processActivity(activity, accessToken, eventStart, eventEnd) {
  const activityStartUnix = Math.floor(new Date(activity.start_date).getTime() / 1000);
  const activityEndUnix = activityStartUnix + activity.elapsed_time;
  const effectiveStart = Math.max(activityStartUnix, eventStart);
  const effectiveEnd = Math.min(activityEndUnix, eventEnd);

  if (effectiveEnd <= effectiveStart) {
    return {
      ...activity,
      partial_distance: 0,
      partial_time: 0,
      note: "No overlap with event window"
    };
  }

  const partialTime = effectiveEnd - effectiveStart;
  const offsetStart = effectiveStart - activityStartUnix;
  const offsetEnd = effectiveEnd - activityStartUnix;

  const streamResponse = await fetch(
    `https://www.strava.com/api/v3/activities/${activity.id}/streams?keys=time,distance&key_by_type=true`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const streams = await streamResponse.json();
  const timeStream = streams.time?.data;
  const distanceStream = streams.distance?.data;
  if (!timeStream || !distanceStream) {
    return {
      ...activity,
      partial_distance: 0,
      partial_time: partialTime,
      note: "Streams not available"
    };
  }

  function getDistanceAtOffset(offset) {
    let idx = timeStream.findIndex((t) => t >= offset);
    if (idx === -1) idx = timeStream.length - 1;
    return distanceStream[idx];
  }

  const distanceAtStart = getDistanceAtOffset(offsetStart);
  const distanceAtEnd = getDistanceAtOffset(offsetEnd);
  const partialDistanceMeters = distanceAtEnd - distanceAtStart;

  return {
    ...activity,
    partial_distance: partialDistanceMeters / 1000,
    partial_time: partialTime
  };
}

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function parseTime(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  if (parts.length !== 3) return 0;
  return parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);
}

// ------------------
// Refresh Token Function
// ------------------
async function refreshUserToken(user) {
  logger.info(`Checking token for user ${user.id}...`);
  const now = new Date();
  if (!user.stravaExpiresAt || user.stravaExpiresAt <= now) {
    logger.info(`Refreshing token for user ${user.id}...`);
    const response = await fetch("https://www.strava.com/api/v3/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: user.stravaRefreshToken
      })
    });
    const tokenData = await response.json();
    logger.info(`Token data for user ${user.id}: ${JSON.stringify(tokenData)}`);
    if (tokenData.access_token) {
      const newExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
      user.stravaAccessToken = tokenData.access_token;
      user.stravaRefreshToken = tokenData.refresh_token;
      user.stravaExpiresAt = newExpiresAt;
      await user.save();
      logger.info(`User ${user.id}: Token refreshed successfully.`);
    } else {
      logger.error(`User ${user.id}: Failed to refresh token. ${JSON.stringify(tokenData)}`);
    }
  }
}

// ------------------
// Main Process Function
// ------------------
async function processUsers() {
  await dbConnect();
  const users = await User.find({
    stravaAccessToken: { $exists: true, $ne: null }
  });
  logger.info(`Found ${users.length} users with Strava tokens.`);

  const facilityCenter = {
    lat: process.env.FACILITY_LAT ? parseFloat(process.env.FACILITY_LAT) : 43.211822,
    lng: process.env.FACILITY_LNG ? parseFloat(process.env.FACILITY_LNG) : 27.894898
  };
  const geofenceRadiusMeters = process.env.GEOFENCE_RADIUS ? parseInt(process.env.GEOFENCE_RADIUS) : 800;

  const eventMorningStart = process.env.EVENT_MORNING_START ? parseInt(process.env.EVENT_MORNING_START) : 6;
  const eventMorningEnd = process.env.EVENT_MORNING_END ? parseInt(process.env.EVENT_MORNING_END) : 7;
  const eventEveningStart = process.env.EVENT_EVENING_START ? parseInt(process.env.EVENT_EVENING_START) : 18;
  const eventEveningEnd = process.env.EVENT_EVENING_END ? parseInt(process.env.EVENT_EVENING_END) : 19;

  const now = new Date();
  const dayStart = Math.floor(
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime() / 1000
  );
  const dayEnd = Math.floor(
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime() / 1000
  );

  const morningStart = Math.floor(
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), eventMorningStart, 0, 0).getTime() / 1000
  );
  const morningEnd = Math.floor(
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), eventMorningEnd, 0, 0).getTime() / 1000
  );
  const eveningStart = Math.floor(
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), eventEveningStart, 0, 0).getTime() / 1000
  );
  const eveningEnd = Math.floor(
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), eventEveningEnd, 0, 0).getTime() / 1000
  );

  logger.info(`Morning window: ${new Date(morningStart * 1000)} to ${new Date(morningEnd * 1000)}`);
  logger.info(`Evening window: ${new Date(eveningStart * 1000)} to ${new Date(eveningEnd * 1000)}`);

  function isToday(date) {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  }

  for (const user of users) {
    logger.info(user.lastCronFetch);
    if (user.lastCronFetch && isToday(new Date(user.lastCronFetch))) {
      logger.info(`Skipping user ${user.id} as data was already fetched today.`);
      continue;
    }

    try {
      await refreshUserToken(user);
    } catch (err) {
      console.error(`Error refreshing token for user ${user.id}: ${err}`);
      continue;
    }

    const response = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?after=${dayStart}&before=${dayEnd}&per_page=30`,
      {
        headers: { Authorization: `Bearer ${user.stravaAccessToken}` }
      }
    );
    const activities = await response.json();
    logger.info(`User ${user.id} fetched ${activities.length} activities for the day.`);

    let runActivities = activities.filter((activity) => activity.type === "Run");
    runActivities = runActivities.filter((activity) => {
      const startLatLng = activity.start_latlng;
      return isWithinGeofence(startLatLng, facilityCenter, geofenceRadiusMeters);
    });

    let morningResults = [];
    let eveningResults = [];
    for (const activity of runActivities) {
      const morningResult = await processActivity(activity, user.stravaAccessToken, morningStart, morningEnd);
      const eveningResult = await processActivity(activity, user.stravaAccessToken, eveningStart, eveningEnd);
      if (morningResult.partial_time > 0) {
        morningResults.push(morningResult);
      }
      if (eveningResult.partial_time > 0) {
        eveningResults.push(eveningResult);
      }
    }
    logger.info(`User ${user.id} morning processed activities: ${JSON.stringify(morningResults)}`);
    logger.info(`User ${user.id} evening processed activities: ${JSON.stringify(eveningResults)}`);

    let currentDistance = 0;
    let currentTime = 0;
    [...morningResults, ...eveningResults].forEach((run) => {
      currentDistance += run.partial_distance || 0;
      currentTime += run.partial_time || 0;
    });

    logger.info(`User ${user.id} current session: Distance: ${currentDistance.toFixed(2)} km, Time: ${formatTime(currentTime)}`);

    const prevDistance = parseFloat(user.totalDistance.replace('KM', '')) || 0;
    const prevTime = parseTime(user.totalTime) || 0;

    const newTotalDistance = prevDistance + currentDistance;
    const newTotalTime = prevTime + currentTime;

    let newAveragePace = "0:00";
    if (newTotalDistance > 0) {
      const paceInSec = Math.floor(newTotalTime / newTotalDistance);
      const mins = Math.floor(paceInSec / 60);
      const secs = paceInSec % 60;
      newAveragePace = `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    logger.info(
      `User ${user.id} aggregated totals: Distance: ${newTotalDistance.toFixed(
        2
      )} km, Time: ${formatTime(newTotalTime)}, Pace: ${newAveragePace}`
    );

    user.totalDistance = `${newTotalDistance.toFixed(2)}KM`;
    user.totalTime = formatTime(newTotalTime);
    user.averagePace = newAveragePace;
    user.lastCronFetch = new Date();
    await user.save();
  }
  
  return { message: "All users processed." };
}

// ------------------
// Next.js API Route Handler
// ------------------
export async function GET(request) {

  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const result = await processUsers();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing users:", error);
    return NextResponse.json({ error: "Error processing users" }, { status: 500 });
  }
}

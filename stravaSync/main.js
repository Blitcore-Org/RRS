// cron/refreshTokens.js

import cron from "node-cron";
import dotenv from "dotenv";
import mongoose from "mongoose";
import fetch from "node-fetch";
import logger from "./logger.js";
import Leaderboard from "./models/Leaderboard.js";
import User from "./models/User.js";
dotenv.config();

// ------------------
// MONGODB CONNECTION
// ------------------
if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts);
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

// ------------------
// GEOfence HELPERS
// ------------------
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

// ------------------
// TOKEN REFRESH FUNCTION
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
        refresh_token: user.stravaRefreshToken,
      }),
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
      logger.error(
        `User ${user.id}: Failed to refresh token. ${JSON.stringify(tokenData)}`
      );
    }
  }
}

// ------------------
// ACTIVITY PROCESSING FUNCTION
// ------------------
async function processActivity(activity, accessToken, eventStart, eventEnd) {
  const activityStartUnix = Math.floor(
    new Date(activity.start_date).getTime() / 1000
  );
  const activityEndUnix = activityStartUnix + activity.elapsed_time;
  const effectiveStart = Math.max(activityStartUnix, eventStart);
  const effectiveEnd = Math.min(activityEndUnix, eventEnd);

  if (effectiveEnd <= effectiveStart) {
    return {
      ...activity,
      partial_distance: 0,
      partial_time: 0,
      note: "No overlap with event window",
    };
  }

  // Calculate effective time (in seconds)
  const partialTime = effectiveEnd - effectiveStart;
  const offsetStart = effectiveStart - activityStartUnix;
  const offsetEnd = effectiveEnd - activityStartUnix;

  const streamResponse = await fetch(
    `https://www.strava.com/api/v3/activities/${activity.id}/streams?keys=time,distance&key_by_type=true`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  const streams = await streamResponse.json();
  const timeStream = streams.time?.data;
  const distanceStream = streams.distance?.data;
  if (!timeStream || !distanceStream) {
    return {
      ...activity,
      partial_distance: 0,
      partial_time: partialTime,
      note: "Streams not available",
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
    partial_time: partialTime,
  };
}

// ------------------
// HELPER: Format Seconds to HH:MM:SS
// ------------------
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function parseTime(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  if (parts.length !== 3) return 0;
  return parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);
}


// ------------------
// MAIN PROCESS FUNCTION
// ------------------

async function processUsers() {
  await dbConnect();
  const users = await User.find({
    stravaAccessToken: { $exists: true, $ne: null },
  });
  logger.info(`Found ${users.length} users with Strava tokens.`);

  const facilityCenter = {
    lat: process.env.FACILITY_LAT ? parseFloat(process.env.FACILITY_LAT) : 43.211822,
    lng: process.env.FACILITY_LNG ? parseFloat(process.env.FACILITY_LNG) : 27.894898,
  };
  const geofenceRadiusMeters = process.env.GEOFENCE_RADIUS
    ? parseInt(process.env.GEOFENCE_RADIUS)
    : 800;


  const eventMorningStart = process.env.EVENT_MORNING_START
    ? parseInt(process.env.EVENT_MORNING_START)
    : 6; // 6 AM
  const eventMorningEnd = process.env.EVENT_MORNING_END
    ? parseInt(process.env.EVENT_MORNING_END)
    : 7; // 7 AM
  const eventEveningStart = process.env.EVENT_EVENING_START
    ? parseInt(process.env.EVENT_EVENING_START)
    : 18; // 6 PM
  const eventEveningEnd = process.env.EVENT_EVENING_END
    ? parseInt(process.env.EVENT_EVENING_END)
    : 19; // 7 PM

  // Define overall day window (from midnight to 23:59:59)
  const now = new Date();
  const dayStart = Math.floor(
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime() / 1000
  );
  const dayEnd = Math.floor(
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime() / 1000
  );

  // Calculate morning and evening windows (Unix timestamps)
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
    // Skip if already processed today.
    if (user.lastCronFetch && isToday(new Date(user.lastCronFetch))) {
      logger.info(`Skipping user ${user.id} as data was already fetched today.`);
      continue;
    }

    try {
      await refreshUserToken(user);
    } catch (err) {
      logger.error(`Error refreshing token for user ${user.id}: ${err}`);
      continue;
    }

    // Fetch all activities for the day.
    const response = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?after=${dayStart}&before=${dayEnd}&per_page=30`,
      {
        headers: { Authorization: `Bearer ${user.stravaAccessToken}` },
      }
    );
    const activities = await response.json();
    logger.info(`User ${user.id} fetched ${activities.length} activities for the day.`);

    // Filter for Run activities and validate by geofence.
    let runActivities = activities.filter((activity) => activity.type === "Run");
    runActivities = runActivities.filter((activity) => {
      const startLatLng = activity.start_latlng;
      return isWithinGeofence(startLatLng, facilityCenter, geofenceRadiusMeters);
    });

    // Process each run for both morning and evening windows.
    let morningResults = [];
    let eveningResults = [];
    for (const activity of runActivities) {
      const morningResult = await processActivity(activity, user.stravaAccessToken, morningStart, morningEnd);
      const eveningResult = await processActivity(activity, user.stravaAccessToken, eveningStart, eveningEnd);
      // Only add if there's a positive overlap.
      if (morningResult.partial_time > 0) {
        morningResults.push(morningResult);
      }
      if (eveningResult.partial_time > 0) {
        eveningResults.push(eveningResult);
      }
    }
    logger.info(`User ${user.id} morning processed activities: ${JSON.stringify(morningResults)}`);
    logger.info(`User ${user.id} evening processed activities: ${JSON.stringify(eveningResults)}`);

    // Aggregate results from both windows.
    let currentDistance = 0;
    let currentTime = 0;
    [...morningResults, ...eveningResults].forEach((run) => {
      currentDistance += run.partial_distance || 0;
      currentTime += run.partial_time || 0;
    });

    logger.info(`User ${user.id} current session: Distance: ${currentDistance.toFixed(2)} km, Time: ${formatTime(currentTime)}`);

    let sessionPace = "0:00";
    if (currentDistance > 0) {
      const paceSec = Math.floor(currentTime / currentDistance);
      const m = Math.floor(paceSec / 60);
      const s = paceSec % 60;
      sessionPace = `${m}:${s.toString().padStart(2, "0")}`;
    }

    try {
      const todayDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      await Leaderboard.create({
        userId:   user._id,
        date:     todayDate,
        distance: parseFloat(currentDistance.toFixed(2)),
        time:     currentTime,
        pace:     sessionPace
      });
      logger.info(`Leaderboard saved for ${user.id} on ${todayDate}`);
    } catch (err) {
      logger.error(`Leaderboard insert failed for ${user.id}: ${err}`);
    }

    // Parse existing totals from user (if not present, default to 0)
    const prevDistance = parseFloat(user.totalDistance.replace('KM', '')) || 0;
    const prevTime = parseTime(user.totalTime) || 0;

    // Add the new session totals to the previous totals.
    const newTotalDistance = prevDistance + currentDistance;
    const newTotalTime = prevTime + currentTime;

    // Calculate new average pace (time per km)
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

    // Update user document with aggregated data
    user.totalDistance = `${newTotalDistance.toFixed(2)}KM`;
    user.totalTime = formatTime(newTotalTime);
    user.averagePace = newAveragePace;
    user.lastCronFetch = new Date();
    await user.save();

  }
}


// ------------------
// SCHEDULE THE JOB
// ------------------
processUsers()
  .then(() => {
    logger.info("All users processed.");
    process.exit(0);
  })
  .catch((err) => {
    logger.error("Error processing users:", err);
    process.exit(1);
  });

// Uncomment below to schedule the job (e.g., every day at 10:00 PM)
// cron.schedule('0 22 * * *', async () => {
//   logger.info("Running scheduled token refresh and activity fetch job...");
//   try {
//     await processUsers();
//     logger.info("Scheduled job completed successfully.");
//   } catch (err) {
//     logger.error("Error during scheduled job:", err);
//   }
// });

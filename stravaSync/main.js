import dotenv from "dotenv";
import mongoose from "mongoose";
import fetch from "node-fetch";
import logger from "./logger.js";
import Leaderboard from "./models/Leaderboard.js";
import User from "./models/User.js";
import moment from "moment-timezone";
import sendLogsToDiscord from "./sendLogs.js"; 

// ------------------
// CONFIGURATION
// ------------------
dotenv.config();

moment.tz.setDefault("Africa/Lagos");

const {
  MONGODB_URI,
  STRAVA_CLIENT_ID,
  STRAVA_CLIENT_SECRET,
  FACILITY_LAT = "43.211822",
  FACILITY_LNG = "27.894898",
  GEOFENCE_RADIUS = "800",
  EVENT_MORNING_START = "6",
  EVENT_MORNING_END = "7",
  EVENT_EVENING_START = "18",
  EVENT_EVENING_END = "19",
} = process.env;

if (!MONGODB_URI || !STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET) {
  throw new Error(
    "Missing required environment variables: MONGODB_URI, STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET"
  );
}

const facilityCenter = {
  lat: parseFloat(FACILITY_LAT),
  lng: parseFloat(FACILITY_LNG),
};
const geofenceRadius = parseInt(GEOFENCE_RADIUS, 10);

// ------------------
// DATABASE
// ------------------
let cached = global.mongoose;
async function connectDb() {
  if (cached?.conn) return cached.conn;
  if (!cached) cached = global.mongoose = { conn: null, promise: null };
  cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  cached.conn = await cached.promise;
  logger.info("Connected to MongoDB");
  return cached.conn;
}

// ------------------
// GEO-FENCE HELPERS
// ------------------
const toRadians = deg => (deg * Math.PI) / 180;
function calculateDistance(lat1, lng1, lat2, lng2) {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function isWithinGeofence([lat, lng], center, radius) {
  if (lat == null || lng == null) {
    logger.info(`Geofence check: missing coords → outside`);
    return false;
  }

  logger.info(
    `Geofence check: ` +
    `point=(${lat.toFixed(6)},${lng.toFixed(6)}), ` +
    `center=(${center.lat.toFixed(6)},${center.lng.toFixed(6)}), ` +
    `radius=${radius}m`
  );

  const distance = calculateDistance(lat, lng, center.lat, center.lng);
  const inside   = distance <= radius;

  logger.info(
    `Geofence result: distance=${distance.toFixed(2)}m → ` +
    (inside ? 'INSIDE' : 'OUTSIDE')
  );

  return inside;
}

// ------------------
// STRAVA API HELPERS
// ------------------
async function refreshUserToken(user) {
  if (user.stravaExpiresAt > Date.now()) return;
  logger.info(`Refreshing token for user ${user.id}`);
  const res = await fetch("https://www.strava.com/api/v3/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: user.stravaRefreshToken,
    }),
  });
  const data = await res.json();
  if (data.access_token) {
    user.stravaAccessToken = data.access_token;
    user.stravaRefreshToken = data.refresh_token;
    user.stravaExpiresAt = Date.now() + data.expires_in * 1000;
    await user.save();
    logger.info(`Token refreshed for user ${user.id}`);
  } else {
    logger.error(`Failed to refresh for ${user.id}: ${JSON.stringify(data)}`);
  }
}

async function fetchActivities(user, after, before) {
  const url = new URL("https://www.strava.com/api/v3/athlete/activities");
  url.searchParams.set("after", after);
  url.searchParams.set("before", before);
  url.searchParams.set("per_page", "30");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${user.stravaAccessToken}` },
  });
  return res.json();
}

async function fetchActivityStreams(activityId, token) {
  const url = `https://www.strava.com/api/v3/activities/${activityId}/streams?keys=time,distance&key_by_type=true`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  return res.json();
}

// ------------------
// EVENT WINDOW CALCULATOR
// ------------------
function parseHhMm(str = "00:00") {
  const [h, m = "0"] = str.split(":");
  return { hour: Number(h), minute: Number(m) };
}

function parseHmsToSeconds(str = "00:00:00") {
  const [h, m, s] = (str.split(":").map(Number));
  return h*3600 + m*60 + s;
}


function getUnixWindow(startStr, endStr, m = moment()) {
  const {hour: hS, minute: mS} = parseHhMm(startStr);
  const {hour: hE, minute: mE} = parseHhMm(endStr);

  const start = m.clone().hour(hS).minute(mS).second(0).millisecond(0);
  const end   = m.clone().hour(hE).minute(mE).second(0).millisecond(0);

  return [start.unix(), end.unix()];
}


// ------------------
// ACTIVITY PROCESSOR
// ------------------
async function processActivity(activity, windows) {
  const duration = activity.moving_time;
  const speed = activity.distance / duration;

  return windows.map(([winStart, winEnd]) => {
    const startUnix = Math.floor(new Date(activity.start_date).getTime() / 1000);
    const overlapStart = Math.max(startUnix, winStart);
    const overlapEnd = Math.min(startUnix + duration, winEnd);
    if (overlapEnd <= overlapStart) return null;

    const partialTime = overlapEnd - overlapStart;
    const partialMeters = speed * partialTime;
    const partialKm = Number((partialMeters / 1000).toFixed(2));

    const paceSec = partialKm ? Math.floor(partialTime / partialKm) : 0;
    const pace = `${Math.floor(paceSec / 60)}:${(paceSec % 60).toString().padStart(2, "00")}`;

    return { dist: partialKm, time: partialTime, pace };
  }).filter(Boolean);
}

// ------------------
// DATABASE UPDATES
// ------------------
async function saveLeaderboard(userId, date, totalDist, totalTime, pace) {
  return Leaderboard.create({ userId, date, distance: totalDist, time: totalTime, pace });
}

async function updateUserTotals(user, sessionDist, sessionTime) {
  const prevDist = parseFloat(user.totalDistance) || 0;
  const prevTime = parseHmsToSeconds(user.totalTime);
  const newDist = prevDist + sessionDist;
  const newTime = prevTime + sessionTime;
  const paceSec = newDist ? Math.floor(newTime / newDist) : 0;
  user.totalDistance = `${newDist.toFixed(2)}KM`;
  user.totalTime = new Date(newTime * 1000).toISOString().substr(11, 8);
  user.averagePace = `${Math.floor(paceSec/60)}:${(paceSec%60).toString().padStart(2,"00")}`;
  user.lastCronFetch = new Date();
  return user.save();
}

// ------------------
// MAIN PROCESS
// ------------------
async function processUsers() {
  await connectDb();
  const today = moment();
  const [dayStart, dayEnd] = getUnixWindow("00:00", "24:00", today);

  const morningWindow = getUnixWindow(
    EVENT_MORNING_START,
    EVENT_MORNING_END,
    today
  );
  
  const eveningWindow = getUnixWindow(
    EVENT_EVENING_START,
    EVENT_EVENING_END,
    today
  );

  const users = await User.find({
    stravaAccessToken: { $exists: true, $ne: null },
    isAdmin: { $ne: true },
  });
  logger.info(`Found ${users.length} users`);

  for (const user of users) {
    if (  user.lastCronFetch &&
      moment(user.lastCronFetch)
        .tz('Africa/Lagos')
        .isSame(today, 'day') ) {
      logger.info(`User ${user.id} already fetched today, skipping`);
      continue;
    }
    await refreshUserToken(user);

    logger.info(`Processing user ${user.name} with id of: ${user.id}`);

    const activities = await fetchActivities(user, dayStart, dayEnd);

    const runs = activities.filter(a =>
      a.type === "Run" &&
      isWithinGeofence(a.start_latlng, facilityCenter, geofenceRadius)
    );

    let totalDist = 0, totalTime = 0;
    for (const run of runs) {
      // log actual moving and elapsed times
      logger.info(`Run ${run.id}: moving_time=${run.moving_time}s, elapsed_time=${run.elapsed_time}s`);
      const segments = await processActivity(run, [morningWindow, eveningWindow]);
      logger.info(`Segments for ${run.name}: ${JSON.stringify(segments)}`);
      segments.forEach(seg => { totalDist += seg.dist; totalTime += seg.time; });
    }

    if (totalDist > 0) {
      const paceSec = Math.floor(totalTime / totalDist);
      const pace = `${Math.floor(paceSec/60)}:${(paceSec%60).toString().padStart(2,"00")}`;
      await saveLeaderboard(user._id, today, totalDist.toFixed(2), totalTime, pace);
    }
    await updateUserTotals(user, totalDist, totalTime);
    logger.info(`User ${user.name} with id of ${user.id} processed: ${totalDist.toFixed(2)}km in ${totalTime}s`);
  }
}

(async () => {
  try {
    await processUsers();
    logger.info("Initial run complete.");
  } catch (err) {
    logger.error("Cron job failed with error:", err);
  } finally {
    await sendLogsToDiscord();
    process.exit(0);
  }
})();

import dotenv from 'dotenv';
import moment from 'moment-timezone';
import logger from '../../utils/logger.js';
import sendLogsToDiscord from '../../utils/sendLogs.js';
import User from '../../models/User.js';
import Leaderboard from '../../models/Leaderboard.js';
import { refreshUserToken, fetchActivityById } from '../stravaApis.js';
import { calculateDistance, isWithinGeofence, parseHmsToSeconds } from '../../utils/helpers.js';

dotenv.config();

// Geofence & event window defaults
const facilityCenter = {
  lat: parseFloat(process.env.FACILITY_LAT || '43.211822'),
  lng: parseFloat(process.env.FACILITY_LNG || '27.894898'),
};
const geofenceRadius = parseInt(process.env.GEOFENCE_RADIUS || '800', 10);
const morningStart = process.env.EVENT_MORNING_START || '06:00';
const morningEnd   = process.env.EVENT_MORNING_END   || '07:00';
const eveningStart = process.env.EVENT_EVENING_START || '18:00';
const eveningEnd   = process.env.EVENT_EVENING_END   || '19:00';

// Parse HH:mm to hour/minute
function parseHhMm(str = '00:00') {
  const [h, m = '0'] = str.split(':');
  return { hour: Number(h), minute: Number(m) };
}

// Build UNIX window for today
function getUnixWindow(startStr, endStr, m = moment()) {
  const { hour: hS, minute: mS } = parseHhMm(startStr);
  const { hour: hE, minute: mE } = parseHhMm(endStr);
  const start = m.clone().hour(hS).minute(mS).second(0).millisecond(0);
  const end   = m.clone().hour(hE).minute(mE).second(0).millisecond(0);
  return [start.unix(), end.unix()];
}

// Generate segments from activity summary
function processActivity(activity, windows) {
  const startUnix = Math.floor(new Date(activity.start_date).getTime() / 1000);
  const duration  = activity.moving_time;
  const speed     = activity.distance / duration; // m/s

  return windows.map(([winStart, winEnd]) => {
    const overlapStart = Math.max(startUnix, winStart);
    const overlapEnd   = Math.min(startUnix + duration, winEnd);
    if (overlapEnd <= overlapStart) return null;

    const partialTime   = overlapEnd - overlapStart;
    const partialMeters = speed * partialTime;
    const partialKm     = Number((partialMeters / 1000).toFixed(2));

    const paceSec = partialKm ? Math.floor(partialTime / partialKm) : 0;
    const pace    = `${Math.floor(paceSec / 60)}:${String(paceSec % 60).padStart(2, '00')}`;

    return { dist: partialKm, time: partialTime, pace };
  }).filter(Boolean);
}

export async function processSingleActivity(stravaUserId, activityId) {
  logger.info(`\n=== Processing Strava webhook for activity ${activityId} ===`);

  // 1) Lookup user
  const user = await User.findOne({ stravaId: Number(stravaUserId) });
  if (!user) {
    logger.warn(`No local user for Strava ID ${stravaUserId}, aborting.`);
    return;
  }

  // 2) Refresh token if needed
  await refreshUserToken(user);

  // 3) Fetch activity summary
  const activity = await fetchActivityById(activityId, user.stravaAccessToken);
  logger.info(`Fetched activity: type=${activity.type}, start_at=${activity.start_date}`);

  // Skip non-runs or outside geofence
  if (activity.type !== 'Run') {
    logger.info(`Skipping activity ${activityId}: not a Run.`);
    return;
  }
  if (!isWithinGeofence(activity.start_latlng, facilityCenter, geofenceRadius)) {
    logger.info(`Skipping activity ${activityId}: start outside geofence.`);
    return;
  }

  // 4) Build time windows
  const today = moment();
  const morningWindow = getUnixWindow(morningStart, morningEnd, today);
  const eveningWindow = getUnixWindow(eveningStart, eveningEnd, today);
  logger.info(`Windows: morning ${morningStart}-${morningEnd}, evening ${eveningStart}-${eveningEnd}`);

  // 5) Compute qualifying segments
  const segments = processActivity(activity, [morningWindow, eveningWindow]);
  logger.info(`Found ${segments.length} segment(s)`);

  // 6) Save segments & update totals
  if (segments.length === 0) {
    logger.info(`No qualifying segments for activity ${activityId}.`);
  } else {
    let totalDist = 0, totalTime = 0;
    segments.forEach(s => { totalDist += s.dist; totalTime += s.time; });

    // Save leaderboard entry
    const paceSec = Math.floor(totalTime / totalDist);
    const overallPace = `${Math.floor(paceSec/60)}:${String(paceSec%60).padStart(2,'00')}`;
    await Leaderboard.create({
      userId:   user._id,
      date:     moment().startOf('day').toDate(),
      distance: totalDist.toFixed(2),
      time:     totalTime,
      pace:     overallPace,
    });

    // Update user totals
    const prevDist = parseFloat(user.totalDistance) || 0;
    const prevTime = parseHmsToSeconds(user.totalTime);
    const newDist  = prevDist + totalDist;
    const newTime  = prevTime + totalTime;
    const newPaceSec = newDist ? Math.floor(newTime / newDist) : 0;
    user.totalDistance = `${newDist.toFixed(2)}KM`;
    user.totalTime     = new Date(newTime * 1000).toISOString().substr(11, 8);
    user.averagePace   = `${Math.floor(newPaceSec/60)}:${String(newPaceSec%60).padStart(2,'00')}`;
    user.lastCronFetch = new Date();
    await user.save();

    logger.info(`Saved segments: ${totalDist.toFixed(2)} km in ${totalTime}s @ ${overallPace}`);
  }

  logger.info(`Finished processing activity ${activityId}.`);
  await sendLogsToDiscord();
}

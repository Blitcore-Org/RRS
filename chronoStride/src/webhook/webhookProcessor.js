import dotenv from 'dotenv';
import moment from 'moment-timezone';
import logger from '../../utils/logger.js';
import sendLogsToDiscord from '../../utils/sendLogs.js';
import User from '../../models/User.js';
import Leaderboard from '../../models/Leaderboard.js';
import { refreshUserToken, fetchActivityById } from '../stravaApis.js';
import {  isWithinGeofence, parseHmsToSeconds } from '../../utils/helpers.js';

dotenv.config();

const facilityCenter = {
  lat: parseFloat(process.env.FACILITY_LAT),
  lng: parseFloat(process.env.FACILITY_LNG),
};
const geofenceRadius = parseInt(process.env.GEOFENCE_RADIUS || '800', 10);
const morningStart = process.env.EVENT_MORNING_START;
const morningEnd   = process.env.EVENT_MORNING_END;
const eveningStart = process.env.EVENT_EVENING_START;
const eveningEnd   = process.env.EVENT_EVENING_END;


function parseHhMm(str = '00:00') {
  const [h, m = '0'] = str.split(':');
  return { hour: Number(h), minute: Number(m) };
}

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

    return { window: `${moment.unix(winStart).format('HH:mm')}-${moment.unix(winEnd).format('HH:mm')}`, dist: partialKm, time: partialTime, pace };
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
  logger.info(`Found user: ${user.name} (ID: ${user._id})`);

  // 2) Refresh token if needed
  await refreshUserToken(user);

  // 3) Fetch activity summary
  const activity = await fetchActivityById(activityId, user.stravaAccessToken);
  logger.info(`Fetched activity: type=${activity.type}, start_at=${activity.start_date}`);

  // Skip non-runs
  if (activity.type !== 'Run') {
    logger.info(`Skipping activity ${activityId}: not a Run.`);
    return;
  }

  // 4) Geofence check
  const startLatLng = activity.start_latlng;
  const insideGeofence = isWithinGeofence(startLatLng, facilityCenter, geofenceRadius);
  logger.info(`Start location [${startLatLng}] is ${insideGeofence ? 'INSIDE' : 'OUTSIDE'} the geofence (center=${JSON.stringify(facilityCenter)}, radius=${geofenceRadius}m)`);
  if (!insideGeofence) {
    logger.info(`Skipping activity ${activityId}: outside geofence.`);
    return;
  }

  // 5) Build and log time windows
  const today = moment();
  const morningWindow = getUnixWindow(morningStart, morningEnd, today);
  const eveningWindow = getUnixWindow(eveningStart, eveningEnd, today);
  logger.info(`Morning session window: ${morningStart}-${morningEnd} => [${moment.unix(morningWindow[0]).format('HH:mm')} - ${moment.unix(morningWindow[1]).format('HH:mm')}]`);
  logger.info(`Evening session window: ${eveningStart}-${eveningEnd} => [${moment.unix(eveningWindow[0]).format('HH:mm')} - ${moment.unix(eveningWindow[1]).format('HH:mm')}]`);

  const activityStartUnix = Math.floor(new Date(activity.start_date).getTime() / 1000);
  if (activityStartUnix >= morningWindow[0] && activityStartUnix <= morningWindow[1]) {
    logger.info(`Activity start time ${moment.unix(activityStartUnix).format('HH:mm')} is within the MORNING session.`);
  } else if (activityStartUnix >= eveningWindow[0] && activityStartUnix <= eveningWindow[1]) {
    logger.info(`Activity start time ${moment.unix(activityStartUnix).format('HH:mm')} is within the EVENING session.`);
  } else {
    logger.info(`Activity start time ${moment.unix(activityStartUnix).format('HH:mm')} is outside both morning and evening sessions.`);
  }

  // 6) Compute qualifying segments
  const segments = processActivity(activity, [morningWindow, eveningWindow]);
  logger.info(`Computed ${segments.length} qualifying segment(s): ${JSON.stringify(segments)}`);

  // 7) Save segments & update totals
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
    logger.info(`Saved leaderboard: distance=${totalDist.toFixed(2)}km, time=${totalTime}s, pace=${overallPace}`);

    // Update user totals
    const prevDist = parseFloat(user.totalDistance) || 0;
    const prevTime = parseHmsToSeconds(user.totalTime);
    const newDist  = prevDist + totalDist;
    const newTime  = prevTime + totalTime;
    const newPaceSec = newDist ? Math.floor(newTime / newDist) : 0;

    const oldPosition = user.currentPosition || null;

    user.totalDistance = `${newDist.toFixed(2)}KM`;
    user.totalTime     = new Date(newTime * 1000).toISOString().substr(11, 8);
    user.averagePace   = `${Math.floor(newPaceSec/60)}:${String(newPaceSec%60).padStart(2,'00')}`;
    user.lastCronFetch = new Date();

    const allUsers = await User
    .find({}, '_id')
    .sort({ totalDistanceKm: -1 })
    .lean();

    const newPosition = allUsers.findIndex(u => u._id.equals(user._id)) + 1;

    user.lastPosition    = oldPosition;
    user.currentPosition = newPosition;

    await user.save();

    logger.info(`Updated user totals: totalDistance=${user.totalDistance}, totalTime=${user.totalTime}, averagePace=${user.averagePace}`);
  }

  logger.info(`Finished processing activity ${activityId}.`);
  await sendLogsToDiscord();
}

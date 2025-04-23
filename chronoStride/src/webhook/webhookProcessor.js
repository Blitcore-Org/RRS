import dotenv from 'dotenv';
dotenv.config();

import User from '../../models/User.js';
import Leaderboard from '../../models/Leaderboard.js';
import moment from 'moment-timezone';
import logger from '../../utils/logger.js';
import sendLogsToDiscord from '../../utils/sendLogs.js';
import { isWithinGeofence, getUnixWindow, calculateDistance, parseHmsToSeconds } from '../../utils/helpers.js';
import { refreshUserToken, fetchActivityById, fetchActivityStreams } from '../stravaApis.js';

// facility & env defaults
const facilityCenter = {
  lat: parseFloat(process.env.FACILITY_LAT),
  lng: parseFloat(process.env.FACILITY_LNG),
};
const geofenceRadius = parseInt(process.env.GEOFENCE_RADIUS || '800', 10);

const morningStart = process.env.EVENT_MORNING_START || '06:00';
const morningEnd   = process.env.EVENT_MORNING_END   || '07:00';
const eveningStart = process.env.EVENT_EVENING_START || '18:00';
const eveningEnd   = process.env.EVENT_EVENING_END   || '19:00';


function computeSegmentsFromStreams(streams, activityStartUnix) {
  const times     = streams.time.data;
  const distances = streams.distance.data;
  const latlngs   = streams.latlng.data;

  logger.info(`1) Checking ${times.length} GPS points against our geofence.`);
  logger.info(`   • Facility center: (${facilityCenter.lat}, ${facilityCenter.lng})`);
  logger.info(`   • Geofence radius: ${geofenceRadius} m`);

  // Sample a few points for eyeballing
  [0,1,2, latlngs.length-1].forEach(i => {
    if (i < 0 || i >= latlngs.length) return;
    const [lat,lng] = latlngs[i];
    const d = calculateDistance(lat, lng, facilityCenter.lat, facilityCenter.lng);
    logger.info(`   • Point[${i}] at (${lat},${lng}) is ${d.toFixed(1)} m from center.`);
  });

  // Find first/last in-fence indices
  let firstIn = null, lastIn = null;
  latlngs.forEach(([lat,lng], i) => {
    if (isWithinGeofence([lat,lng], facilityCenter, geofenceRadius)) {
      firstIn = firstIn === null ? i : firstIn;
      lastIn  = i;
    }
  });

  if (firstIn === null) {
    logger.info(`2) No GPS points entered the geofence. Skipping segment calculation.`);
    return [];
  }
  logger.info(`2) In-fence run from point ${firstIn} to ${lastIn}.`);

  // Convert to absolute timestamps
  const absTimes = times.map(s => activityStartUnix + s);
  logger.info(
    `3) Activity ran from ${new Date(absTimes[0]*1000).toLocaleTimeString()} ` +
    `to ${new Date(absTimes[absTimes.length-1]*1000).toLocaleTimeString()}.`
  );

  // Build time windows
  const today = moment();
  const [mStart, mEnd] = getUnixWindow(morningStart, morningEnd, today);
  const [eStart, eEnd] = getUnixWindow(eveningStart, eveningEnd, today);
  logger.info(`4) Morning window: ${morningStart} → ${morningEnd}`);
  logger.info(`   Evening window: ${eveningStart} → ${eveningEnd}`);

  const segments = [];
  for (const { label, start, end } of [
    { label: 'morning', start: mStart, end: mEnd },
    { label: 'evening', start: eStart, end: eEnd }
  ]) {
    const segStart = Math.max(start, absTimes[firstIn]);
    const segEnd   = Math.min(end,   absTimes[lastIn]);
    logger.info(
      `5) ${label.charAt(0).toUpperCase()+label.slice(1)} clip → ` +
      `${new Date(segStart*1000).toLocaleTimeString()}–` +
      `${new Date(segEnd*1000).toLocaleTimeString()}`
    );

    if (segEnd <= segStart) {
      logger.info(`   • No overlap in the ${label} window.`);
      continue;
    }

    const iS = absTimes.findIndex(t => t >= segStart);
    const iE = absTimes.findIndex(t => t >= segEnd);
    logger.info(`   • Using stream indices ${iS} → ${iE}.`);

    const timeSec    = times[iE]     - times[iS];
    const distMeters = distances[iE] - distances[iS];
    const distKm     = +(distMeters/1000).toFixed(2);
    const paceSec    = distKm ? Math.floor(timeSec / distKm) : 0;
    const pace       = `${Math.floor(paceSec/60)}:${String(paceSec%60).padStart(2,'00')}`;

    segments.push({ window: label, dist: distKm, time: timeSec, pace });
    logger.info(`   → ${label}: ${distKm} km in ${timeSec}s (pace ${pace}).`);
  }

  return segments;
}

async function updateUserTotals(user, sessionDist, sessionTime) {
  const prevDist = parseFloat(user.totalDistance) || 0;
  const prevTime = parseHmsToSeconds(user.totalTime);
  const newDist  = prevDist + sessionDist;
  const newTime  = prevTime + sessionTime;
  const paceSec  = newDist ? Math.floor(newTime / newDist) : 0;

  user.totalDistance = `${newDist.toFixed(2)}KM`;
  user.totalTime     = new Date(newTime * 1000).toISOString().substr(11, 8);
  user.averagePace   = `${Math.floor(paceSec/60)}:${String(paceSec%60).padStart(2,'00')}`;
  user.lastCronFetch = new Date();

  await user.save();
  logger.info(`   • Updated user totals: ${user.totalDistance}, ${user.totalTime}, pace ${user.averagePace}`);
}


export async function processSingleActivity(stravaUserId, activityId) {
  logger.info(`\n=== Processing Strava webhook for activity ${activityId} ===`);
  // 1) Lookup user
  logger.info(`1) Looking up local user for Strava ID ${stravaUserId}...`);
  const user = await User.findOne({ stravaId: Number(stravaUserId) });
  if (!user) {
    logger.warn(`   • No local user found. Aborting.`);
    return;
  }
  logger.info(`   • Found user ${user.name} (DB id ${user._id}).`);

  // 2) Refresh token
  logger.info(`2) Checking/refreshing Strava access token...`);
  await refreshUserToken(user);
  logger.info(`   • Strava token is valid.`);

  // 3) Fetch activity
  logger.info(`3) Fetching activity ${activityId} details from Strava...`);
  const activity = await fetchActivityById(activityId, user.stravaAccessToken);
  logger.info(`   • Activity start: ${new Date(activity.start_date).toLocaleString()}.`);

  // 4) Fetch streams
  logger.info(`4) Fetching GPS & distance streams...`);
  const streams = await fetchActivityStreams(activityId, user.stravaAccessToken);
  logger.info(`   • Received ${Object.keys(streams).join(', ')} streams.`);

  // 5) Compute absolute start
  const startUnix = Math.floor(new Date(activity.start_date).getTime()/1000);
  logger.info(`5) Activity start timestamp: ${startUnix} (local ${new Date(startUnix*1000).toLocaleTimeString()}).`);

  // 6) Compute segments
  logger.info(`6) Computing in-fence/time-window segments…`);
  const segments = computeSegmentsFromStreams(streams, startUnix);
  logger.info(`   • ${segments.length} segment(s) qualified.`);

  // 7) Save or skip
  if (segments.length === 0) {
    logger.info(`7) No segments to save for activity ${activityId}.`);
  } else {
    logger.info(`7) Saving segments to leaderboard:`);
    let totalD = 0, totalT = 0;
    segments.forEach(s => {
      logger.info(`   • ${s.window}: ${s.dist} km in ${s.time}s @ pace ${s.pace}`);
      totalD += s.dist; totalT += s.time;
    });
    const paceSec = Math.floor(totalT / totalD);
    const overallPace = `${Math.floor(paceSec/60)}:${String(paceSec%60).padStart(2,'00')}`;
    await Leaderboard.create({
      userId:   user._id,
      date:     moment().startOf('day').toDate(),
      distance: totalD.toFixed(2),
      time:      totalT,
      pace:     overallPace,
    });

    await updateUserTotals(user, totalD, totalT);

    logger.info(`   → Total: ${totalD.toFixed(2)} km, ${totalT}s, pace ${overallPace}`);
  }

  logger.info(`8) Finished processing activity ${activityId}.\n`);
  await sendLogsToDiscord();
}

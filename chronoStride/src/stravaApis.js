import fetch from 'node-fetch';
import logger from '../utils/logger.js';

export async function refreshUserToken(user) {
  if (user.stravaExpiresAt > Date.now()) return;
  logger.info(`Refreshing token for user ${user.stravaId}`);
  const res = await fetch('https://www.strava.com/api/v3/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: user.stravaRefreshToken,
    }),
  });
  const data = await res.json();
  if (data.access_token) {
    user.stravaAccessToken = data.access_token;
    user.stravaRefreshToken = data.refresh_token;
    user.stravaExpiresAt = Date.now() + data.expires_in * 1000;
    await user.save();
    logger.info(`Token refreshed for user ${user.stravaId}`);
  } else {
    logger.error(`Token refresh failed: ${JSON.stringify(data)}`);
  }
}

export async function fetchActivityById(activityId, accessToken) {
  const url = `https://www.strava.com/api/v3/activities/${activityId}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.json();
}

export async function fetchActivityStreams(activityId, accessToken) {
  const url = `https://www.strava.com/api/v3/activities/${activityId}/streams?keys=time,distance,latlng&key_by_type=true`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
  return res.json();
}
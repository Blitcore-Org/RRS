import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import moment from 'moment-timezone';

async function refreshTokenIfNeeded(user) {
  if (user.stravaExpiresAt <= Date.now()) {
    const resp = await fetch('https://www.strava.com/api/v3/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id:     process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        grant_type:    'refresh_token',
        refresh_token: user.stravaRefreshToken,
      }),
    });
    const data = await resp.json();
    if (!data.access_token) {
      throw new Error('Failed to refresh Strava token: ' + (data.message || JSON.stringify(data)));
    }
    user.stravaAccessToken  = data.access_token;
    user.stravaRefreshToken = data.refresh_token;
    user.stravaExpiresAt    = Date.now() + data.expires_in * 1000;
    await user.save();
  }
}

function parseHhMm(str = '00:00') {
  const [h, m = '0'] = str.split(':');
  return { hour: +h, minute: +m };
}

function getSessionBounds(dateStr, windowStr) {
  const [startStr, endStr] = windowStr.split('-');
  const { hour: hS, minute: mS } = parseHhMm(startStr);
  const { hour: hE, minute: mE } = parseHhMm(endStr);

  const base = moment.tz(dateStr, 'YYYY-MM-DD', 'Africa/Lagos');
  const start = base.clone().hour(hS).minute(mS).second(0).millisecond(0);
  const end   = base.clone().hour(hE).minute(mE).second(0).millisecond(0);
  return [start.unix(), end.unix()];
}

export async function POST(request) {
  try {

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) return NextResponse.json({ error: 'Not authorized' }, { status: 403 });

    const { userId, date, session } = await request.json();
    if (!userId || !date || !session) {
      return NextResponse.json(
        { error: 'userId, date and session are required' },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    await refreshTokenIfNeeded(user);

    const [after, before] = getSessionBounds(date, session);

    const listRes = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?after=${after}&before=${before}&per_page=200`,
      { headers: { Authorization: `Bearer ${user.stravaAccessToken}` } }
    );
    const activities = await listRes.json();
    if (!Array.isArray(activities)) {
      return NextResponse.json({ error: activities.message || 'Strava error' }, { status: 502 });
    }

    const run = activities[0];
    if (!run) {
      return NextResponse.json({ error: `No activities on ${date} during ${session}` }, { status: 404 });
    }

    const winStart = after, winEnd = before;
    const startUnix = Math.floor(new Date(run.start_date).getTime() / 1000);
    const endUnix   = startUnix + run.moving_time;
    const overlapStart = Math.max(startUnix, winStart);
    const overlapEnd   = Math.min(endUnix,   winEnd);

    if (overlapEnd <= overlapStart) {
      return NextResponse.json(
        { error: `Run ${run.id} exists but doesn’t overlap ${session}` },
        { status: 400 }
      );
    }

    const partialTime   = overlapEnd - overlapStart;
    const speed         = run.distance / run.moving_time;
    const partialMeters = speed * partialTime;
    const distanceKm    = Number((partialMeters / 1000).toFixed(2));
    const paceSec       = Math.floor(partialTime / distanceKm);
    const pace          = `${Math.floor(paceSec / 60)}:${String(paceSec % 60).padStart(2,'00')}`;

    return NextResponse.json({
      type:       run.type,
      activityId: run.id,
      distance:   distanceKm,
      time:       partialTime,
      pace,
    });
  } catch (err) {
    console.error('Fetch-by-date error:', err);
    if (err.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

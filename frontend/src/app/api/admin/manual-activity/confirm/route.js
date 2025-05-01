import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

function parseHmsToSeconds(str = "00:00:00") {
  const [h, m, s] = (str.split(":").map(Number));
  return h*3600 + m*60 + s;
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const { userId, date, session, distance, time, pace } = await request.json();
    if (!userId || !date || !session || distance == null || time == null || !pace) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const prevDist = parseFloat(user.totalDistance) || 0;
    const prevTime = parseHmsToSeconds(user.totalTime);
    const newDist  = prevDist + distance;
    const newTime  = prevTime + time;
    const newPaceSec = newDist ? Math.floor(newTime / newDist) : 0;

    user.totalDistance = `${newDist.toFixed(2)}KM`;
    user.totalTime     = new Date(newTime * 1000).toISOString().substr(11, 8);
    user.averagePace   = `${Math.floor(newPaceSec/60)}:${String(newPaceSec%60).padStart(2,'00')}`;
    await user.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Manual confirm error:', err);
    if (err.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

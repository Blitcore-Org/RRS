import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Leaderboard from '@/models/Leaderboard';
import User from '@/models/User';

function parseHmsToSeconds(str = "00:00:00") {
  const [h, m, s] = str.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export async function DELETE(request, context) {
  try {
    const cookieStore = await cookies();
    const token = await cookieStore.get('token');
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const userId = context.params.id;
    const sessionId = context.params.sessionId;

    if (!userId || !sessionId) {
      return NextResponse.json({ error: 'User ID and Session ID are required' }, { status: 400 });
    }

    await dbConnect();

    // Get the session to be deleted
    const session = await Leaderboard.findOne({ _id: sessionId, userId });
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Get the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete the session
    await Leaderboard.deleteOne({ _id: sessionId });

    // Recalculate user totals
    const allSessions = await Leaderboard.find({ userId });
    let totalDistance = 0;
    let totalTime = 0;

    allSessions.forEach(session => {
      totalDistance += parseFloat(session.distance);
      totalTime += session.time;
    });

    // Calculate new average pace
    const newPaceSec = totalDistance ? Math.floor(totalTime / totalDistance) : 0;
    const newPace = `${Math.floor(newPaceSec/60)}:${String(newPaceSec%60).padStart(2,'00')}`;

    // Update user
    user.totalDistance = `${totalDistance.toFixed(2)}KM`;
    user.totalTime = formatTime(totalTime);
    user.averagePace = newPace;

    await user.save();

    return NextResponse.json({ 
      message: 'Session deleted and totals recalculated',
      user: {
        totalDistance: user.totalDistance,
        totalTime: user.totalTime,
        averagePace: user.averagePace
      }
    });
  } catch (error) {
    console.error('Error deleting session:', error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  try {
    const cookieStore = await cookies();
    const token = await cookieStore.get('token');
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const userId = context.params.id;
    const sessionId = context.params.sessionId;

    if (!userId || !sessionId) {
      return NextResponse.json({ error: 'User ID and Session ID are required' }, { status: 400 });
    }

    const { distance, time, pace } = await request.json();

    await dbConnect();

    // Get the session to be updated
    const session = await Leaderboard.findOne({ _id: sessionId, userId });
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Get the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update the session
    await Leaderboard.updateOne(
      { _id: sessionId },
      { 
        distance: distance.toFixed(2),
        time,
        pace
      }
    );

    // Recalculate user totals
    const allSessions = await Leaderboard.find({ userId });
    let totalDistance = 0;
    let totalTime = 0;

    allSessions.forEach(session => {
      totalDistance += parseFloat(session.distance);
      totalTime += session.time;
    });

    // Calculate new average pace
    const newPaceSec = totalDistance ? Math.floor(totalTime / totalDistance) : 0;
    const newPace = `${Math.floor(newPaceSec/60)}:${String(newPaceSec%60).padStart(2,'00')}`;

    // Update user
    user.totalDistance = `${totalDistance.toFixed(2)}KM`;
    user.totalTime = formatTime(totalTime);
    user.averagePace = newPace;

    await user.save();

    return NextResponse.json({ 
      message: 'Session updated and totals recalculated',
      user: {
        totalDistance: user.totalDistance,
        totalTime: user.totalTime,
        averagePace: user.averagePace
      }
    });
  } catch (error) {
    console.error('Error updating session:', error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    );
  }
} 
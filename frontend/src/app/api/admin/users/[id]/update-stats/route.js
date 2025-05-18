import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

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
    const { totalTime, averagePace } = await request.json();

    if (!userId || !totalTime || !averagePace) {
      return NextResponse.json({ error: 'User ID, total time, and average pace are required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user stats
    user.totalTime = totalTime;
    user.averagePace = averagePace;

    await user.save();

    return NextResponse.json({ 
      message: 'User stats updated successfully',
      user: {
        totalTime: user.totalTime,
        averagePace: user.averagePace
      }
    });
  } catch (error) {
    console.error('Error updating user stats:', error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Failed to update user stats' },
      { status: 500 }
    );
  }
} 
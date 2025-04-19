import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    // Verify admin JWT token
    const cookieStore = cookies();
    const token = cookieStore.get('token');
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Verify JWT token and check if user is admin
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const { email, name, password, isAdmin } = await request.json();

    // Validate required fields
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    await dbConnect();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Find the last user to get the highest ID
    const lastUser = await User.findOne({}, {}, { sort: { 'id': -1 } });
    let nextIdNumber = 1;

    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    
    if (lastUser && lastUser.id) {
      const lastIdNumber = parseInt(lastUser.id.split('-')[1]);
      nextIdNumber = lastIdNumber + 1;
    }

    const newId = `RRS25-${nextIdNumber}`;

    // Create new user
    const newUser = await User.create({
      id: newId,
      email,
      name,
      password: hashed, // Store password as plain text
      isAdmin,
      forcePasswordChange: true,
      totalDistance: 0,
      totalTime: '00:00:00',
      averagePace: '00:00',
      best5km: '00:00:00',
      best10km: '00:00:00'
    });

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    return NextResponse.json(userResponse);
  } catch (error) {
    console.error('Create user error:', error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    
    // Verify JWT and admin claim
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const { email, name, password, isAdmin } = await request.json();
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      );
    }

    await dbConnect();
    if (await User.findOne({ email })) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Prepare hashed password
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    // Retry loop to avoid duplicate ID in concurrent inserts
    let newUser;
    const maxRetries = 5;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      // Compute next ID using numeric sort via aggregation
      const agg = await User.aggregate([
        { $match: { id: { $regex: '^RRS25-' } } },
        { $project: { num: { $toInt: { $arrayElemAt: [ { $split: ['$id', '-' ] }, 1 ] } } } },
        { $sort: { num: -1 } },
        { $limit: 1 }
      ]);
      const lastNum = agg.length ? agg[0].num : 0;
      const nextNum = lastNum + 1;
      const newId = `RRS25-${nextNum}`;

      try {
        newUser = await User.create({
          id: newId,
          email,
          name,
          password: hashed,
          isAdmin,
          forcePasswordChange: true,
          totalDistance: 0,
          totalTime: '00:00:00',
          averagePace: '00:00',
          best5km: '00:00:00',
          best10km: '00:00:00'
        });
        break; // success
      } catch (err) {
        // if duplicate ID, retry
        if (err.code === 11000 && err.keyPattern && err.keyPattern.id) {
          continue;
        }
        throw err;
      }
    }
    if (!newUser) {
      return NextResponse.json(
        { error: 'Could not generate unique user ID, please try again' },
        { status: 500 }
      );
    }

    // Prepare response
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

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    const { email, currentPassword, newPassword } = await request.json();
    
    await dbConnect();
    const user = await User.findOne({ email });

    if (!user || user.password !== currentPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update password and remove force change flag
    user.password = newPassword;
    user.forcePasswordChange = false;
    await user.save();

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user.toObject();
    userWithoutPassword.isAdmin = user.isAdmin;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateTemporaryPassword } from '@/utils/auth';

export async function POST(request) {
  try {
    const { userEmail } = await request.json();
    
    // Check if requester is admin
    const cookieStore = cookies();
    const userCookie = cookieStore.get('user');
    if (!userCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const adminUser = JSON.parse(userCookie.value);
    if (!adminUser.isAdmin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Generate temporary password
    const tempPassword = generateTemporaryPassword();

    // Update user's password and set force change flag
    await dbConnect();
    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { 
        password: tempPassword,
        forcePasswordChange: true 
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      message: 'Password reset successful',
      temporaryPassword: tempPassword 
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
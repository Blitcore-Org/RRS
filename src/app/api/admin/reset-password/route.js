import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateTemporaryPassword } from '@/utils/auth';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { userEmail } = await request.json();
    
    const cookieStore = cookies();
    const token = cookieStore.get('token');
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const tempPassword = generateTemporaryPassword();

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
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
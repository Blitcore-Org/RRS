import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const leaderboard = await db.get5KMLeaderboard();
    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('5KM leaderboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
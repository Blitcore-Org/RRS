import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const leaderboard = db.getOverallLeaderboard();
    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Overall leaderboard error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
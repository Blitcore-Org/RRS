import { NextResponse } from "next/server";

export async function GET(request) {
  const token = request.cookies.get("strava_access_token")?.value;
  const stravaConnected = Boolean(token);
  return NextResponse.json({ stravaConnected });
}

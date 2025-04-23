import { NextResponse } from "next/server";
import User from "@/models/User";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  if (error) {
    return new NextResponse(`Error: ${error}`, { status: 400 });
  }
  if (!code) {
    return new NextResponse("No authorization code provided.", { status: 400 });
  }
  if (!state) {
    return new NextResponse("Missing state parameter.", { status: 400 });
  }

  const userId = decodeURIComponent(state);

  const client_id = process.env.STRAVA_CLIENT_ID;
  const client_secret = process.env.STRAVA_CLIENT_SECRET;
  const tokenResponse = await fetch("https://www.strava.com/api/v3/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id,
      client_secret,
      code,
      grant_type: "authorization_code",
    }),
  });
  const tokenData = await tokenResponse.json();
  const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);


  await User.findOneAndUpdate(
    { _id: userId },
    {
      stravaAccessToken: tokenData.access_token,
      stravaRefreshToken: tokenData.refresh_token,
      stravaExpiresAt: expiresAt,
      stravaId: tokenData.athlete.id,
    },
    { new: true }
  );

  const response = NextResponse.redirect(new URL("/runner-profile", request.url));
  response.cookies.set("strava_access_token", tokenData.access_token, {
    httpOnly: true,
    path: "/",
  });
  response.cookies.set("strava_refresh_token", tokenData.refresh_token, {
    httpOnly: true,
    path: "/",
  });
  response.cookies.set("strava_expires_at", expiresAt.toISOString(), {
    httpOnly: true,
    path: "/",
  });
  return response;
}

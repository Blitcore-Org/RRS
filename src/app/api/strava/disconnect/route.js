import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import User from "@/models/User";

export async function POST(request) {
  // Get the JWT token from cookies
  const tokenCookie = request.cookies.get("token");
  if (!tokenCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    payload = (await jwtVerify(tokenCookie.value, secret)).payload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


  // Remove Strava tokens from the user record (using $unset to remove the fields)
  const updatedUser = await User.findOneAndUpdate(
    { _id: payload.id },
    {
      $unset: {
        stravaAccessToken: "",
        stravaRefreshToken: "",
        stravaExpiresAt: "",
      },
    },
    { new: true }
  );

  // Prepare the response and remove the Strava cookies if needed
  const response = NextResponse.json({ updatedUser });
  response.cookies.delete("strava_access_token", { path: "/" });
  response.cookies.delete("strava_refresh_token", { path: "/" });
  response.cookies.delete("strava_expires_at", { path: "/" });

  return response;
}

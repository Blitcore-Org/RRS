'use client'

import Button from "@/Components/button";
import SponsorTag from "@/Components/SponsorTag";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/Components/LoadingSpinner";
import ProfileSection from "@/Components/ProfileSection";
import axiosInstance from '@/utils/axiosInstance';
export default function RunnerProfile() {
  const { user, loading, fetchUser } = useUser();
  const [stravaConnected, setStravaConnected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    async function checkStravaStatus() {
      if (user.stravaAccessToken) {
        setStravaConnected(true);
      }
    }
    if(user) {
      checkStravaStatus();
    }
  }, [user]);

  const handleConnect = () => {
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI;
    const scope = "activity:read";
    const userId = user._id;
    const state = encodeURIComponent(userId);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      const stravaAppUrl = `strava://oauth/mobile/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=${scope}&state=${state}`;
      
      const stravaWebUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=${scope}&state=${state}`;
      
      const appWindow = window.open(stravaAppUrl, '_blank');
      
      setTimeout(() => {
        if (appWindow && !appWindow.closed) {
          appWindow.close();
          window.location.href = stravaWebUrl;
        }
      }, 100);
    } else {
      const stravaWebUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=code&scope=${scope}&state=${state}`;
      window.location.href = stravaWebUrl;
    }
  };

  const handleDisconnect = async () => {
    try {
      const { data } = await axiosInstance.post("/api/strava/disconnect");
      console.log("Disconnected from Strava:", data.updatedUser);
      fetchUser();
      setStravaConnected(false);
    } catch (error) {
      console.error("Error disconnecting from Strava:", error);
    }
  };


  useEffect(() => {
    if (!loading && !user) {
      console.log("User in profile:", user);
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <main
      className="
        w-full
        min-h-screen
        bg-[url('/Images/background.png')]
        bg-no-repeat
        bg-center
        bg-cover
        flex
        items-center
        justify-center
      "
    >
      {/* Contents container */}
      <div
        className="
          flex
          w-full
          h-full
          max-w-[402px]
          min-h-[600px]
          flex-col
          items-center
          rounded-[44px]
        "
      >
        {/* NavBar with back button */}
        <div
          className="
            flex
            flex-col
            items-center
            w-full
            rounded-tl-[44px]
            rounded-tr-[44px]
            relative
          "
        >
          {/* Back Button */}
          <Link href="/runner-overview" className="absolute left-6 top-6">
            <img
              src="/Images/back_button.png"
              alt="Back"
              className="w-[32px] h-[32px]"
            />
          </Link>

          {/* NavContents with smaller logo */}
          <div
            className="
              flex
              py-[12px]
              flex-col
              items-center
              w-full
            "
          >
            <img
              src="/Images/Logo.png"
              alt="RRS Logo"
              className="w-[50px] h-[45px]"
            />
          </div>
        </div>

        {/* Main content container */}
        <div
          className="
            flex
            flex-col
            flex-1
            w-full
            justify-between
            items-center
            gap-[20px]
            px-[20px]
          "
        >
          {/* Profile and Stats Container */}
          <div
            className="
              flex
              flex-col
              w-full
              items-center
              gap-[24px]
              mt-[20px]
            "
          >
          <ProfileSection user={user} />
            {/* Total Stats Widget */}
            <div className="w-full p-6 bg-primary rounded-[24px] text-white">
              <div className="flex justify-between items-center mb-4">
                <span className="text-secondary font-normal font-dm-sans leading-normal">Total Distance</span>
                <span className="text-secondary">{user.totalDistance}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-secondary font-normal font-dm-sans leading-normal">Total Time</span>
                <span className="text-secondary font-bold font-dm-sans leading-normal">{user.totalTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary font-normal font-dm-sans leading-normal">Average Pace</span>
                <span className="text-secondary font-bold font-dm-sans leading-normal">{user.averagePace}</span>
              </div>
            </div>

            {/* Reward Progress Widget */}
            <div className="w-full p-6 bg-primary rounded-[24px]">
              <h3 className="text-secondary font-normal leading-none font-thuast mb-4">REWARD PROGRESS</h3>
              <div className="flex justify-between items-center mb-3">
                <span className="text-secondary font-bold">Gold</span>
                <span className="text-[#FFD700]">
                  {user.totalDistance} / 150KM
                </span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-secondary font-bold">Silver</span>
                <span className="text-[#C0C0C0]">
                  {user.totalDistance} / 100KM
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary font-bold">Bronze</span>
                <span className="text-[#CD7F32]">
                  {user.totalDistance} / 50KM
                </span>
              </div>
            </div>

            {/* Best Times Widget */}
            <div className="w-full p-6 bg-primary rounded-[24px]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-secondary text-xl font-normal font-thuast leading-normal">5KM BEST</span>
                <span className="text-secondary font-bold font-dm-sans leading-normal">{user.best5km}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary text-xl font-normal font-thuast leading-normal">10KM BEST</span>
                <span className="text-secondary font-bold font-dm-sans leading-normal">{user.best10km}</span>
              </div>
            </div>
            
            {/* View on Strava Link */}
            {stravaConnected && (
              <div className="w-full p-6 bg-primary rounded-[24px]">
                <div className="flex justify-center">
                  <Link 
                    href={`https://www.strava.com/athletes/${user.stravaAthleteId || ''}`}
                    className="text-secondary font-bold hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Strava
                  </Link>
                </div>
              </div>
            )}
            
            <div className="w-full flex justify-center">
              <div
                onClick={stravaConnected ? handleDisconnect : handleConnect}
                className="flex flex-col justify-center items-center cursor-pointer"
              >
                {!stravaConnected && (
                  <img
                    src="/Images/btn_strava_connect_with_orange.svg"
                    alt="Strava Logo"
                    className="w-full h-full"
                  />
                )}
                <span className="text-primary font-normal font-thuast leading-normal mt-2">
                  {stravaConnected ? "Disconnect from Strava" : ""}
                </span>
              </div>
            </div>
          </div>
          {/* Sponsor Tag */}
          <SponsorTag />
        </div>
      </div>
    </main>
  );
} 
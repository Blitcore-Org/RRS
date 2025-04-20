'use client'


import Button from "@/Components/button";
import SponsorTag from "@/Components/SponsorTag";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useEffect, useState, useRef} from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/Components/LoadingSpinner";
import ProfileSection from "@/Components/ProfileSection";
import ProgressRings from "@/Components/ProgressRings";
import axiosInstance from '@/utils/axiosInstance';
import BottomNavigation from "@/Components/BottomNavigation";
import { authService } from "@/services/auth";

export default function RunnerProfile() {
  const { user, loading, fetchUser } = useUser();
  const [stravaConnected, setStravaConnected] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();
  const [signOutLoading, setSignOutLoading] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      setSignOutLoading(true);
      await authService.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setSignOutLoading(false);
    }
  };

  useEffect(() => {
    async function checkStravaStatus() {
      if (user?.stravaAccessToken) {
        setStravaConnected(true);
      }
    }
    if(user) {
      checkStravaStatus();
    }
  }, [user]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append('profileImage', file);

    try {
      await axiosInstance.post(
        '/api/auth/upload-profile-image',
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      await fetchUser();
    } catch (err) {
      console.error(err);
    }
  };

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
    const checkAndRedirect = async () => {
      if (!loading && !user) {
        console.log("User in profile:", user);
        await authService.logout();
        router.push('/login');
      }
    };
  
    checkAndRedirect();
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
        pb-16
      "
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
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
            <ProfileSection
              user={user}
              editable
              onImageClick={() => fileInputRef.current?.click()}
            />

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
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <span className="text-secondary font-bold">Gold</span>
                    <span className="text-secondary ml-4">
                      {user.totalDistance} / 150KM
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary font-bold">Silver</span>
                    <span className="text-secondary ml-4">
                      {user.totalDistance} / 100KM
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary font-bold">Bronze</span>
                    <span className="text-secondary ml-4">
                      {user.totalDistance} / 50KM
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <ProgressRings totalDistance={user.totalDistance} />
                </div>
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
                <span className="text-red-500 font-bold font-dm-sans leading-normal mt-2">
                  {stravaConnected ? "Disconnect from Strava" : ""}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <Button onClick={handleLogout} disabled={signOutLoading}>
              {signOutLoading ? 'Signing Out...' : 'Sign Out'}
            </Button>
          </div>
          {/* Sponsor Tag */}
          <SponsorTag />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
} 
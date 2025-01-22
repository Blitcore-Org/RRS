'use client'

import FastestLeaderboard from '@/Components/FastestLeaderboard';
import SponsorTag from "@/Components/SponsorTag";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { leaderboardService } from '@/services/leaderboard';
import LoadingSpinner from '@/Components/LoadingSpinner';

export default function Fastest5KM() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { data: leaderboardData, error, isLoading } = leaderboardService.use5KMLeaderboard();


  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user || isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    console.error('Failed to fetch 10KM leaderboard:', error);
    return <div>Failed to load leaderboard</div>;
  }

  return (
    <main className="w-full min-h-screen bg-[url('/Images/background.png')] bg-no-repeat bg-center bg-cover flex items-center justify-center">
      <div className="flex w-full h-full max-w-[402px] min-h-[600px] flex-col items-center rounded-[44px]">
        {/* NavBar with back button */}
        <div className="flex flex-col items-center w-full rounded-tl-[44px] rounded-tr-[44px] relative">
          {/* Back Button */}
          <Link href="/runner-overview" className="absolute left-6 top-6">
            <img
              src="/Images/back_button.png"
              alt="Back"
              className="w-[32px] h-[32px]"
            />
          </Link>

          {/* NavContents with smaller logo */}
          <div className="flex py-[12px] flex-col items-center w-full">
            <img
              src="/Images/logo.png"
              alt="RRS Logo"
              className="w-[50px] h-[45px]"
            />
          </div>
        </div>

        {/* Main content container */}
        <div className="flex flex-col flex-1 w-full justify-between items-center gap-[20px] px-[20px]">
          {/* Profile Section */}
          <div className="flex items-center gap-4 mt-[20px]">
            <div className="w-[60px] h-[60px] rounded-full bg-white/20 overflow-hidden">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={`${user.name}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300"></div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-primary text-sm">{user.id}</span>
              <h2 className="text-primary font-bold text-2xl">{user.name}</h2>
              <span className="text-white text-sm">{user.progress}</span>
            </div>
          </div>

          {/* Leaderboard Widget */}
          <FastestLeaderboard 
            title="Fastest 5KM"
            data={leaderboardData}
          />

          {/* Sponsor Tag */}
          <SponsorTag />
        </div>
      </div>
    </main>
  );
} 
'use client'

import FastestLeaderboard from '@/Components/FastestLeaderboard';
import SponsorTag from "@/Components/SponsorTag";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { leaderboardService } from '@/services/leaderboard';
import LoadingSpinner from '@/Components/LoadingSpinner';
import ProfileSection from '@/Components/ProfileSection';

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
    console.error('Failed to fetch 5KM leaderboard:', error);
    return <div>Failed to load leaderboard</div>;
  }

  return (
    <main className="w-full min-h-screen bg-[url('/Images/background.png')] bg-no-repeat bg-center bg-cover flex items-center justify-center">
      <div className="flex w-full h-full max-w-[402px] min-h-[600px] flex-col items-center rounded-[44px]">
        {/* NavBar with back button */}
        <div className="flex flex-col items-center w-full rounded-tl-[44px] rounded-tr-[44px] relative pt-20">
          {/* Back Button */}
          <Link href="/runner-overview" className="absolute left-6 top-6 pt-20">
            <img
              src="/Images/back_button.png"
              alt="Back"
              className="w-[32px] h-[32px]"
            />
          </Link>

          <div className="flex py-[12px] flex-col items-center w-full">
            <div className="w-56 text-center justify-start text-primary text-xl font-normal font-thuast leading-normal">
              5K Leaderboard
            </div>
          </div>
        </div>

        {/* Main content container */}
        <div className="flex flex-col flex-1 w-full justify-between items-center gap-[20px] px-[20px]">

          {/* Leaderboard Widget */}
          <FastestLeaderboard 
            title="Fastest 5KM"
            columns={['Position', 'Name', 'Avg Pace', 'Time']}
            data={leaderboardData}
          />

          {/* Sponsor Tag */}
          <SponsorTag />
        </div>
      </div>
    </main>
  );
} 
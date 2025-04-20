'use client'

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SponsorTag from "@/Components/SponsorTag";
import BottomNavigation from "@/Components/BottomNavigation";
import OverallLeaderboard from "@/Components/OverallLeaderboard";
import { leaderboardService } from "@/services/leaderboard";
import ProfileSection from "@/Components/ProfileSection";
import LoadingSpinner from '@/Components/LoadingSpinner';

export default function Leaderboard() {
  const { user, loading } = useUser();
  const router = useRouter();
  const { data: leaderboardData, error, isLoading } = leaderboardService.useOverallLeaderboard();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || isLoading) {
    return <LoadingSpinner />;
  }

  // Find user's position in the leaderboard
  const userPosition = leaderboardData?.findIndex(item => item.name === user.name) + 1;

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
            pt-[20px]
          "
        >
          {/* Profile Section */}
          <div className="w-full">
            <ProfileSection user={user} />
            {userPosition && (
              <div className="mt-2 text-center text-primary text-sm">
                Your Position: #{userPosition}
              </div>
            )}
          </div>

          {/* Leaderboard content */}
          <div className="w-full overflow-x-hidden">
            <OverallLeaderboard 
              title="Overall Leaderboard"
              columns={['Position', 'Name', 'Distance', 'Time', 'Pace']}
              data={leaderboardData || []}
              isLoading={isLoading}
            />
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
'use client'

import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProfileSection from "@/Components/ProfileSection";
import SponsorTag from "@/Components/SponsorTag";
import BottomNavigation from "@/Components/BottomNavigation";

export default function RunnerOverview() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

  return (
    <main
      className="
        w-full
        min-h-screen
        bg-background
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
          "
        >
          {/* Profile Section */}
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
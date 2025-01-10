'use client'

import Button from "@/Components/button";
import SponsorTag from "@/Components/SponsorTag";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { authService } from "@/services/auth";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export default function RunnerOverview() {
  const { user, logout, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-[url('/Images/background.png')] bg-no-repeat bg-center bg-cover flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    );
  }

  if (!user) {
    return null;
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
        {/* NavBar */}
        <div
          className="
            flex
            flex-col
            items-center
            w-full
            rounded-tl-[44px]
            rounded-tr-[44px]
          "
        >
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
              src="/Images/logo.png"
              alt="RRS Logo"
              className="w-[50px] h-[45px]"
            />
          </div>
        </div>

        {user.isAdmin && (
          <Link 
            href="/admin"
            className="absolute top-6 right-6 text-white hover:text-primary"
          >
            Admin Panel
          </Link>
        )}

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
          {/* Profile and Buttons Container */}
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
            {/* Profile Section */}
            <div className="flex items-center gap-4">
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

            {/* Navigation Buttons */}
            <Link href="/runner-profile">
              <Button variant="secondary">Profile</Button>
            </Link>
            <Link href="/leaderboard">
              <Button variant="secondary">Overall Leaderboard</Button>
            </Link>
            <Link href="/fastest-5km">
              <Button variant="secondary">Fastest 5KM</Button>
            </Link>
            <Link href="/fastest-10km">
              <Button variant="secondary">Fastest 10KM</Button>
            </Link>
            
            {/* Sign Out Button */}
            <Button 
              variant="primary" 
              className="w-[120px]"
              onClick={handleLogout}
            >
              Sign out
            </Button>
          </div>

          {/* Sponsor Tag */}
          <SponsorTag />
        </div>
      </div>
    </main>
  );
} 
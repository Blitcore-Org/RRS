"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function BottomNavigation() {
  const pathname = usePathname();
  const { user } = useUser();

  const isActive = (path) => pathname === path;

  return (
    <nav className="fixed pb-6 bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-primary/20">
      <div className="max-w-[402px] mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Profile Link */}
          <Link 
            href="/runner-profile"
            className={`flex flex-col items-center justify-center flex-1 ${
              isActive('/runner-profile') ? 'text-primary' : 'text-primary/60'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs mt-1">Profile</span>
          </Link>

          {/* Leaderboard Link */}
          <Link 
            href="/leaderboard"
            className={`flex flex-col items-center justify-center flex-1 ${
              isActive('/leaderboard') ? 'text-primary' : 'text-primary/60'
            }`}
          >
            <img 
              src="/Images/icons/trophy_icon.png" 
              alt="Leaderboard" 
              className="h-6 w-6"
            />
            <span className="text-xs mt-1">Leaderboard</span>
          </Link>

          {/* Admin Links - Only visible to admin users */}
          {user?.isAdmin && (
            <>
              {/* Users Link */}
              <Link 
                href="/admin/users"
                className={`flex flex-col items-center justify-center flex-1 ${
                  isActive('/admin/users') ? 'text-primary' : 'text-primary/60'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="text-xs mt-1">Users</span>
              </Link>

              {/* Reset User Link */}
              <Link 
                href="/admin/reset"
                className={`flex flex-col items-center justify-center flex-1 ${
                  isActive('/admin/reset') ? 'text-primary' : 'text-primary/60'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-xs mt-1">Reset</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 
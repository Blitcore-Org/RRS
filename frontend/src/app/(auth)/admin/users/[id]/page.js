'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import LoadingSpinner from '@/Components/LoadingSpinner';
import ProfileSection from '@/Components/ProfileSection';
import axiosInstance from '@/utils/axiosInstance';

export default function AdminUserDetail() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError('');
    axiosInstance.get(`/api/admin/users?id=${userId}`)
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to fetch user');
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <main className="w-full min-h-screen bg-background bg-no-repeat bg-center bg-cover flex items-center justify-center pb-16">
      <div className="flex w-full h-full max-w-[402px] min-h-[600px] flex-col items-center rounded-[44px]">
        <div className="flex flex-col flex-1 w-full justify-between items-center gap-[20px] px-[20px] pt-[20px]">
          {/* Profile Row with Back Button and Spacer */}
          <div className="w-full flex flex-row items-center mb-2">
            {/* Back Button */}
            <button
              className="flex items-center text-primary hover:text-secondary focus:outline-none"
              onClick={() => router.back()}
              aria-label="Back to Users"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="sr-only">Back</span>
            </button>
            {/* Profile Section Centered */}
            <div className="flex-1 flex justify-center">
              <ProfileSection user={user} />
            </div>
            {/* Spacer to balance the row */}
            <div className="w-6" />
          </div>

          {/* Accumulated Data */}
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

          {/* Activities/Sessions */}
          <div className="w-full p-6 bg-primary rounded-[24px] text-white">
            <h2 className="text-secondary font-semibold mb-2">Activities / Sessions</h2>
            <div className="bg-white/10 rounded p-2 text-xs text-secondary">(To be implemented)</div>
          </div>

          {/* Admin Actions */}
          <div className="w-full p-6 bg-primary rounded-[24px] text-white">
            <h2 className="text-secondary font-semibold mb-2">Admin Actions</h2>
            <div className="bg-white/10 rounded p-2 text-xs text-secondary">(To be implemented: edit, delete session, fetch, manual entry)</div>
          </div>
        </div>
      </div>
    </main>
  );
} 
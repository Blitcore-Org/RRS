'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';
import Button from '@/Components/button';
import BottomNavigation from '@/Components/BottomNavigation';

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axiosInstance.post('/api/admin/reset-password', { email });
      setSuccess('Password reset email sent successfully');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-[url('/Images/background.png')] bg-no-repeat bg-center bg-cover flex items-center justify-center pb-16">
      <div className="flex w-full h-full max-w-[402px] min-h-[600px] flex-col items-center rounded-[44px]">
        {/* Title */}
        <div className="flex py-[12px] flex-col items-center w-full pt-[20px]">
          <div className="text-center text-primary text-xl font-normal font-thuast leading-normal">
            Reset Password
          </div>
        </div>

        {/* Main content container */}
        <div className="flex flex-col flex-1 w-full justify-between items-center gap-[20px] px-[20px]">
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Email Input Container */}
            <div className="relative w-full h-[64px] rounded-[12px] bg-[rgba(73,81,89,0.35)] backdrop-blur-sm">
              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full h-full px-[30px] pt-[25px] bg-transparent text-primary focus:outline-none placeholder-transparent"
                required
              />
              <label className="absolute text-white left-[30px] top-[50%] -translate-y-1/2 transition-all peer-focus:text-xs peer-focus:top-[10px] peer-focus:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-[10px] peer-[:not(:placeholder-shown)]:translate-y-0 cursor-text">
                Email
              </label>
            </div>

            {error && (
              <div className="text-red-500 text-center text-sm">{error}</div>
            )}

            {success && (
              <div className="text-green-500 text-center text-sm">{success}</div>
            )}

            <div className="flex justify-center w-full">
              <Button
                type="submit"
                disabled={loading}
                className="w-6 flex justify-center items-center"
              >
                {loading ? 'Sending...' : 'Send Reset Email'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
} 
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
  const [tempPassword, setTempPassword] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTempPassword('');
    setCopySuccess(false);

    try {
      const response = await axiosInstance.post('/api/admin/reset-password', { email });
      setTempPassword(response.data.temporaryPassword);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tempPassword);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <main className="w-full min-h-screen bg-background bg-no-repeat bg-center bg-cover flex items-center justify-center pb-16">
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

            {tempPassword && (
              <div className="bg-[rgba(73,81,89,0.35)] backdrop-blur-sm p-4 rounded-[12px]">
                <div className="text-primary text-sm mb-2">Temporary Password:</div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-primary font-mono bg-[rgba(0,0,0,0.2)] px-3 py-2 rounded flex-1 overflow-x-auto">
                    {tempPassword}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="bg-primary text-secondary px-3 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors"
                  >
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="text-primary/60 text-xs mt-2">
                  Share this temporary password with the user. They will be prompted to change it on their next login.
                </div>
              </div>
            )}

            <div className="flex justify-center w-full">
              <Button
                type="submit"
                disabled={loading}
                className="w-6 flex justify-center items-center"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
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
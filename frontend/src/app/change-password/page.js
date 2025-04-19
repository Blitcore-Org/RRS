'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from "@/Components/button";
import SponsorTag from "@/Components/SponsorTag";
import { useUser } from "@/context/UserContext";
import { authService } from "@/services/auth";

export default function ChangePassword() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !user.forcePasswordChange) {
      router.replace('/runner-profile');
    }
  }, [user, router]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const userData = await authService.changePassword(confirmPassword, newPassword);
      await setUser(userData);
      router.replace('/runner-profile');
    } catch {
      setError('Failed to update password');
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-[url('/Images/background.png')] bg-no-repeat bg-center bg-cover flex items-center justify-center">
      <div className="flex w-full h-full max-w-[402px] min-h-[600px] flex-col items-center rounded-[44px]">
        {/* NavBar & Logo */}
        <div className="flex flex-col items-center w-full rounded-tl-[44px] rounded-tr-[44px]">
          <div className="flex h-[54px] pt-[21px] w-full" />
          <div className="flex py-[20px] flex-col items-center w-full gap-[20px]">
            <img src="/Images/Logo.png" alt="Event Logo" className="w-[81px] h-[73px]" />
          </div>
        </div>

        {/* Change‑Password Form */}
        <div className="flex flex-1 w-full flex-col justify-between items-center gap-[20px]">
          <form onSubmit={handleSubmit} className="flex flex-col h-full justify-center items-center gap-[20px] px-[20px] w-full">
            {/* New Password */}
            <div className="relative w-full h-[64px] rounded-[12px] bg-[rgba(73,81,89,0.35)] backdrop-blur-sm">
              <input
                type="password"
                placeholder=" "
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                className="peer w-full h-full px-[30px] pt-[25px] bg-transparent text-primary focus:outline-none placeholder-transparent"
              />
              <label className="absolute text-white left-[30px] top-[50%] -translate-y-1/2 transition-all peer-focus:text-xs peer-focus:top-[10px] peer-focus:translate-y-0 cursor-text">
                New Password
              </label>
            </div>

            {/* Confirm Password */}
            <div className="relative w-full h-[64px] rounded-[12px] bg-[rgba(73,81,89,0.35)] backdrop-blur-sm">
              <input
                type="password"
                placeholder=" "
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="peer w-full h-full px-[30px] pt-[25px] bg-transparent text-primary focus:outline-none placeholder-transparent"
              />
              <label className="absolute text-white left-[30px] top-[50%] -translate-y-1/2 transition-all peer-focus:text-xs peer-focus:top-[10px] peer-focus:translate-y-0 cursor-text">
                Confirm Password
              </label>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" loading={loading}>Update Password</Button>
          </form>
          <SponsorTag />
        </div>
      </div>
    </main>
  );
}

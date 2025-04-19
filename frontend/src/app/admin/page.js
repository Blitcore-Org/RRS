'use client'

import { useUser } from "@/context/UserContext";
import { authService } from "@/services/auth";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from "@/Components/button";

export default function AdminPanel() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      router.push('/login');
    }
  }, [loading, user, router]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const result = await authService.adminResetPassword(userEmail);
      setMessage(`Password reset successful. Temporary password: ${result.temporaryPassword}`);
      setUserEmail('');
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    }
  };

  if (loading || !user || !user.isAdmin) {
    return null;
  }

  return (
    <main className="w-full min-h-screen bg-[url('/Images/background.png')] bg-no-repeat bg-center bg-cover flex items-center justify-center">
      <div className="flex w-full h-full max-w-[402px] min-h-[600px] flex-col items-center rounded-[44px]">
        <div className="flex flex-col gap-4 w-full max-w-md p-8">
          <h2 className="text-white text-xl font-bold mb-4">Admin Panel</h2>
          
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div className="relative w-full h-[64px] rounded-[32px] bg-[rgba(73,81,89,0.35)] backdrop-blur-sm">
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="User Email"
                className="w-full h-full px-6 bg-transparent text-white outline-none"
                required
              />
            </div>
            
            {error && <div className="text-red-500 text-sm">{error}</div>}
            {message && <div className="text-green-500 text-sm break-all">{message}</div>}
            
            <Button type="submit">Reset User Password</Button>
          </form>
        </div>
      </div>
    </main>
  );
} 
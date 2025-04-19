'use client'

import Button from "@/Components/button";
import SponsorTag from "@/Components/SponsorTag";
import { useUser } from "@/context/UserContext";
import { authService } from "@/services/auth";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [forcePasswordChange, setForcePasswordChange] = useState(false);
  const router = useRouter();
  const { login } = useUser();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await authService.login(email, password);
      
      if (userData.forcePasswordChange) {
        // send them to the dedicated page
        router.replace(`/change-password`);
        return;
      }

      await login(userData);
      router.replace('/runner-profile');
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const userData = await authService.changePassword(email, password, newPassword);
      await login(userData);
      router.replace('/runner-profile');
    } catch (err) {
      setError('Failed to update password');
      console.error(err);
    }
  };

  if (forcePasswordChange) {
    return (
      <main className="w-full min-h-screen bg-[url('/Images/background.png')] bg-no-repeat bg-center bg-cover flex items-center justify-center">
        <div className="flex w-full h-full max-w-[402px] min-h-[600px] flex-col items-center rounded-[44px]">
          <form onSubmit={handlePasswordChange} className="flex flex-col gap-4 w-full max-w-md p-8">
            <h2 className="text-white text-xl font-bold mb-4">Change Password</h2>
            <div className="relative w-full h-[64px] rounded-[32px] bg-[rgba(73,81,89,0.35)] backdrop-blur-sm">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="w-full h-full px-6 bg-transparent text-white outline-none"
                required
              />
            </div>
            <div className="relative w-full h-[64px] rounded-[32px] bg-[rgba(73,81,89,0.35)] backdrop-blur-sm">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full h-full px-6 bg-transparent text-white outline-none"
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit">Update Password</Button>
          </form>
        </div>
      </main>
    );
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
          {/* StatusBar */}
          <div
            className="
              flex
              h-[54px]
              pt-[21px]
              flex-col
              items-start
              w-full
            "
          >
            {/* StatusBar content here */}
          </div>

          {/* NavContents */}
          <div
            className="
              flex
              py-[20px]
              flex-col
              items-center
              w-full
              gap-[20px]
            "
          >
            {/* Logo container */}
            <div
              className="
                flex
                w-full
                px-[20px]
                justify-center
                items-center
                mx-auto
              "
            >
              <img
                src="/Images/Logo.png"
                alt="Event Logo"
                className="w-[81px] h-[73px] flex-shrink-0"
              />
            </div>
          </div>
        </div>

        {/* Container with form, buttons and sponsor info */}
        <div
          className="
            flex
            flex-col
            flex-1
            w-full
            justify-between
            items-center
            gap-[20px]
          "
        >
          {/* Form and Buttons container */}
          <form onSubmit={handleLogin} className="flex flex-col h-full justify-center items-center gap-[20px] px-[20px] w-full">
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

            {/* Password Input Container */}
            <div className="relative w-full h-[64px] rounded-[12px] bg-[rgba(73,81,89,0.35)] backdrop-blur-sm">
              <input
                type="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full h-full px-[30px] pt-[25px] bg-transparent text-primary focus:outline-none placeholder-transparent"
                required
              />
              <label className="absolute text-white left-[30px] top-[50%] -translate-y-1/2 transition-all peer-focus:text-xs peer-focus:top-[10px] peer-focus:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-[10px] peer-[:not(:placeholder-shown)]:translate-y-0 cursor-text">
                Password
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <Button text="Log in" loading={loading} />
            <Link href="https://exultant-elephant-4d8.notion.site/14daf21a78918042b5d7f82f2658c660?pvs=105" passHref legacyBehavior>
              <Button variant="secondary">Join us</Button>
            </Link>

            {/* Rest of the form elements */}
            <a href="/forgot-password" className="text-sm text-[#B6F09C] hover:text-[#a3e088] self-center">
              Forgot Password?
            </a>

          </form>

          {/* Sponsor container */}
          <SponsorTag />
        </div>
      </div>
    </main>
  );
}
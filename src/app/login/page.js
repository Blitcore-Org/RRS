'use client'

import Button from "@/Components/button";
import SponsorTag from "@/Components/SponsorTag";
import { useUser } from "@/context/UserContext";
import { authService } from "@/services/auth";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userData = await authService.login(email, password);
      login(userData);
      router.push('/runner-overview');
    } catch (err) {
      setError('Invalid email or password');
      console.error(err);
    }
  };

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
                src="/Images/logo.png"
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
            <div className="relative w-full h-[64px] rounded-[32px] bg-[rgba(73,81,89,0.35)] backdrop-blur-sm">
              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full h-full px-[30px] pt-[25px] bg-transparent text-white focus:outline-none placeholder-transparent"
              />
              <label className="absolute text-primary left-[30px] top-[50%] -translate-y-1/2 transition-all peer-focus:text-xs peer-focus:top-[10px] peer-focus:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-[10px] peer-[:not(:placeholder-shown)]:translate-y-0 cursor-text">
                Email
              </label>
            </div>

            {/* Password Input Container */}
            <div className="relative w-full h-[64px] rounded-[32px] bg-[rgba(73,81,89,0.35)] backdrop-blur-sm">
              <input
                type="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full h-full px-[30px] pt-[25px] bg-transparent text-white focus:outline-none placeholder-transparent"
              />
              <label className="absolute text-primary left-[30px] top-[50%] -translate-y-1/2 transition-all peer-focus:text-xs peer-focus:top-[10px] peer-focus:translate-y-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-[10px] peer-[:not(:placeholder-shown)]:translate-y-0 cursor-text">
                Password
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            {/* Rest of the form elements */}
            <a href="/forgot-password" className="text-sm text-[#B6F09C] hover:text-[#a3e088] self-center">
              Forgot Password?
            </a>

            <Button type="submit" variant="primary">Log in</Button>
            <Button variant="secondary">Join us</Button>
          </form>

          {/* Sponsor container */}
          <SponsorTag />
        </div>
      </div>
    </main>
  );
}
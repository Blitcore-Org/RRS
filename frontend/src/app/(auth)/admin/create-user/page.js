'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '@/utils/axiosInstance';
import Button from '@/Components/button';

export default function CreateUser() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    isAdmin: false,
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...userData } = formData;
      await axiosInstance.post('/api/admin/create-user', userData);
      router.push('/admin/users');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create user');
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-background bg-no-repeat bg-center bg-cover flex items-center justify-center">
      <div className="flex w-full h-full max-w-[402px] min-h-[600px] flex-col items-center rounded-[44px]">
        {/* NavBar with back button */}
        <div className="flex flex-col items-center w-full rounded-tl-[44px] rounded-tr-[44px] relative">
          {/* Back Button */}
          <Link href="/admin/users" className="absolute left-6 top-3">
            <img
              src="/Images/back_button.png"
              alt="Back"
              className="w-[32px] h-[32px]"
            />
          </Link>

          {/* Title */}
          <div className="flex py-[12px] flex-col items-center w-full">
            <div className="w-56 text-center justify-start text-primary text-xl font-normal font-thuast leading-normal">
              Create User
            </div>
          </div>
        </div>

        {/* Main content container */}
        <div className="flex flex-col flex-1 w-full justify-between items-center gap-[20px] px-[20px]">
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-dm-sans">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-10 px-4 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter email"
              />
            </div>

            {/* Name */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-dm-sans">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full h-10 px-4 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter name"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-dm-sans">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full h-10 px-4 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter password"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-white text-sm font-dm-sans">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full h-10 px-4 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Confirm password"
              />
            </div>

            {/* Admin Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isAdmin"
                checked={formData.isAdmin}
                onChange={handleChange}
                className="w-4 h-4 rounded bg-white/10 border-white/20 focus:ring-primary"
              />
              <label className="text-white text-sm font-dm-sans">Admin User</label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm font-dm-sans">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full mt-4" loading={loading}>
              Create User
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

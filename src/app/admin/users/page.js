'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axiosInstance from '@/utils/axiosInstance';
import Button from '@/Components/button';
import LoadingSpinner from '@/Components/LoadingSpinner';

export default function UsersList() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/users');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch users');
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axiosInstance.delete(`/api/admin/users?id=${userId}`);
      fetchUsers(); // Refresh the list
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  const getColumnWidth = (column) => {
    switch (column.toLowerCase()) {
      case 'name':
        return 'w-32';
      case 'email':
        return 'w-36';
      case 'role':
        return 'w-16';
      case 'actions':
        return 'w-12';
      default:
        return 'w-20';
    }
  };

  const getColumnAlignment = (column) => {
    switch (column.toLowerCase()) {
      case 'name':
        return 'text-left';
      case 'email':
        return 'text-left';
      case 'role':
        return 'text-center';
      case 'actions':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  const columns = ['Name', 'Email', 'Role', 'Actions'];

  return (
    <main className="w-full min-h-screen bg-[url('/Images/background.png')] bg-no-repeat bg-center bg-cover flex items-center justify-center">
      <div className="flex w-full h-full max-w-[402px] min-h-[600px] flex-col items-center rounded-[44px]">
        {/* NavBar with back button and title */}
        <div className="flex flex-col items-center w-full rounded-tl-[44px] rounded-tr-[44px] relative">
          {/* Back Button */}
          <div className="absolute left-6 top-3 z-10">
            <Link href="/runner-overview">
              <img
                src="/Images/back_button.png"
                alt="Back"
                className="w-[32px] h-[32px]"
              />
            </Link>
          </div>

          {/* Title and Add Button */}
          <div className="flex py-[12px] flex-col items-center w-full relative">
            <div className="w-56 text-center justify-start text-primary text-xl font-normal font-thuast leading-normal">
              Users
            </div>
            <Link href="/admin/create-user" className="absolute right-6 top-1/2 -translate-y-1/2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <span className="text-black text-xl font-bold leading-none mb-0.5">+</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Main content container */}
        <div className="flex flex-col flex-1 w-full justify-between items-center gap-[20px] px-[20px]">
          {/* Users List */}
          <div className="inline-flex flex-col justify-start items-center gap-1">
            {/* Header */}
            <div className="w-96 h-8 px-5 flex items-center">
              <div className="self-stretch w-full inline-flex justify-between items-center">
                {columns.map((column, index) => (
                  <div 
                    key={index}
                    className={`${getColumnWidth(column)} text-primary text-xs font-normal font-dm-sans ${getColumnAlignment(column)}`}
                  >
                    {column}
                  </div>
                ))}
              </div>
            </div>

            {/* Users Items */}
            <div className="flex flex-col gap-1 w-96">
              {loading ? (
                <LoadingSpinner />
              ) : error ? (
                <div className="text-red-500 text-center py-4">{error}</div>
              ) : (
                users.map((user, index) => (
                  <div key={user._id} className="h-14 px-5 py-2 bg-primary rounded-[20px] flex items-center">
                    <div className="w-full inline-flex justify-between items-center">
                      <div className={`${getColumnWidth('name')} text-secondary text-xs font-normal font-dm-sans truncate`}>
                        {user.name}
                      </div>
                      <div className={`${getColumnWidth('email')} text-secondary text-xs font-normal font-dm-sans truncate`}>
                        {user.email}
                      </div>
                      <div className={`${getColumnWidth('role')} text-secondary text-xs font-normal font-dm-sans text-center`}>
                        {user.isAdmin ? 'Admin' : 'User'}
                      </div>
                      <div className={`${getColumnWidth('actions')} flex justify-end`}>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-black text-xs font-normal font-dm-sans hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

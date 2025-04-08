'use client';
import axiosInstance from '@/utils/axiosInstance';
import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    try {
      const { data } = await axiosInstance.get('/api/auth/me');
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  // this is not probably needed anymore as u have it in the auth/login
  const login = async (userData) => {
    return new Promise((resolve) => {
      setUser(userData);
      resolve();
    });
  };

  // this is not probably needed anymore as u have it in the auth/logout
  const logout = () => {
    try {
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error removing user data:', error);
    }
  };

  useEffect(() => {
    if (user && user.tokenExpiresAt) {
      const expiresAt = new Date(user.tokenExpiresAt).getTime();
      const now = Date.now();
      const delay = expiresAt - now - 5000; 

      if (delay > 0) {
        const timeoutId = setTimeout(async () => {
          try {
            // Call refresh endpoint
            const { data } = await axiosInstance.post('/api/auth/refresh');
            console.log('Token silently refreshed:', data.accessToken);
            await fetchUser();
          } catch (err) {
            console.error('Silent refresh error:', err);
          }
        }, delay);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [user, fetchUser]);

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, loading, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 
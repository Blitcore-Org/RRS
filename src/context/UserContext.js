'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me'); // API to fetch the user
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

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

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
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
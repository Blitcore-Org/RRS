'use client'

import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Run initialization immediately
    initializeUser();
  }, []);

  const login = async (userData) => {
    return new Promise((resolve) => {
      setUser(userData);
      resolve();
    });
  };

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
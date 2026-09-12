import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const DEMO_ACCOUNTS = [
  { email: 'demo1@ivy.homes', name: 'Demo User 1', role: 'Buyer (Primary)' },
  { email: 'demo2@ivy.homes', name: 'Demo User 2', role: 'Investor' },
  { email: 'demo3@ivy.homes', name: 'Demo User 3', role: 'Tenant' },
];

export const DEMO_PASSWORD = '000ac94860';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ivy_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('ivy_access_token');
  });
  const [loading, setLoading] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState(() => {
    return localStorage.getItem('ivy_expires_at');
  });

  // Background token refresh heartbeat every 10 minutes (token expires in 15 mins)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        console.log('Heartbeat: performing background token refresh to maintain session > 30m');
        await api.refreshAccessToken();
        setSessionExpiry(localStorage.getItem('ivy_expires_at'));
      } catch (err) {
        console.warn('Heartbeat token refresh warning:', err);
      }
    }, 10 * 60 * 1000); // 10 mins

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      setUser(data.user || { email, name: email.split('@')[0] });
      setIsAuthenticated(true);
      setSessionExpiry(localStorage.getItem('ivy_expires_at'));
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setSessionExpiry(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        sessionExpiry,
        login,
        logout,
        demoAccounts: DEMO_ACCOUNTS,
        demoPassword: DEMO_PASSWORD,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
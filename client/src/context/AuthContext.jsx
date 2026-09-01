import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sevasangam_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('sevasangam_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('sevasangam_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.error('Session verification failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('sevasangam_token', res.data.token);
      localStorage.setItem('sevasangam_user', JSON.stringify(res.data.user));
      return res.data;
    }
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('sevasangam_token', res.data.token);
      localStorage.setItem('sevasangam_user', JSON.stringify(res.data.user));
      return res.data;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sevasangam_token');
    localStorage.removeItem('sevasangam_user');
  };

  const updateProfile = async (updateData) => {
    const res = await api.put('/auth/profile', updateData);
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem('sevasangam_user', JSON.stringify(res.data.user));
      return res.data;
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('sevasangam_user', JSON.stringify(res.data.user));
      }
    } catch (e) {
      console.error('Failed refreshing user data:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
        isAuthenticated: !!token && !!user,
        isCustomer: user?.role === 'customer',
        isWorker: user?.role === 'worker',
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

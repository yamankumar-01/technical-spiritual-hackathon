import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, teamService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myTeam, setMyTeam] = useState(null);
  const [teamLoading, setTeamLoading] = useState(false);

  // Fetch current user session
  const fetchUser = async () => {
    try {
      const res = await authService.getMe();
      if (res.data?.success && res.data?.user) {
        setUser(res.data.user);
        await fetchTeamStatus();
      } else {
        setUser(null);
        setMyTeam(null);
      }
    } catch (err) {
      setUser(null);
      setMyTeam(null);
      localStorage.removeItem('tsh_token');
    } finally {
      setLoading(false);
    }
  };

  // Fetch logged-in user's team status
  const fetchTeamStatus = async () => {
    try {
      setTeamLoading(true);
      const res = await teamService.getMyStatus();
      if (res.data?.success && res.data?.hasTeam) {
        setMyTeam(res.data.team);
      } else {
        setMyTeam(null);
      }
    } catch (err) {
      console.warn('Could not load team status:', err.message);
      setMyTeam(null);
    } finally {
      setTeamLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.data?.success) {
      if (res.data.token) {
        localStorage.setItem('tsh_token', res.data.token);
      }
      setUser(res.data.user);
      await fetchTeamStatus();
      return res.data;
    }
    throw new Error(res.data?.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.data?.success) {
      if (res.data.token) {
        localStorage.setItem('tsh_token', res.data.token);
      }
      setUser(res.data.user);
      await fetchTeamStatus();
      return res.data;
    }
    throw new Error(res.data?.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout API error:', err);
    }
    localStorage.removeItem('tsh_token');
    setUser(null);
    setMyTeam(null);
  };

  const value = {
    user,
    loading,
    myTeam,
    teamLoading,
    login,
    register,
    logout,
    refreshUser: fetchUser,
    refreshTeamStatus: fetchTeamStatus,
    setMyTeam,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

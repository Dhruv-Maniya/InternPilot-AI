'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthUser, StudentProfile, MatchedInternship, DeadlineNotification } from '@/types';
import { authApi, getStoredToken, setStoredToken, notificationsApi } from './api';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  profile: StudentProfile;
  activeInternship: MatchedInternship | null;
  deadlines: DeadlineNotification[];
  toasts: ToastItem[];
  setActiveInternship: (internship: MatchedInternship | null) => void;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  login: (token: string, email?: string) => Promise<void>;
  logout: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  refreshDeadlines: () => Promise<void>;
}

const DEFAULT_PROFILE: StudentProfile = {
  name: 'Alex Rivera',
  education: 'B.Tech in Computer Science & Data Engineering',
  skills: ['Python', 'SQL', 'Data Analytics', 'Pandas'],
  interests: ['Machine Learning', 'Data Science', 'Business Intelligence'],
  preferred_location: 'India',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<StudentProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('internpilot_student_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return DEFAULT_PROFILE;
  });

  const [activeInternship, setActiveInternshipState] = useState<MatchedInternship | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('internpilot_active_internship');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return null;
  });

  const [deadlines, setDeadlines] = useState<DeadlineNotification[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshDeadlines = useCallback(async () => {
    try {
      const res = await notificationsApi.getDeadlines(7);
      if (res && res.notifications) {
        setDeadlines(res.notifications);
      }
    } catch {
      // ignore
    }
  }, []);

  const setActiveInternship = useCallback((internship: MatchedInternship | null) => {
    setActiveInternshipState(internship);
    if (typeof window !== 'undefined') {
      if (internship) {
        localStorage.setItem('internpilot_active_internship', JSON.stringify(internship));
      } else {
        localStorage.removeItem('internpilot_active_internship');
      }
    }
  }, []);

  const updateProfile = useCallback((updated: Partial<StudentProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      if (typeof window !== 'undefined') {
        localStorage.setItem('internpilot_student_profile', JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const checkUser = useCallback(async (authToken: string) => {
    try {
      setStoredToken(authToken);
      const me = await authApi.getMe();
      setUser(me);
      setTokenState(authToken);
      await refreshDeadlines();
    } catch {
      // If demo token, preserve demo session; otherwise clear invalid session
      if (authToken.startsWith('demo')) {
        setUser({ id: 'demo-student-uuid', email: 'demo.student@internpilot.ai' });
        setTokenState(authToken);
      } else {
        setUser(null);
        setTokenState(null);
        setStoredToken(null);
      }
    } finally {
      setLoading(false);
    }
  }, [refreshDeadlines]);

  useEffect(() => {
    const stored = getStoredToken();
    if (stored) {
      checkUser(stored);
    } else {
      setUser(null);
      setTokenState(null);
      setLoading(false);
    }

    const handleUnauthorized = () => {
      setUser(null);
      setTokenState(null);
      setStoredToken(null);
      showToast('Your session has expired. Please sign in.', 'error');
    };

    window.addEventListener('internpilot:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('internpilot:unauthorized', handleUnauthorized);
    };
  }, [checkUser, showToast]);

  const login = async (newToken: string, email?: string) => {
    setLoading(true);
    setStoredToken(newToken);
    setTokenState(newToken);
    try {
      const me = await authApi.getMe();
      setUser(me);
      showToast(`Welcome back, ${me.email}!`, 'success');
      await refreshDeadlines();
    } catch (err: unknown) {
      // Support demo candidate token for offline testing/hackathon presentations
      if (newToken.startsWith('demo')) {
        const fallbackUser = { id: 'demo-student-uuid', email: email || 'demo.student@internpilot.ai' };
        setUser(fallbackUser);
        showToast(`Signed in as ${fallbackUser.email} (Demo Candidate Mode)`, 'success');
      } else {
        setStoredToken(null);
        setTokenState(null);
        setUser(null);
        const errorMsg = err instanceof Error ? err.message : 'Invalid or expired authentication token.';
        showToast(errorMsg, 'error');
        throw new Error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setTokenState(null);
    setStoredToken(null);
    showToast('Signed out successfully.', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        profile,
        activeInternship,
        deadlines,
        toasts,
        setActiveInternship,
        updateProfile,
        login,
        logout,
        showToast,
        removeToast,
        refreshDeadlines,
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

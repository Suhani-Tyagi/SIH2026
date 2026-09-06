import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'INDUSTRY' | 'ACADEMICIAN' | 'INSTITUTION_ADMIN' | 'SUPER_ADMIN';
  system: string;
  institutionName?: string;
  companyName?: string;
  designation?: string;
  avatar?: string;
  studentProfile?: {
    degree: string;
    readinessScore: number;
    passoutYear: number;
    location?: string;
    skillScores?: string;
    verifiedBadges?: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  demoLogin: (role: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('ayush_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Failed to fetch current user', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('ayush_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const register = async (formData: any) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('ayush_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const demoLogin = async (role: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('ayush_token', data.token);
        setToken(data.token);
        setUser(data.user);
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (err) {
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('ayush_token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (token) await fetchCurrentUser(token);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, demoLogin, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

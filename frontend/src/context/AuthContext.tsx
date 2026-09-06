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

interface AuthResponse {
  success: boolean;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: any) => Promise<AuthResponse>;
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

  const login = async (email: string, password: string): Promise<AuthResponse> => {
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
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Login failed. Please check your credentials.' };
    } catch (err: any) {
      return { success: false, message: 'Network error or server unreachable. Please try again.' };
    }
  };

  const register = async (formData: any): Promise<AuthResponse> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if ((res.ok || res.status === 201) && data.token) {
        localStorage.setItem('ayush_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message || 'Registration failed. Please check the form data.' };
    } catch (err: any) {
      return { success: false, message: 'Network error or server unreachable. Please try again.' };
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
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

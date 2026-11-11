import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../api/client.js';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'store_manager' | 'support_agent' | 'customer';
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  loginAdmin: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'clevara_auth_token';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }

    api.getAdminMe()
      .then(res => {
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const loginAdmin = async (credentials: { email: string; password: string }) => {
    try {
      const res = await api.adminLogin(credentials);
      if (res.success && res.token) {
        localStorage.setItem(TOKEN_KEY, res.token);
        setUser(res.user);
        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Authentication error' };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const isAdmin = !!user && ['super_admin', 'store_manager'].includes(user.role);

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, loginAdmin, logout }}>
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

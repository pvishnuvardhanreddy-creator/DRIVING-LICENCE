import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole;
  login: (role: UserRole, email?: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  switchRole: (newRole: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 'user-c1',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@example.com',
    phone: '+91 98765 43210',
    aadhaarNumber: '8392-1029-4812',
    role: 'citizen',
    createdAt: '2026-01-15T10:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  });
  const [token, setToken] = useState<string | null>('mock-jwt-token-user-c1');
  const [role, setRole] = useState<UserRole>('citizen');

  const login = async (selectedRole: UserRole, email?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole, email }),
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setRole(data.user.role);
        setToken(data.token);
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const register = async (userData: Partial<User>) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        setRole(data.user.role);
        setToken(data.token);
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const switchRole = async (newRole: UserRole) => {
    await login(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || role,
        login,
        register,
        logout,
        switchRole,
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

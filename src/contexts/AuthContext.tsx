import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

type User = {
  id: string;
  email: string;
  created_at: string;
};

type Session = {
  user: User;
  token: string;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null };
  }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate a successful sign in with mock data
      const mockUser = {
        id: '1',
        email: email,
        created_at: new Date().toISOString()
      };
      
      const mockSession = {
        user: mockUser,
        token: 'mock-token'
      };

      setSession(mockSession);
      setUser(mockUser);
      localStorage.setItem('auth_token', 'mock-token');
      toast.success('Signed in successfully');

      return { data: mockSession, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign in');
      return { data: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate a successful sign up with mock data
      const mockUser = {
        id: '1',
        email: email,
        created_at: new Date().toISOString()
      };
      
      const mockSession = {
        user: mockUser,
        token: 'mock-token'
      };

      return { data: { user: mockUser, session: mockSession }, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign up';
      toast.error(errorMessage);
      return { data: { user: null, session: null }, error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setSession(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    toast.success('Signed out successfully');
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
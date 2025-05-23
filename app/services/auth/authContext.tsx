'use client';

import React, { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authApi, isUserAuthenticated, setCurrentUser, getCurrentUserEmail, clearAuthState, User } from './authApi';
import { userApi } from '../user/userApi';

interface AuthContextType {
  login: (email: string, password: string) => Promise<any>;
  signup: (name: string, email: string, password: string) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AUTH_QUERY_KEY = 'auth';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  
  const fetchUserProfile = useCallback(async () => {
    try {
      const email = getCurrentUserEmail();
      if (!email) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }
      
      const profileData = await userApi.getUserProfile();
      
      setUser(profileData);
      setIsAuthenticated(true);
      
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setIsAuthenticated(false);
      setUser(null);
      clearAuthState(); 
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      try {
        const isLoggedIn = isUserAuthenticated();
        
        if (isLoggedIn && isMounted) {
          await fetchUserProfile();
        } else if (isMounted) {
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        if (isMounted) {
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
        }
      }
    };
    
    checkAuth();
    
    return () => {
      isMounted = false;
    };
  }, [fetchUserProfile]);
  
  const refreshUserData = useCallback(async () => {
    await fetchUserProfile();
  }, [fetchUserProfile]);
  
  const login = useCallback(async (email: string, password: string) => {
    try {
      const userData = await authApi.login({ email, password });
      
      setCurrentUser(email);
      setIsAuthenticated(true);
      
      try {
        await refreshUserData();
      } catch (profileError) {
        console.error('Failed to fetch user profile after login:', profileError);
        
        setUser({
          email,
          name: userData.name || '',
          profile_picture: userData.profile_picture || null
        });
      }
      
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  }, [refreshUserData]);
  
  const signup = useCallback(async (name: string, email: string, password: string) => {
    try {
      const response = await authApi.signup({ name, email, password });
      return response;
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  }, []);
  
  const logout = useCallback(() => {
    clearAuthState();
    setIsAuthenticated(false);
    setUser(null);
    
    queryClient.removeQueries({ queryKey: [AUTH_QUERY_KEY] });
    queryClient.removeQueries({ queryKey: ['userProfile'] });
    
    console.log('User logged out');
  }, [queryClient]);
  
  const value = {
    login,
    signup,
    logout,
    isAuthenticated,
    user,
    loading,
    refreshUserData,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

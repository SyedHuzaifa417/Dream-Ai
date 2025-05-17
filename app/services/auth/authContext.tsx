'use client';

import React, { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authApi, getAuthState, saveAuthState, getUserData, saveUserData, clearAuthState } from './authApi';
import { userApi } from '../user/userApi';

interface AuthContextType {
  login: (email: string, password: string) => Promise<any>;
  signup: (name: string, email: string, password: string) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
  user: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AUTH_QUERY_KEY = 'auth';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  
  // Fetch user profile and update state when authenticated
  const fetchUserProfile = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const profileData = await userApi.getUserProfile();
      saveUserData(profileData);
      setUser(profileData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  }, [isAuthenticated]);
  
  useEffect(() => {
    const { isAuthenticated } = getAuthState();
    setIsAuthenticated(isAuthenticated);
    
    if (isAuthenticated) {
      fetchUserProfile();
    } else {
      const userData = getUserData();
      if (userData) {
        setUser(userData);
      }
    }
  }, [fetchUserProfile]);
  
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });

      saveAuthState(true);
      setIsAuthenticated(true);
      
      const basicUserData = { email };
      setUser(basicUserData);
      
      try {
        const profileData = await userApi.getUserProfile();
        saveUserData(profileData);
        setUser(profileData);
      } catch (profileError) {
        console.error('Failed to fetch user profile after login:', profileError);
        saveUserData(basicUserData);
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);
  
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
  }, [queryClient]);
  
  const value: AuthContextType = {
    login,
    signup,
    logout,
    isAuthenticated,
    user,
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

'use client';

import { useMutation } from '@tanstack/react-query';
import {  VerifyOtpRequest, ResetPasswordRequest, authApi, clearAuthState } from './authApi';
import { useAuth } from './authContext';

export const useLoginMutation = () => {
  const { login } = useAuth();
  
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return login(credentials.email, credentials.password);
    },
    onError: (error) => {
      console.error('Login error:', error);
    }
  });
};

export const useSignupMutation = () => {
  const { signup } = useAuth();
  
  return useMutation({
    mutationFn: async (userData: { name: string; email: string; password: string }) => {
      return signup(userData.name, userData.email, userData.password);
    },
    onError: (error) => {
      console.error('Signup error:', error);
    }
  });
};

export const useLogout = () => {
  const { logout } = useAuth();
  
  return useMutation({
    mutationFn: () => {
      logout();
      clearAuthState();
      return Promise.resolve();
    }
  });
};

export const useSendOtpMutation = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      return authApi.sendOtp(email);
    },
    onError: (error) => {
      console.error('Send OTP error:', error);
    }
  });
};

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      const otpData: VerifyOtpRequest = { otp };
      return authApi.verifyOtp(email, otpData);
    },
    onError: (error) => {
      console.error('OTP verification error:', error);
    }
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: async ({ email, newPassword, oldPassword }: { email: string; newPassword: string; oldPassword: string }) => {
      const resetData: ResetPasswordRequest = {
        old_password: oldPassword,
        new_password: newPassword,
        reset_flag: oldPassword ? '0' : '1', 
      };
      return authApi.resetPassword(email, resetData);
    },
    onError: (error) => {
      console.error('Password reset error:', error);
    }
  });
};

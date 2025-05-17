import axios from 'axios';

export interface User {
  id?: string;
  name?: string;
  email: string;
  password: string;
  plan?: string;
  start_date?: string;
  end_date?: string;
  price?: number;
}

export interface VerifyOtpRequest {
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message?: string;
}

export interface SendOtpResponse {
  success: boolean;
  message?: string;
}

export interface ResetPasswordRequest {
  old_password?: string;
  new_password: string;
  reset_flag: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const saveAuthState = ( isAuthenticated = true) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }
};

export const getAuthState = () => {
  if (typeof window === 'undefined') return { isAuthenticated: false };
  
  try {
    const isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated') || 'false');
    return { isAuthenticated };
  } catch (error) {
    console.error('Failed to parse auth state:', error);
    return { isAuthenticated: false };
  }
};

export const saveUserData = (userData: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userData', JSON.stringify(userData));
  }
};

export const getUserData = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    return JSON.parse(localStorage.getItem('userData') || 'null');
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
};

export const clearAuthState = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
  }
};

export const authApi = {
  login: async (credentials: Omit<User, 'name'>) => {
    const response = await api.post('/auth/login', credentials);
    saveAuthState(true);
    return response.data;
  },
  
  signup: async (userData: User) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  
  sendOtp: async (email: string): Promise<SendOtpResponse> => {
    const response = await api.post(`/users/${encodeURIComponent(email)}/otp`);
    return response.data;
  },
  
  verifyOtp: async (email: string, otpData: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    const response = await api.post(`/users/${encodeURIComponent(email)}/verify-otp`, otpData);
    return response.data;
  },
  
  resetPassword: async (email: string, passwordData: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await api.put(`/users/${encodeURIComponent(email)}/password`, passwordData);
    return response.data;
  },
  
  logout: () => {
    clearAuthState();
  },
  
  setAuthHeader: (token: string) => {
    api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  },
  
  removeAuthHeader: () => {
    api.interceptors.request.clear();
  }
};

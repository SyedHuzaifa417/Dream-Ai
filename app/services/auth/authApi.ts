import axios from 'axios';

export interface User {
  id?: string;
  name?: string;
  email: string;
  password?: string;
  profile_picture?: string | null;
  subscription?: SubscriptionInfo;
  usage?: UserUsage;
}

export interface SubscriptionInfo {
  plan: string;
  duration: string;
  status: string;
  start_date: string;
  end_date: string;
  limits: {
    images_per_day: number;
    video_minutes_per_day: number;
    price?: number;
  };
}

export interface UserUsage {
  images: number;
  video_minutes: number;
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

export interface CreatePasswordRequest {
  new_password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let currentUserEmail: string | null = null;

export const setCurrentUser = (email: string | null) => {
  currentUserEmail = email;
  
  if (typeof window !== 'undefined') {
    if (email) {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isAuthenticated');
    }
  }
};

export const getCurrentUserEmail = (): string | null => {

  if (currentUserEmail) {
    return currentUserEmail;
  }
  
  // Fall back to localStorage if needed
  if (typeof window !== 'undefined') {
    const email = localStorage.getItem('userEmail');
    if (email) {
      currentUserEmail = email;
      return email;
    }
  }
  
  return null;
};

export const isUserAuthenticated = (): boolean => {
  return getCurrentUserEmail() !== null;
};

export const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  const email = getCurrentUserEmail();
  if (email) {
    headers['X-User-Email'] = email;
  }
  
  return headers;
};

export const clearAuthState = () => {
  currentUserEmail = null;
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userData');
  }
};

export const authApi = {
  login: async (credentials: Omit<User, 'name'>) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data && response.data.email) {
        setCurrentUser(response.data.email);
        return response.data;
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login failed:', error);
      clearAuthState();
      throw error;
    }
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
  
  createPassword: async (email: string, passwordData: CreatePasswordRequest): Promise<ResetPasswordResponse> => {
    const response = await api.post(`/users/${encodeURIComponent(email)}/create-password`, passwordData);
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

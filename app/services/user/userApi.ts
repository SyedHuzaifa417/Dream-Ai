import axios from 'axios';
import { getAuthState } from '../auth/authApi';

export interface UserProfile {
  email: string;
  image_count: number;
  name: string;
  profile_picture: string | null;
  subscription_end_date: string | null;
  subscription_plan: string | null;
  subscription_start_date: string | null;
  video_count: number;
}

export interface PaymentHistory {
  payment_id: string;
  email: string;
  amount: string;
  stripe_payment_id: string;
  currency: string;
  status: string;
  subscription_plan: string;
  created_at: string;
}

export interface AddPaymentRequest {
  email: string;
  amount: string;
  stripe_payment_id: string;
  currency: string;
  status: string;
  subscription_plan: string;
}

export interface AddSubscriptionPlanRequest {
  subscription_plan: string;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const { isAuthenticated } = getAuthState();
    if (isAuthenticated) {
      config.headers['X-Authenticated'] = 'true';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const getUserEmail = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = JSON.parse(localStorage.getItem('userData') || 'null');
    return userData?.email || null;
  } catch (error) {
    console.error('Failed to get user email:', error);
    return null;
  }
};

export const userApi = {
  getUserProfile: async (): Promise<UserProfile> => {
    try {
      const email = getUserEmail();
      if (!email) {
        throw new Error('User email not found');
      }
      
      const response = await api.get(`/users/${encodeURIComponent(email)}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  
  getUserProfileByEmail: async (email: string): Promise<UserProfile> => {
    try {
      const response = await api.get(`/users/${encodeURIComponent(email)}`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  
  deleteUser: async (): Promise<void> => {
    try {
      const email = getUserEmail();
      if (!email) {
        throw new Error('User email not found');
      }
      
      await api.delete(`/users/${encodeURIComponent(email)}`);
    } catch (error: any) {
      throw error;
    }
  },
  
  uploadProfilePicture: async (imageFile: File): Promise<UserProfile> => {
    const email = getUserEmail();
    if (!email) {
      throw new Error('User email not found');
    }
    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('profile_picture', imageFile);
    
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/upload_profile_picture`, 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  removeProfilePicture: async (): Promise<UserProfile> => {
    const email = getUserEmail();
    if (!email) {
      throw new Error('User email not found');
    }
    
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${encodeURIComponent(email)}/profile-picture`,
      {
        data: { email },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  },
  
  getPaymentHistory: async (): Promise<PaymentHistory[]> => {
    try {
      const email = getUserEmail();
      if (!email) {
        throw new Error('User email not found');
      }
      
      const response = await api.get(`/users/${encodeURIComponent(email)}/payments`);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  
  updatePayment: async (paymentData: AddPaymentRequest): Promise<any> => {
    try {
      const email = getUserEmail();
      if (!email) {
        throw new Error('User email not found');
      }
      
      const response = await api.put(`/users/${encodeURIComponent(email)}/add-payment`, paymentData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
  
  addSubscriptionPlan: async (subscriptionData: AddSubscriptionPlanRequest): Promise<any> => {
    try {
      const email = getUserEmail();
      if (!email) {
        throw new Error('User email not found');
      }
      
      const response = await api.put(`/users/${encodeURIComponent(email)}/subscription`, subscriptionData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
};

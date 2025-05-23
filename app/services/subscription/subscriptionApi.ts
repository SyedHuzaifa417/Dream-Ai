import axios from 'axios';
import { getAuthHeaders } from '../auth/authApi';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const headers = getAuthHeaders();
    Object.keys(headers).forEach(key => {
      config.headers[key] = headers[key];
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getSubscriptionPlans = async () => {
  try {
    const response = await api.get('/subscription/plans');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching subscription plans:', error);
    if (error.response?.status === 401) {
      console.log('Authentication error: User not authenticated or session expired');
    }
    return {
      status: 'error',
      message: error.response?.data?.message || 'Failed to fetch subscription plans'
    };
  }
};

export const getSubscriptionStatus = async () => {
  try {
    const response = await api.get('/subscription/status');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching subscription status:', error);
    if (error.response?.status === 401) {
      console.log('Authentication error: User not authenticated or session expired');
    }
    return {
      status: 'error',
      message: error.response?.data?.message || 'Failed to fetch subscription status'
    };
  }
};

export const createCheckoutSession = async (planType: string, duration: string, stripeKey?: string) => {
  try {
    
    const response = await api.post(
      '/subscription/create-checkout-session',
      { plan_type: planType, duration: duration }
    );
    
    return response.data;
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    if (error.response?.status === 401) {
      console.log('Authentication error: User not authenticated or session expired');
    }
    return {
      status: 'error',
      message: error.response?.data?.message || 'Failed to create checkout session'
    };
  }
};

export const cancelSubscription = async () => {
  try {
    
    const response = await api.post('/subscription/cancel', {});
    
    return response.data;
  } catch (error: any) {
    console.error('Error cancelling subscription:', error);
    if (error.response?.status === 401) {
      console.log('Authentication error: User not authenticated or session expired');
    }
    return {
      status: 'error',
      message: error.response?.data?.message || 'Failed to cancel subscription'
    };
  }
};

export const checkSubscriptionValidity = async (email: string) => {
  try {
    
    const response = await api.get(`/users/${encodeURIComponent(email)}/subscription/validity`);
    
    return response.data;
  } catch (error: any) {
    console.error('Error checking subscription validity:', error);
    if (error.response?.status === 401) {
      console.log('Authentication error: User not authenticated or session expired');
    }
    return {
      status: 'error',
      message: error.response?.data?.message || 'Failed to check subscription validity'
    };
  }
};

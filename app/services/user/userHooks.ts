import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, AddPaymentRequest, AddSubscriptionPlanRequest } from './userApi';


export const useUserProfile = (enabled = true) => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => userApi.getUserProfile(),
    enabled: typeof enabled === 'boolean' ? enabled : false,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
  });
};

export const useUserProfileByEmail = (email: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: ['userProfile', email],
    queryFn: () => (email ? userApi.getUserProfileByEmail(email) : Promise.reject('No email provided')),
    enabled: !!email && (typeof enabled === 'boolean' ? enabled : false),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
  });
};

export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => {
      console.log('useUploadProfilePicture mutationFn called with:', file);
      return userApi.uploadProfilePicture(file);
    },
    onSuccess: (data) => {
      console.log('useUploadProfilePicture onSuccess:', data);
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
    onError: (error) => {
      console.error('useUploadProfilePicture onError:', error);
    }
  });
};

export const useRemoveProfilePicture = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => userApi.removeProfilePicture(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => userApi.deleteUser(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
export const usePaymentHistory = (enabled = true) => {
  return useQuery({
    queryKey: ['paymentHistory'],
    queryFn: () => userApi.getPaymentHistory(),
    enabled: typeof enabled === 'boolean' ? enabled : false,
    staleTime: 1000 * 60 * 5, 
    retry: 1,
    retryDelay: 1000,
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (paymentData: AddPaymentRequest) => userApi.updatePayment(paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

export const useAddSubscriptionPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (subscriptionData: AddSubscriptionPlanRequest) => userApi.addSubscriptionPlan(subscriptionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

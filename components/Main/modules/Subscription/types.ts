export interface SubscriptionPlan {
  duration: string;  
  plan: string;   
  desc: string;
  price: number;
  perks: string[];
  id?: string;
}

export interface SubscriptionStatus {
  status: string;    // active, inactive, past_due
  plan: string | null;
  duration: string | null;
  start_date: string | null;
  end_date: string | null;
  limits?: {
    images_per_day: number;
    video_minutes_per_day: number;
  };
  daily_usage?: {
    images: number;
    video_minutes: number;
  };
}

export interface SubscriptionFormData {
  fullName: string;
  email?: string;
  paymentMethod: "creditCard" | "paypal" | "applePay";
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
  planType?: string;
  duration?: string;
}

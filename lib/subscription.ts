import { getSession } from "./auth";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: "weekly" | "monthly" | "yearly";
  features: string[];
  isPopular?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: "creditCard" | "paypal" | "applePay";
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
}

export interface UserSubscription {
  id: string;
  planId: string;
  planName: string;
  status: "active" | "canceled" | "expired" | "pending";
  startDate: string;
  endDate: string;
  renewalDate: string;
  price: number;
  paymentMethodId: string;
}

export const getSubscriptionPlans = async (
  duration?: "weekly" | "monthly" | "yearly"
): Promise<{
  success: boolean;
  plans?: SubscriptionPlan[];
  message?: string;
}> => {
  try {
    const url = duration
      ? `/api/subscriptions/plans?duration=${duration}`
      : "/api/subscriptions/plans";

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching subscription plans:", error);
    return {
      success: false,
      message: "Failed to fetch subscription plans",
    };
  }
};

export const getUserSubscription = async (): Promise<{
  success: boolean;
  subscription?: UserSubscription;
  message?: string;
}> => {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const response = await fetch("/api/subscriptions/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    return {
      success: false,
      message: "Failed to fetch subscription information",
    };
  }
};

export const subscribeToPlan = async (
  planId: string,
  paymentData: {
    paymentMethod: "creditCard" | "paypal" | "applePay";
    fullName: string;
    cardNumber?: string;
    expiryDate?: string;
    cvc?: string;
    savePaymentMethod?: boolean;
  }
): Promise<{
  success: boolean;
  subscription?: UserSubscription;
  message?: string;
}> => {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const response = await fetch("/api/subscriptions/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({
        planId,
        ...paymentData,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error subscribing to plan:", error);
    return {
      success: false,
      message: "Failed to process subscription",
    };
  }
};

export const cancelSubscription = async (
  subscriptionId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const response = await fetch(
      `/api/subscriptions/cancel/${subscriptionId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return {
      success: false,
      message: "Failed to cancel subscription",
    };
  }
};

export const updatePaymentMethod = async (paymentData: {
  subscriptionId: string;
  paymentMethod: "creditCard" | "paypal" | "applePay";
  fullName: string;
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const session = await getSession();
    if (!session) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    const response = await fetch("/api/subscriptions/payment-method", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(paymentData),
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating payment method:", error);
    return {
      success: false,
      message: "Failed to update payment method",
    };
  }
};

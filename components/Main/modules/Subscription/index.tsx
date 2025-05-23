"use client";

import React, { useState, useEffect } from "react";
import SubscriptionCard from "./components/SubscriptionCard";
import SubscriptionForm from "./components/SubscriptionForm";
import {
  getSubscriptionPlans,
  getSubscriptionStatus,
  createCheckoutSession,
} from "@/app/services/subscription/subscriptionApi";
import { SubscriptionStatus } from "./types";
import { toast } from "sonner";
import { useAuth } from "@/app/services/auth/authContext";

interface Plan {
  id?: string;
  plan: string;
  duration: string;
  desc: string;
  price: number;
  perks: string[];
}

const SubscriptionPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedDuration, setSelectedDuration] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [stripePublishableKey, setStripePublishableKey] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);


  // Fetch subscription status
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!isAuthenticated) return;
      
      try {
        const result = await getSubscriptionStatus();
        
        if (result.status === 'success' && result.subscription) {
          setSubscription(result.subscription);
        }
      } catch (error) {
        console.error("Error fetching subscription status:", error);
      }
    };

    fetchSubscriptionStatus();
  }, [isAuthenticated]);

  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await getSubscriptionPlans();

        if (response.status === "success" && response.plans) {
          // Extract Stripe key, handle different key formats
          const publishableKey = response.stripe_publishable_key || response.stripe_key;
          if (publishableKey) {
            const keyMatch = publishableKey.match(/=(.+)$/);
            const cleanKey = keyMatch ? keyMatch[1] : publishableKey;
            setStripePublishableKey(cleanKey);
          }

          // Format plans for display
          const formattedPlans: Plan[] = [];

          Object.entries(response.plans).forEach(([planType, planData]: [string, any]) => {
            Object.entries(planData).forEach(([duration, details]: [string, any]) => {
              const perks = [...(details.perks || [])];
              const imagesPerDay = details.images_per_day;
              const videoMinutesPerDay = details.video_minutes_per_day;

              if (imagesPerDay !== undefined) {
                if (imagesPerDay === -1) {
                  perks.unshift(`Unlimited images per day`);
                } else {
                  perks.unshift(`${imagesPerDay} images per day`);
                }
              }

              if (videoMinutesPerDay !== undefined) {
                if (videoMinutesPerDay === -1) {
                  perks.unshift(`Unlimited video minutes per day`);
                } else {
                  perks.unshift(`${videoMinutesPerDay} video minutes per day`);
                }
              }

              formattedPlans.push({
                plan: planType,
                duration: duration,
                desc: details.description,
                price: details.price,
                perks: perks.slice(0, 6) // Limit to 6 perks for display
              });
            });
          });

          setPlans(formattedPlans);
        } else {
          throw new Error(response.message || "Failed to fetch plans");
        }
      } catch (error: any) {
        console.error("Error fetching plans:", error);
        setError(error.message || "Failed to fetch subscription plans");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [selectedDuration, isAuthenticated, user]);

  const handleSubscribe = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: any) => {
    if (!selectedPlan) {
      toast.error("Please select a subscription plan");
      return;
    }

    try {
      setProcessing(true);

      // Create checkout session
      const result = await createCheckoutSession(
        selectedPlan.plan,
        selectedPlan.duration
      );

      if (result.status === "success" && result.url) {
        toast.success("Redirecting to checkout...");
        // Redirect to Stripe checkout
        window.location.href = result.url;
      } else {
        toast.error(result.message || "Failed to create checkout session");
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      toast.error(error.message || "An error occurred");
    } finally {
      setProcessing(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };


  // Check if the plan is active
  const isPlanActive = (plan: Plan) => {
    if (!subscription) return false;
    
    return (
      subscription.plan === plan.plan &&
      subscription.duration === plan.duration &&
      subscription.status === "active"
    );
  };

  return (
    <div className="p-3 h-screen max-sm:mt-14 max-sm:h-[calc(100vh-56px)] max-sm:p-0">
      <div className="rounded-[20px] border border-white h-full flex flex-col max-sm:border-none">
        {!showForm ? (
          <>
            <div className="flex justify-center items-center mx-auto space-x-5 mt-10 max-sm:mt-3 max-lg:mt-5 mb-16 max-sm:mb-3 max-xl:mb-5 p-1 bg-indigo-650 rounded-3xl w-2/4 max-lg:w-[90%] border">
              {["weekly", "monthly", "yearly"].map((duration) => (
                <button
                  key={duration}
                  className={`py-3 rounded-3xl transition-all flex-1 font-semibold capitalize ${
                    selectedDuration === duration
                      ? "bg-white text-gray-800"
                      : "text-white hover:bg-white/80 hover:text-gray-800"
                  }`}
                  onClick={() => setSelectedDuration(duration)}
                  disabled={isLoading || processing}
                >
                  {duration}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto mb-3">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-650"></div>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg max-w-md">
                    <p className="font-semibold mb-2">Error</p>
                    <p>{error}</p>
                  </div>
                </div>
              ) : plans.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-gray-500 text-center p-4 bg-gray-100 rounded-lg max-w-md">
                    <p>No subscription plans available</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-6 px-4 max-sm:grid-cols-1 max-xl:grid-cols-2">
                  {plans
                    .filter((plan) => plan.duration === selectedDuration)
                    .map((plan, index) => (
                      <SubscriptionCard
                        key={`${plan.plan}-${plan.duration}-${index}`}
                        plan={plan}
                        onSubscribe={() => handleSubscribe(plan)}
                        isActive={isPlanActive(plan)}
                      />
                    ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <SubscriptionForm
            plan={selectedPlan!}
            onClose={handleCloseForm}
            onSubmit={handleFormSubmit}
            isLoading={processing}
            stripeKey={stripePublishableKey}
          />
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;

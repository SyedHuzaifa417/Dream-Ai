"use client";

import React, { useState, useEffect } from "react";
import { subscriptionsData } from "./utlis/Data_tbr";
import SubscriptionCard, {
  SubscriptionPlan,
} from "./components/SubscriptionCard";
import SubscriptionForm from "./components/SubscriptionForm";
import {
  getSubscriptionPlans,
  subscribeToPlan,
  getUserSubscription,
  UserSubscription,
} from "@/lib/subscription";
import { toast } from "sonner";

const SubscriptionPage = () => {
  const [selectedDuration, setSelectedDuration] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>();
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState<SubscriptionPlan[]>(subscriptionsData);
  const [activeSubscription, setActiveSubscription] =
    useState<UserSubscription | null>(null);

  // Fetch user's active subscription when component mounts
  useEffect(() => {
    const fetchUserSubscription = async () => {
      try {
        const result = await getUserSubscription();
        if (result.success && result.subscription) {
          setActiveSubscription(result.subscription);
        }
      } catch (error) {
        console.error("Error fetching user subscription:", error);
      }
    };

    fetchUserSubscription();
  }, []);

  // Fetch subscription plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const result = await getSubscriptionPlans(selectedDuration as any);
        if (result.success && result.plans) {
          setPlans(result.plans as any);
        } else {
          // Fallback to sample data if API fails
          const filteredPlans = subscriptionsData.filter(
            (plan) => plan.duration === selectedDuration
          );
          setPlans(filteredPlans);
          console.log("Using fallback subscription data");
        }
      } catch (error) {
        console.error("Error fetching subscription plans:", error);
        // Fallback to sample data
        const filteredPlans = subscriptionsData.filter(
          (plan) => plan.duration === selectedDuration
        );
        setPlans(filteredPlans);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [selectedDuration]);

  const handleSubscribe = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData: any) => {
    if (!selectedPlan) {
      toast.error("Please select a subscription plan", {
        position: "bottom-right",
        duration: 3000,
      });
      return;
    }

    try {
      setIsLoading(true);

      // Call subscription API
      const result = await subscribeToPlan(selectedPlan.id || "", {
        paymentMethod: formData.paymentMethod,
        fullName: formData.fullName,
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
        cvc: formData.cvc,
        savePaymentMethod: true,
      });

      if (result.success) {
        toast.success("Subscription successful!", {
          position: "bottom-right",
          duration: 3000,
        });

        if (result.subscription) {
          setActiveSubscription(result.subscription);
        }

        setShowForm(false);
      } else {
        toast.error(result.message || "Failed to process subscription", {
          position: "bottom-right",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("An error occurred while processing your subscription", {
        position: "bottom-right",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  // Determine if a plan is the user's active plan
  const isPlanActive = (plan: SubscriptionPlan) => {
    if (!activeSubscription) return false;
    return activeSubscription.planId === (plan.id || plan.plan);
  };

  return (
    <div className="p-3 h-screen max-sm:mt-14 max-sm:h-[calc(100vh-56px)] max-sm:p-0">
      <div className="rounded-[20px] border border-white h-full flex flex-col max-sm:border-none">
        {!showForm ? (
          <>
            <div className="flex justify-center items-center mx-auto space-x-5 mt-10 max-sm:mt-3 max-lg:mt-5 mb-20 max-sm:mb-3 max-xl:mb-5 p-1 bg-indigo-650 rounded-3xl w-2/4 max-lg:w-[90%] border">
              {["weekly", "monthly", "yearly"].map((duration) => (
                <button
                  key={duration}
                  className={` py-3 rounded-3xl transition-all flex-1 font-semibold capitalize ${
                    selectedDuration === duration
                      ? "bg-white text-gray-800"
                      : " text-white hover:bg-white/80 hover:text-gray-800"
                  }`}
                  onClick={() => setSelectedDuration(duration)}
                  disabled={isLoading}
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
              ) : (
                <div className="grid grid-cols-3 gap-6 px-4 max-sm:grid-cols-1 max-xl:grid-cols-2">
                  {plans.map((plan) => (
                    <SubscriptionCard
                      key={plan.id || plan.plan}
                      plan={plan}
                      onSubscribe={handleSubscribe}
                      isActive={isPlanActive(plan)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <SubscriptionForm
            plan={selectedPlan}
            onClose={handleCloseForm}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;

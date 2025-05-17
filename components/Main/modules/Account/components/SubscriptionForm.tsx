"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/services/auth/authContext";
import { format } from "date-fns";

const SubscriptionForm: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();  
  React.useEffect(() => {
    console.log('Auth state:', { user, isAuthenticated });
  }, [user, isAuthenticated]);
  return (
    <div className="mx-8 max-sm:ml-4">
      <h1 className="text-2xl max-sm:text-xl font-semibold text-white text-start capitalize my-5 max-sm:my-3">
        Your Subscription Package
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="w-max max-lg:w-full">
            <h3 className="text-xl font-medium text-white mb-4">
              Package
            </h3>
            <div className="flex items-center justify-between">
              <Input
                value={user?.
                  subscription_plan || "No Active Plan"}
                className="border-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 bg-inherit text-white p-5"
                readOnly
              />
            </div>
          </div>
        </div>

        <div>
          <div className="w-max max-lg:w-full">
            <h3 className="text-xl font-medium text-white mb-4">
              Price
            </h3>
            <div className="flex items-center justify-between">
              <Input
                value={user?.price ? `$${user.price}` : "--"}
                className="border-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 bg-inherit text-white p-5"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div>
          <div className="w-max max-lg:w-full">
            <h3 className="text-xl font-medium text-white mb-4">
              Next Billing Date
            </h3>
            <div className="flex items-center justify-between">
              <Input
                value={user?.subscription_end_date ? format(new Date(user.subscription_end_date), 'MMMM dd, yyyy') : "--"}
                className="border-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 bg-inherit text-white p-5"
                readOnly
              />
            </div>
          </div>
        </div>

        <div>
          <div className="w-max max-lg:w-full">
            <h3 className="text-xl font-medium text-white mb-4">
              Status
            </h3>
            <div className="flex items-center justify-between">
              <Input
                value={isAuthenticated && user?.subscription_start_date ? "Active" : "Inactive"}
                className="border-white focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 bg-inherit text-white p-5"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Button
          type="button"
          className="px-10 bg-indigo-650 text-white py-5 rounded-lg hover:bg-indigo-700 transition-all w-max max-lg:w-full mr-4"
          disabled={!isAuthenticated}
          onClick={() => {
            router.push('/subscriptions');
          }}
        >
          Upgrade Plan
        </Button>
        <Button
          type="button"
          className="px-10 border border-red-500 text-red-500 bg-transparent py-5 rounded-lg hover:bg-red-500/10 transition-all w-max max-lg:w-full mt-4 lg:mt-0"
          disabled={!isAuthenticated || !user?.subscription_start_date}
        >
          Cancel Subscription
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionForm;

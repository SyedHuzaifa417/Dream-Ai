"use client";

import React, { useState } from "react";
import { subscriptionsData } from "./utlis/Data_tbr";
import SubscriptionCard, {
  SubscriptionPlan,
} from "./components/SubscriptionCard";
import SubscriptionForm from "./components/SubscriptionForm";

const SubscriptionPage = () => {
  const [selectedDuration, setSelectedDuration] = useState("monthly");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>();
  const [showForm, setShowForm] = useState(false);

  const filteredPlans = subscriptionsData.filter(
    (plan) => plan.duration === selectedDuration
  );

  const handleSubscribe = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowForm(true);
  };

  const handleFormSubmit = (data: any) => {
    console.log("Subscription form submitted:", {
      plan: selectedPlan,
      formData: data,
    });

    setShowForm(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
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
                >
                  {duration}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto mb-3">
              <div className="grid grid-cols-3 gap-6 px-4 max-sm:grid-cols-1 max-xl:grid-cols-2 ">
                {filteredPlans.map((plan) => (
                  <SubscriptionCard
                    key={plan.plan}
                    plan={plan}
                    onSubscribe={handleSubscribe}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <SubscriptionForm
            plan={selectedPlan}
            onClose={handleCloseForm}
            onSubmit={handleFormSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;

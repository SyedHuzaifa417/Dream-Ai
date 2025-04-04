"use client";

import React, { useState } from "react";
import { subscriptionsData } from "./utlis/Data_tbr";

const SubscriptionPage = () => {
  const [selectedDuration, setSelectedDuration] = useState("monthly");

  const filteredPlans = subscriptionsData.filter(
    (plan) => plan.duration === selectedDuration
  );

  return (
    <div className="p-3 h-screen  max-sm:mt-14 max-sm:h-[calc(100vh-56px)] max-sm:p-0">
      <div className="rounded-[20px] border border-white h-full flex flex-col max-sm:border-none ">
        <div className="flex justify-center items-center space-x-5 my-6 p-2 bg-indigo-650 rounded-3xl w-2/4 border">
          {["weekly", "monthly", "yearly"].map((duration) => (
            <button
              key={duration}
              className={` py-2 rounded-3xl transition-all flex-1 ${
                selectedDuration === duration
                  ? "bg-white text-gray-800"
                  : " text-white hover:bg-white/80 hover:text-gray-800"
              }`}
              onClick={() => setSelectedDuration(duration)}
            >
              {duration.charAt(0).toUpperCase() + duration.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex-1 overflowY mb-3 ">
          <div className={`grid grid-cols-3 gap-6 px-4`}>
            {filteredPlans.map((plan) => (
              <div
                key={plan.plan}
                className="border border-gray-300 rounded-lg p-6 shadow-lg bg-white"
              >
                <h3 className="text-xl font-semibold text-purple-920 capitalize">
                  {plan.plan} Plan
                </h3>
                <p className="text-gray-500">{plan.desc}</p>
                <p className="text-lg font-semibold mt-2">
                  ${plan.price} / {plan.duration}
                </p>
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all">
                  Subscribe to Plan
                </button>
                <ul className="mt-4 text-sm text-gray-700 list-disc pl-5">
                  {plan.perks.map((perk, index) => (
                    <li key={index}>{perk}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;

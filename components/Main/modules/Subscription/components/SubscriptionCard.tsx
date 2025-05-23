import React from "react";
import { IoIosCheckmark } from "react-icons/io";
import { SubscriptionPlan } from "../types";

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  onSubscribe: (plan: SubscriptionPlan) => void;
  isActive?: boolean;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  plan,
  onSubscribe,
  isActive = false,
}) => {
  return (
    <div
      className={`border flex flex-col justify-start gap-2 h-[520px] ${
        isActive ? "border-indigo-650 border-2" : "border-gray-300"
      } rounded-lg p-6 shadow-lg bg-white`}
    >
      <div className="flex flex-col items-start h-48">
        {isActive && (
          <div className="bg-indigo-650 text-white text-xs font-bold px-3 py-1 rounded-full mb-2 inline-block w-fit">
            Active Plan
          </div>
        )}
        <h3 className="text-lg font-semibold text-purple-920 capitalize my-2">
          {plan.plan} Plan
        </h3>
        <p className="text-gray-500 my-2 text-sm">{plan.desc}</p>
        <p className="text-lg font-semibold">
          <span className="text-2xl font-bold">${plan.price} </span> /
          <span className="text-base ml-1 font-medium">
            {plan.duration === "monthly"
              ? "Month"
              : plan.duration === "weekly"
              ? "Week"
              : "Year"}
          </span>
        </p>
      </div>
      <button
        className={` w-full ${
          isActive
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-650 hover:bg-blue-700"
        } text-white py-2 text-base rounded-lg transition-all capitalize`}
        onClick={() => !isActive && onSubscribe(plan)}
        disabled={isActive}
      >
        {isActive
          ? "Current Plan"
          : `Subscribe to ${plan.plan === "professional" ? "pro" : plan.plan}`}
      </button>
      <ul className="mt-4 space-y-3 text-sm text-gray-700">
        {plan.perks.map((perk, index) => (
          <li key={index} className="flex items-start mb-2">
            <IoIosCheckmark className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{perk}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubscriptionCard;

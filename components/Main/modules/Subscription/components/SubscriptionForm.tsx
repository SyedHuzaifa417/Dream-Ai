import React, { useState, useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubscriptionPlan } from "./SubscriptionCard";
import { RxCross2 } from "react-icons/rx";
import { subscriptionsData } from "../utlis/Data_tbr";
import { FaCreditCard, FaPaypal, FaApplePay } from "react-icons/fa";
import clsx from "clsx";
import { IoIosCheckmark } from "react-icons/io";

const subscriptionFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  paymentMethod: z.enum(["creditCard", "paypal", "applePay"]),
  cardNumber: z
    .string()
    .min(14, "Card number is too short")
    .max(19, "Card number is too long")
    .optional(),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format")
    .optional(),
  cvc: z
    .string()
    .min(3, "CVC must be at least 3 digits")
    .max(4, "CVC can be max 4 digits")
    .optional(),
});

type SubscriptionFormData = z.infer<typeof subscriptionFormSchema>;

interface SubscriptionFormProps {
  plan: SubscriptionPlan | undefined;
  onClose: () => void;
  onSubmit: (data: SubscriptionFormData) => void;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  plan: initialPlan,
  onClose,
  onSubmit,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<
    SubscriptionPlan | undefined
  >(initialPlan);
  const [nameEntered, setNameEntered] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(
    initialPlan?.duration || "monthly"
  );
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(false);

  const filteredPlans = subscriptionsData.filter(
    (plan) => plan.duration === currentDuration
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      paymentMethod: "creditCard",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
    },
  });

  const fullName = watch("fullName");
  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    setNameEntered(fullName.length >= 2);
  }, [fullName]);

  const selectPaymentMethod = (
    method: "creditCard" | "paypal" | "applePay"
  ) => {
    if (nameEntered) {
      setValue("paymentMethod", method);
      setPaymentMethodSelected(true);
    }
  };

  const resetPaymentMethod = () => {
    setPaymentMethodSelected(false);
  };

  const togglePlanSelection = (plan: SubscriptionPlan) => {
    if (selectedPlan?.plan === plan.plan) {
      setSelectedPlan(undefined);
    } else {
      setSelectedPlan(plan);
    }
  };

  const processSubmit = (data: SubscriptionFormData) => {
    if (!selectedPlan) {
      alert("Please select a plan to continue");
      return;
    }

    onSubmit({
      ...data,
      cardNumber:
        data.paymentMethod === "creditCard" ? data.cardNumber : undefined,
      expiryDate:
        data.paymentMethod === "creditCard" ? data.expiryDate : undefined,
      cvc: data.paymentMethod === "creditCard" ? data.cvc : undefined,
    });
    console.log(data);
  };

  const getHeadingText = () => {
    if (!selectedPlan) return "Choose Your Plan";

    switch (selectedPlan.plan) {
      case "professional":
        return "Go Pro: Elevate Your Vision with Dream Ai Video Magic";
      case "standard":
        return "Go Standard: Unleash Creativity - Dream AI Video at Your Fingertips";
      default:
        return "Go Basic: Start Your Journey: Dream AI Video, Simplified";
    }
  };

  return (
    <div className="w-full p-3">
      <h3 className="text-3xl max-lg:text-2xl max-sm:text-xl font-semibold text-white text-center capitalize my-10">
        {getHeadingText()}
      </h3>
      <div className="flex flex-row max-md:flex-col gap-6">
        <div className=" w-full bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-end items-center mb-6">
            <button
              className="text-gray-500 hover:text-gray-800"
              onClick={onClose}
            >
              <RxCross2 />
            </button>
          </div>
          <div className="flex justify-between items-center">
            <form
              className="space-y-4 w-2/3 pr-24 "
              onSubmit={handleSubmit(processSubmit)}
            >
              <div>
                <label className="block text-gray-700 mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  className={`w-full p-3 border rounded-lg ${
                    errors.fullName ? "border-red-500" : "border-indigo-650"
                  }`}
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className={`w-full p-3 border rounded-lg ${
                    errors.email ? "border-red-500" : "border-indigo-650"
                  }`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1">
                  Payment Method
                </label>

                {!paymentMethodSelected ? (
                  <div className="space-y-2">
                    <div
                      className={`flex items-center p-3 border rounded-lg ${
                        !nameEntered
                          ? "opacity-70 cursor-not-allowed"
                          : "cursor-pointer border-indigo-650 hover:bg-indigo-50"
                      }`}
                      onClick={() =>
                        nameEntered && selectPaymentMethod("creditCard")
                      }
                    >
                      <FaCreditCard className="mr-2 text-indigo-650" />
                      <label
                        className={`${
                          !nameEntered ? "text-gray-400" : "text-gray-700"
                        }`}
                      >
                        Credit Card
                      </label>
                    </div>

                    <div
                      className={`flex items-center p-3 border rounded-lg ${
                        !nameEntered
                          ? "opacity-70 cursor-not-allowed"
                          : "cursor-pointer border-indigo-650 hover:bg-indigo-50"
                      }`}
                      onClick={() =>
                        nameEntered && selectPaymentMethod("paypal")
                      }
                    >
                      <FaPaypal className="mr-2 text-blue-600" />
                      <label
                        className={`${
                          !nameEntered ? "text-gray-400" : "text-gray-700"
                        }`}
                      >
                        PayPal
                      </label>
                    </div>

                    <div
                      className={`flex items-center p-3 border rounded-lg ${
                        !nameEntered
                          ? "opacity-70 cursor-not-allowed"
                          : "cursor-pointer border-indigo-650 hover:bg-indigo-50"
                      }`}
                      onClick={() =>
                        nameEntered && selectPaymentMethod("applePay")
                      }
                    >
                      <FaApplePay className="mr-2 text-black" />
                      <label
                        className={`${
                          !nameEntered ? "text-gray-400" : "text-gray-700"
                        }`}
                      >
                        Apple Pay
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="mb-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-indigo-50 border-indigo-650">
                      {paymentMethod === "creditCard" && (
                        <>
                          <div className="flex items-center">
                            <FaCreditCard className="mr-2 text-indigo-650" />
                            <span className="text-gray-700">Credit Card</span>
                          </div>
                        </>
                      )}
                      {paymentMethod === "paypal" && (
                        <>
                          <div className="flex items-center">
                            <FaPaypal className="mr-2 text-blue-600" />
                            <span className="text-gray-700">PayPal</span>
                          </div>
                        </>
                      )}
                      {paymentMethod === "applePay" && (
                        <>
                          <div className="flex items-center">
                            <FaApplePay className="mr-2 text-black" />
                            <span className="text-gray-700">Apple Pay</span>
                          </div>
                        </>
                      )}
                      <button
                        type="button"
                        className="text-gray-500 hover:text-red-500"
                        onClick={resetPaymentMethod}
                      >
                        <RxCross2 />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {paymentMethod === "creditCard" && paymentMethodSelected && (
                <>
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      className={`w-full p-3 border rounded-lg ${
                        errors.cardNumber
                          ? "border-red-500"
                          : "border-indigo-650"
                      }`}
                      placeholder="1234 5678 9012 3456"
                      {...register("cardNumber")}
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.cardNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        className={`w-full p-3 border rounded-lg ${
                          errors.expiryDate
                            ? "border-red-500"
                            : "border-indigo-650"
                        }`}
                        placeholder="MM/YY"
                        {...register("expiryDate")}
                      />
                      {errors.expiryDate && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.expiryDate.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-1">CVC</label>
                      <input
                        type="text"
                        className={`w-full p-3 border rounded-lg ${
                          errors.cvc ? "border-red-500" : "border-indigo-650"
                        }`}
                        placeholder="123"
                        {...register("cvc")}
                      />
                      {errors.cvc && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.cvc.message}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === "paypal" && paymentMethodSelected && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-gray-700">
                    You will be redirected to PayPal to complete your payment
                    after clicking &ldquo;Complete Subscription&rdquo;.
                  </p>
                </div>
              )}

              {paymentMethod === "applePay" && paymentMethodSelected && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700">
                    Apple Pay will be processed after clicking &ldquo;Complete
                    Subscription&rdquo;.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-2 rounded-lg transition-all ${
                  !selectedPlan || !paymentMethodSelected
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={!selectedPlan || !paymentMethodSelected}
              >
                Complete Subscription
              </button>

              {(!selectedPlan || !paymentMethodSelected) && (
                <p className="text-center text-red-500 text-xs">
                  {!selectedPlan
                    ? "Please select a plan"
                    : "Please select a payment method"}
                </p>
              )}
            </form>
            <div className="w-1/3 max-md:w-full">
              <div className="grid gap-4">
                {filteredPlans.map((plan) => (
                  <div
                    key={plan.plan}
                    className={`border p-4 rounded-lg cursor-pointer transition-all border-purple-920 ${
                      selectedPlan?.plan === plan.plan
                        ? " bg-indigo-650 text-white"
                        : " hover:bg-blue-50 text-gray-900"
                    }`}
                    onClick={() => togglePlanSelection(plan)}
                  >
                    <div className="flex items-center justify-between ">
                      <h3 className="text-lg font-semibold  capitalize">
                        {plan.plan} Package
                      </h3>
                      <div
                        className={clsx(
                          "w-5 h-5 rounded-full  flex items-center justify-center",
                          selectedPlan?.plan === plan.plan
                            ? "border border-white bg-white"
                            : "border border-blue-500"
                        )}
                      >
                        {selectedPlan?.plan === plan.plan && (
                          <IoIosCheckmark className="w-5 h-5 text-indigo-650 " />
                        )}
                      </div>
                    </div>
                    {selectedPlan?.plan === plan.plan && (
                      <div>
                        <p className="text-sm my-3">{plan.desc}</p>
                        <ul className="mt-5 space-y-3 text-sm ">
                          {plan.perks.slice(0, 5).map((perk, index) => (
                            <li
                              key={index}
                              className="flex items-center mb-1 text-sm"
                            >
                              <span className="mr-2 ">✓</span>
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionForm;

import React, { useState, useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RxCross2 } from "react-icons/rx";
import { subscriptionsData } from "../utlis/Data_tbr";
import { FaCreditCard, FaPaypal, FaApplePay, FaSpinner } from "react-icons/fa";
import clsx from "clsx";
import { IoIosCheckmark } from "react-icons/io";
import { createCheckoutSession } from "@/app/services/subscription/subscriptionApi";
import { useRouter } from "next/navigation";
import { SubscriptionPlan, SubscriptionFormData } from "../types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const subscriptionFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address").optional(),
  paymentMethod: z.enum(["creditCard", "paypal", "applePay"]),
  cardNumber: z
    .string()
    .length(19, "Card number must be exactly 16 digits")
    .optional(),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format")
    .refine((value) => {
      if (!value) return true;
      
      const [month, year] = value.split('/');
      if (!month || !year) return false;
      
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1; 
      
      const expMonth = parseInt(month, 10);
      const expYear = parseInt(year, 10);
      
      return (expYear > currentYear) || (expYear === currentYear && expMonth >= currentMonth);
    }, "Card has expired")
    .optional(),
  cvc: z
    .string()
    .length(3, "CVC must be exactly 3 digits")
    .optional(),
});

interface SubscriptionFormProps {
  plan: SubscriptionPlan | undefined;
  onClose: () => void;
  onSubmit: (data: SubscriptionFormData) => void;
  isLoading?: boolean;
  stripeKey?: string;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  plan: initialPlan,
  onClose,
  onSubmit,
  isLoading = false,
  stripeKey,
}) => {
  
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<
    SubscriptionPlan | undefined
  >(initialPlan);
  const [nameEntered, setNameEntered] = useState(false);
  const [paymentMethodSelected, setPaymentMethodSelected] = useState(false);

  const filteredPlans = subscriptionsData.filter(
    (plan) => plan.duration === (initialPlan?.duration || "monthly")
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

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanValue = value.replace(/\D/g, '');
    
    if (cleanValue.length <= 16) {
      const formatted = cleanValue.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
      setValue('cardNumber', cleanValue);
      e.target.value = formatted;
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanValue = value.replace(/\D/g, '');
    
    let formatted = '';
    
    if (cleanValue.length === 0) {
      formatted = '';
    } else if (cleanValue.length === 1) {
      if (parseInt(cleanValue) > 1) {
        formatted = `0${cleanValue}/`;
      } else {
        formatted = cleanValue;
      }
    } else if (cleanValue.length === 2) {
      const month = parseInt(cleanValue);
      if (month > 12) {
        formatted = '12/';
      } else if (month === 0) {
        formatted = '01/';
      } else {
        formatted = `${cleanValue}/`;
      }
    } else {
      const month = cleanValue.substring(0, 2);
      const year = cleanValue.substring(2, 4);
      
      if (parseInt(month) > 12) {
        formatted = `12/${year}`;
      } else if (parseInt(month) === 0) {
        formatted = `01/${year}`;
      } else {
        formatted = `${month}/${year}`;
      }
    }
    
    setValue('expiryDate', formatted);
    e.target.value = formatted;
  };

  const handleCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanValue = value.replace(/\D/g, '');
    
    if (cleanValue.length <= 3) {
      setValue('cvc', cleanValue);
      e.target.value = cleanValue;
    }
  };

  const processSubmit = async (data: SubscriptionFormData) => {
    if (!selectedPlan) {
      alert("Please select a plan to continue");
      return;
    }
    
    try {
      const result = await createCheckoutSession(
        selectedPlan.plan, // plan_type: basic, standard, professional
        selectedPlan.duration, // duration: weekly, monthly, yearly
        stripeKey // Pass the Stripe key if available
      );
      
      if (result.status === 'success') {
        onSubmit({
          ...data,
          cardNumber:
            data.paymentMethod === "creditCard" ? data.cardNumber : undefined,
          expiryDate:
            data.paymentMethod === "creditCard" ? data.expiryDate : undefined,
          cvc: data.paymentMethod === "creditCard" ? data.cvc : undefined,
          planType: selectedPlan.plan,
          duration: selectedPlan.duration,
        });
        
        if (result.url) {
          window.location.href = result.url;
        } else {
          router.push('/subscriptions');
        }
      } else {
        alert(result.message || "Failed to process subscription");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("An error occurred while processing your subscription");
    }
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

  const handlePlanChange = (value: string) => {
    if (value === "unselect") {
      setSelectedPlan(undefined);
      return;
    }
    const selected = filteredPlans.find((plan) => plan.plan === value);
    if (selected) {
      setSelectedPlan(selected);
    }
  };

  return (
    <div className="w-full p-3">
      <h3 className="text-3xl max-lg:text-2xl max-sm:text-xl font-semibold text-white text-center capitalize my-8 max-lg:my-5 max-sm:my-3">
        {getHeadingText()}
      </h3>
      <div className="flex flex-row max-md:flex-col gap-6">
        <div className="w-full bg-white p-6 rounded-lg shadow-lg">
          <div className="flex justify-end items-center mb-6 max-sm:mb-2">
            <button
              className="text-gray-500 hover:text-gray-800"
              onClick={onClose}
              disabled={isLoading}
            >
              <RxCross2 />
            </button>
          </div>

          <div className="hidden max-lg:block mb-6 max-sm:mb-3">
            <Select
              onValueChange={handlePlanChange}
              value={selectedPlan?.plan || "unselect"}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full border-indigo-650  focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none py-6">
                <SelectValue placeholder="Select a Plan">
                  {selectedPlan
                    ? `${selectedPlan.plan} Package`
                    : "Select a Plan"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="border-gray-600  w-full">
                <SelectItem value="unselect" className="w-full">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-gray-600">Select a Plan</span>
                  </div>
                </SelectItem>
                {filteredPlans.map((plan) => (
                  <SelectItem
                    key={plan.plan}
                    value={plan.plan}
                    className={clsx(
                      "w-full py-3 ",
                      selectedPlan === plan
                        ? "!bg-indigo-650 !text-white"
                        : "!bg-white"
                    )}
                  >
                    <span className="text-sm font-semibold capitalize">
                      {plan.plan} Package
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center max-lg:flex-col ">
            <form
              className="space-y-4 w-2/3 pr-24 max-lg:w-full max-lg:pr-0 max-lg:max-h-[60vh] overflow-y-auto "
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                        disabled={isLoading}
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
                      placeholder="XXXX XXXX XXXX XXXX"
                      inputMode="numeric"
                      maxLength={19}
                      onKeyDown={(e) => {
                        if (
                          !/[0-9]/.test(e.key) &&
                          e.key !== "Backspace" &&
                          e.key !== "Delete" &&
                          e.key !== "ArrowLeft" &&
                          e.key !== "ArrowRight" &&
                          e.key !== "Tab"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      {...register("cardNumber", {
                        onChange: handleCardNumberChange
                      })}
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
                        inputMode="numeric"
                        maxLength={5} // MM/YY format
                        onKeyDown={(e) => {
                          if (
                            !/[0-9]/.test(e.key) &&
                            e.key !== "Backspace" &&
                            e.key !== "Delete" &&
                            e.key !== "ArrowLeft" &&
                            e.key !== "ArrowRight" &&
                            e.key !== "Tab"
                          ) {
                            e.preventDefault();
                          }
                        }}
                        {...register("expiryDate", {
                          onChange: handleExpiryDateChange
                        })}
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
                        inputMode="numeric"
                        maxLength={3}
                        onKeyDown={(e) => {
                          if (
                            !/[0-9]/.test(e.key) &&
                            e.key !== "Backspace" &&
                            e.key !== "Delete" &&
                            e.key !== "ArrowLeft" &&
                            e.key !== "ArrowRight" &&
                            e.key !== "Tab"
                          ) {
                            e.preventDefault();
                          }
                        }}
                        {...register("cvc", {
                          onChange: handleCVCChange
                        })}
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
                className={`w-full py-3 rounded-lg text-white font-medium ${
                  isLoading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-650 hover:bg-indigo-700"
                }`}
                disabled={!selectedPlan || !paymentMethodSelected}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <FaSpinner className="animate-spin mr-2" />
                    Processing...
                  </span>
                ) : (
                  "Subscribe Now"
                )}
              </button>
            </form>

            <div className="w-1/3 max-lg:hidden">
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
                      <h3 className="text-base font-semibold  capitalize">
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
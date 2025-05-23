"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { EmailForm } from "./components/EmailForm";
import { OtpVerification } from "./components/OtpVerification";
import { ResetPasswordForm } from "./components/ResetPasswordForm";
import { SuccessMessage } from "./components/SuccessMessage";
import { useSendOtpMutation, useVerifyOtpMutation, useCreatePasswordMutation } from "@/app/services/auth";

type PasswordResetStage = "email" | "otp" | "reset" | "success";

export default function PasswordReset() {
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<PasswordResetStage>("email");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("stage", stage);
  useEffect(() => {
    setMounted(true);
  }, []);

  const sendOtpMutation = useSendOtpMutation();

  const handleEmailSubmit = async (email: string) => {
    setIsSubmitting(true);
    try {
     await sendOtpMutation.mutateAsync(email);
      setEmail(email);
      
      toast.success("OTP sent to your email", {
        position: "bottom-right",
        duration: 3000,
      });
      
      setStage("otp");
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.", {
        position: "bottom-right",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtpMutation = useVerifyOtpMutation();
  
  const handleOtpSubmit = async (otp: string) => {
    setIsSubmitting(true);
    try {
      await verifyOtpMutation.mutateAsync({
        email,
        otp,
      });
      
      toast.success("OTP verified successfully", {
        position: "bottom-right",
        duration: 3000,
      });
      
      setStage("reset");
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response?.data?.message || "Failed to verify OTP. Please try again.", {
        position: "bottom-right",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const createPasswordMutation = useCreatePasswordMutation();
  
  const handlePasswordReset = async (password: string) => {
    setIsSubmitting(true);
    try {
      await createPasswordMutation.mutateAsync({
        email,
        newPassword: password,
      });
      
      toast.success("Password reset successfully", {
        position: "bottom-right",
        duration: 3000,
      });

      setStage("success");
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.", {
        position: "bottom-right",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen w-1/2 max-xl:w-full mx-auto flex items-center justify-center p-4">
      <div className="relative z-10 w-full">
        <div className="bg-[#DADADA] rounded-2xl shadow-lg">
          {stage === "email" && (
            <>
              <EmailForm
                onSubmit={handleEmailSubmit}
                isSubmitting={isSubmitting}
              />
              <p className="py-6 text-center text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/signin"
                  className="font-medium text-purple-920 hover:text-purple-900"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}

          {stage === "otp" && (
            <OtpVerification
              onSubmit={handleOtpSubmit}
              isSubmitting={isSubmitting}
              email={email}
            />
          )}

          {stage === "reset" && (
            <>
              <ResetPasswordForm
                onSubmit={handlePasswordReset}
                isSubmitting={isSubmitting}
              />
              <p className="py-6 text-center text-sm text-gray-600">
                Remember your password?{" "}
                <Link
                  href="/signin"
                  className="font-medium text-purple-920 hover:text-purple-900"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}

          {stage === "success" && (
            <SuccessMessage message="Your password has been reset successfully!" />
          )}
        </div>
      </div>
    </div>
  );
}

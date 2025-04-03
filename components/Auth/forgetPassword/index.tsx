import { useState } from "react";
import Link from "next/link";
import { EmailForm } from "./components/EmailForm";
import { OtpVerification } from "./components/OtpVerification";
import { ResetPasswordForm } from "./components/ResetPasswordForm";
import { SuccessMessage } from "./components/SuccessMessage";

type PasswordResetStage = "email" | "otp" | "reset" | "success";

export default function PasswordReset() {
  const [stage, setStage] = useState<PasswordResetStage>("email");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (email: string) => {
    setIsSubmitting(true);
    try {
      // API call to send OTP to email would go here
      console.log("Sending OTP to:", email);
      setEmail(email);

      setStage("otp");
    } catch (error) {
      console.error("Error sending OTP:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = async (otp: string) => {
    setIsSubmitting(true);
    try {
      // API call to verify OTP would go here
      console.log("Verifying OTP:", otp);
      setStage("reset");
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (password: string) => {
    setIsSubmitting(true);
    try {
      // API call to reset password would go here
      console.log("Resetting password for:", email);
      setStage("success");
    } catch (error) {
      console.error("Error resetting password:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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

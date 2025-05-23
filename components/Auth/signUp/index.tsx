"use client";

import { useState } from "react";
import Link from "next/link";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/services/auth/authContext";

const signUpSchema = z
  .object({
    name: z.string().min(2, "Username must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const { signup } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: SignUpForm) => {
    try {
      setIsSubmitting(true);
      
 
      await signup(data.name, data.email, data.password);

      toast.success("Account created successfully!", {
        position: "bottom-right",
        duration: 3000,
      });

      router.push("/signin");
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error.response?.data?.message || "Failed to create account", {
        position: "bottom-right",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-1/2 max-xl:w-full mx-auto flex items-center justify-center p-4">
      <div className="relative z-10 w-full">
        <div className="bg-[#DADADA] rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 text-center py-7">
            Create an Account
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2 px-32 max-lg:px-9"
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your username"
                className="w-full py-6"
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full py-6"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                className="w-full py-6"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="w-full py-6"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex justify-center pt-5">
              <Button
                type="submit"
                className="w-full bg-purple-920 hover:bg-purple-900 py-5"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Loading..." : "Agree and Register"}
              </Button>
            </div>
          </form>

          <p className="py-6 text-center text-sm text-gray-600">
            Already have an account?
            <Link
              href="/signin"
              className="font-medium text-purple-920 hover:text-purple-900"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "@/lib/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignIn() {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInForm) => {
    try {
      const result = await signIn(data.email, data.password);

      if (result.success) {
        // Save remember me preference if selected
        if (rememberMe) {
          localStorage.setItem("rememberEmail", data.email);
        } else {
          localStorage.removeItem("rememberEmail");
        }

        toast.success("Sign in successful!", {
          position: "bottom-right",
          duration: 3000,
        });

        // Redirect to home page after successful login
        router.push("/");
      } else {
        toast.error(result.message || "Failed to sign in", {
          position: "bottom-right",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("An unexpected error occurred", {
        position: "bottom-right",
        duration: 3000,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // This would redirect to Google OAuth flow
      window.location.href = "/api/auth/google";
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("Failed to sign in with Google", {
        position: "bottom-right",
        duration: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen w-1/2 max-xl:w-full mx-auto flex items-center justify-center p-4">
      <div className="relative z-10 w-full">
        <div className="bg-[#DADADA] rounded-2xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 text-center py-7">
            Welcome Back
          </h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-2 px-20 max-lg:px-9"
          >
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
                placeholder="Enter your password"
                className="w-full py-6"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between py-2 max-sm:flex-col max-sm:gap-2">
              <div className="flex items-center max-sm:self-start">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm max-sm:self-end">
                <Link
                  href="/reset-password"
                  className="font-medium text-purple-920 hover:text-purple-900"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-920 hover:bg-purple-900"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative px-40 flex items-center text-sm max-sm:px-10">
                <div className="flex-1 border-t border-gray-500" />
                <span className="px-2 text-gray-500">Or continue with</span>
                <div className="flex-1 border-t border-gray-500" />
              </div>
            </div>

            <div className="mt-3 flex justify-center">
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2 border border-gray-400"
                onClick={handleGoogleSignIn}
                type="button"
              >
                <FcGoogle className="h-5 w-5" />
                <span>Sign in with Google</span>
              </Button>
            </div>
          </div>

          <p className="py-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-purple-920 hover:text-purple-900"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

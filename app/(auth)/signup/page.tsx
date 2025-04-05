import SignUp from "@/components/Auth/signUp";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "AI-powered image and video generation",
};

const page = () => {
  return <SignUp />;
};

export default page;

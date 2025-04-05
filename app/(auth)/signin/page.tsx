import SignIn from "@/components/Auth/signIn";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Sign In",
  description: "AI-powered image and video generation",
};

const page = () => {
  return <SignIn />;
};

export default page;

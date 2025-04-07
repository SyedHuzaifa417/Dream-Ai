import AccountPage from "@/components/Main/modules/Account";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Account",
  description: "AI-powered image and video generation",
};

const page = () => {
  return <AccountPage />;
};

export default page;

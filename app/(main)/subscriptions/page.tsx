import SubscriptionPage from "@/components/Main/modules/Subscription";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscription",
  description: "AI-powered image and video generation",
};

const page = () => {
  return <SubscriptionPage />;
};

export default page;

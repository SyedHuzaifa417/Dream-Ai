import React from "react";
import HistoryPage from "@/components/Main/modules/History";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "History",
  description: "AI-powered image and video generation",
};

const page = () => {
  return <HistoryPage />;
};

export default page;

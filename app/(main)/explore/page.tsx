import ExplorePage from "@/components/Main/modules/Explore";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore",
  description: "AI-powered image and video generation",
};

const page = () => {
  return <ExplorePage />;
};

export default page;

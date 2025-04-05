import VideoPage from "@/components/Main/modules/VideoGeneration";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Videos",
  description: "AI-powered image and video generation",
};

const page = () => {
  return <VideoPage />;
};

export default page;

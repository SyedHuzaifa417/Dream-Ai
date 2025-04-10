import ImagesGenerationPage from "@/components/Main/modules/ImageGeneration";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Images",
  description: "AI-powered image and video generation",
};

const page = () => {
  return <ImagesGenerationPage />;
};

export default page;

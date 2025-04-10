"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { sampleImages } from "@/components/Main/modules/ImageGeneration/utlis/Data_tbr";
import { sampleVideos } from "@/components/Main/modules/VideoGeneration/utlis/Data_tbr";
import { Button } from "@/components/ui/button";

type MediaData = {
  type: "image" | "video";
  url: string;
  title: string;
  description?: string;
};

interface MediaPageClientProps {
  onBack?: () => void;
  type: "image" | "video";
  prompt?: string;
}

export function MediaPageClient({
  type,
  onBack,
  prompt,
}: MediaPageClientProps) {
  const [mediaData, setMediaData] = useState<MediaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(60);

  const loadFallbackMedia = useCallback(() => {
    if (type === "image") {
      setMediaData({
        type: "image",
        url: sampleImages[0].url,
        title: sampleImages[0].title || "Generated Image",
        description:
          sampleImages[0].description || "Generated image description",
      });
    } else if (type === "video") {
      setMediaData({
        type: "video",
        url: sampleVideos[0].thumbnailUrl,
        title: sampleVideos[0].title || "Generated Video",
      });
    }

    setIsLoading(false);
  }, [type]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          //api call
          console.log("Using prompt for generation:", prompt);
          loadFallbackMedia();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [type, loadFallbackMedia, prompt]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full mt-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-650 mb-4"></div>
        <p className="text-white text-lg font-medium">
          Your {type} will be ready in {formatTime(timeRemaining)}
        </p>
      </div>
    );
  }

  if (!mediaData) {
    return (
      <div className="flex items-center justify-center h-full mt-10">
        <p className="text-white">Media could not be generated</p>
      </div>
    );
  }
  return (
    <div className="w-full p-4 pt-0 flex items-start justify-start ">
      <div className="w-full">
        <div className="relative w-full h-[600px] max-xl:h-[450px] max-sm:h-[400px] self-start">
          <Image
            src={mediaData.url}
            alt={mediaData.title}
            className="w-full h-full rounded-lg object-cover"
            width={800}
            height={800}
            priority
          />
        </div>
        <div className="mt-4 text-white space-x-2 w-2/3 flex max-sm:w-full">
          <Button className="flex-1 w-full bg-indigo-650 hover:bg-indigo-700 text-white text-sm">
            Post To
          </Button>
          <Button className="flex-1 w-full bg-indigo-650 hover:bg-indigo-700 text-white text-sm">
            Share
          </Button>
          <Button className="flex-1 w-full bg-indigo-650 hover:bg-indigo-700 text-white text-sm">
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}

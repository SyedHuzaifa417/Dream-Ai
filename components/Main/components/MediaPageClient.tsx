"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateImage, downloadMedia, shareMedia, postMedia } from "@/app/services/media";

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
  settings?: {
    style?: string;
    aspectRatio?: string;
    autoTitle?: boolean;
    autoDescription?: boolean;
    guidanceScale?: number;
    inferenceSteps?: number;
    excludeText?: string;
  };
}

export function MediaPageClient({
  type,
  onBack,
  prompt,
  settings = {},
}: MediaPageClientProps) {
  const [mediaData, setMediaData] = useState<MediaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const generationStarted = useRef(false);

  // Generate media using the API
  const generateMedia = useCallback(async () => {
    // Prevent multiple API calls
    if (generationStarted.current) return;
    generationStarted.current = true;

    try {
      let response;

      if (type === "image") {
        response = await generateImage(prompt, {
          guidanceScale: settings.guidanceScale,
          inferenceSteps: settings.inferenceSteps,
          excludeText: settings.excludeText,
          autoTitle: settings.autoTitle,
          autoDescription: settings.autoDescription,
          style: settings.style,
          aspectRatio: settings.aspectRatio
        });
      } else {
        // Video generation not implemented yet
        console.log("Video generation not implemented yet");
        setErrorMessage("Video generation is not implemented yet");
        setIsLoading(false);
        return;
      }

      if (response && response.success && response.data) {
        setMediaData({
          type: type as "image" | "video",
          url: response.data.url,
          title: response.data.title,
          description: response.data.description,
        });

        toast.success(
          `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } generated successfully!`,
          {
            position: "bottom-right",
            duration: 3000,
          }
        );
      } else {
        throw new Error(response?.error || "Failed to generate media");
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error generating media:", error);
      setErrorMessage("Failed to generate media. Please try again.");
      setIsLoading(false);
      toast.error("Failed to generate media", {
        position: "bottom-right",
        duration: 3000,
      });
    }
  }, [type, prompt, settings]);

  useEffect(() => {
    // Reset state when component mounts
    generationStarted.current = false;

    // Countdown timer to show progress
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          // Call API
          generateMedia();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [generateMedia]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleDownload = async () => {
    if (!mediaData) return;

    try {
      const result = await downloadMedia(mediaData.url, type);

      if (result.success) {
        toast.success(
          `${type.charAt(0).toUpperCase() + type.slice(1)} downloaded!`,
          {
            position: "bottom-right",
            duration: 3000,
          }
        );
      } else {
        throw new Error("Download failed");
      }
    } catch (error) {
      console.error("Error downloading media:", error);
      toast.error(`Failed to download ${type}`, {
        position: "bottom-right",
        duration: 3000,
      });
    }
  };

  const handleShare = async () => {
    if (!mediaData) return;

    try {
      // For now, we are using social as the platform
      const result = await shareMedia(mediaData.url, "social");

      if (result.success) {
        toast.success(
          `${type.charAt(0).toUpperCase() + type.slice(1)} shared!`,
          {
            position: "bottom-right",
            duration: 3000,
          }
        );
      } else {
        throw new Error("Sharing failed");
      }
    } catch (error) {
      console.error("Error sharing media:", error);
      toast.error(`Failed to share ${type}`, {
        position: "bottom-right",
        duration: 3000,
      });
    }
  };

  const handlePostTo = async () => {
    if (!mediaData) return;

    try {
      const result = await postMedia(mediaData.url, type, [
        "instagram",
        "twitter",
      ]);

      if (result.success) {
        toast.success(`Ready to post ${type}!`, {
          position: "bottom-right",
          duration: 3000,
        });
      } else {
        throw new Error("Posting failed");
      }
    } catch (error) {
      console.error("Error posting media:", error);
      toast.error(`Failed to prepare ${type} for posting`, {
        position: "bottom-right",
        duration: 3000,
      });
    }
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

  if (errorMessage) {
    return (
      <div className="flex items-center justify-center h-full mt-10">
        <p className="text-white text-lg">{errorMessage}</p>
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
          <Button
            className="flex-1 w-full bg-indigo-650 hover:bg-indigo-700 text-white text-sm"
            onClick={handlePostTo}
          >
            Post To
          </Button>
          <Button
            className="flex-1 w-full bg-indigo-650 hover:bg-indigo-700 text-white text-sm"
            onClick={handleShare}
          >
            Share
          </Button>
          <Button
            className="flex-1 w-full bg-indigo-650 hover:bg-indigo-700 text-white text-sm"
            onClick={handleDownload}
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}

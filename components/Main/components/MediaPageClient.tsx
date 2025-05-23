"use client";

import {  useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateImage, generateVideo, generateImageToImage, generateImageToVideo, downloadMedia, shareMedia, postMedia } from "@/app/services/media";
import { getCurrentUserEmail } from "@/app/services/auth/authApi";

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
  uploadedImage?: File | null;
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
  uploadedImage = null,
  settings = {},
}: MediaPageClientProps) {
  const [mediaData, setMediaData] = useState<MediaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateMedia = async () => {
    const email = getCurrentUserEmail();
    if (!email) {
      toast.error("Please login first to generate media", {
        position: "bottom-right",
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    
    let remainingTime = 120;
    setTimeRemaining(remainingTime);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      remainingTime -= 1;
      setTimeRemaining(remainingTime);
      
      if (remainingTime <= 0 && timerRef.current) {
        clearInterval(timerRef.current);
      }
    }, 1000);

    try {
      let response;

      // Map aspect ratio from UI settings to API format
      let mappedAspectRatio = "1:1";
      if (settings.aspectRatio) {
        switch (settings.aspectRatio.toLowerCase()) {
          case "square":
            mappedAspectRatio = "1:1";
            break;
          case "landscape":
            mappedAspectRatio = "16:9";
            break;
          case "portrait":
            mappedAspectRatio = "9:16";
            break;
          case "wide":
            mappedAspectRatio = "4:3";
            break;
          case "tall":
            mappedAspectRatio = "3:4";
            break;
          default:
            if (/^\d+:\d+$/.test(settings.aspectRatio)) {
              mappedAspectRatio = settings.aspectRatio;
            }
        }
      }

      if (type === "image") {
        if (uploadedImage) {
          // Use image-to-image if an image is provided
          response = await generateImageToImage(uploadedImage, prompt || "", {
            aspectRatio: mappedAspectRatio,
            autoTitle: settings.autoTitle,
            autoDescription: settings.autoDescription,
            num_inference_steps: settings.inferenceSteps || 28,
            guidance: settings.guidanceScale ? settings.guidanceScale / 10 : 5,
            output_quality: 90,
            prompt_strength: 0.8
          });
        } else {
          // Use text-to-image if no image is provided
          response = await generateImage(prompt, {
          // guidanceScale: settings.guidanceScale,
          // inferenceSteps: settings.inferenceSteps,
          // excludeText: settings.excludeText,
          // style: settings.style,
          // aspectRatio: settings.aspectRatio
            num_inference_steps: settings.inferenceSteps || 4,
            seed: Math.floor(Math.random() * 4294967295),
            autoTitle: settings.autoTitle,
            autoDescription: settings.autoDescription,
            aspectRatio: mappedAspectRatio
          });
        }
      } else {
        if (uploadedImage) {
          // Use image-to-video if an image is provided
          response = await generateImageToVideo(uploadedImage, prompt || "", {
            aspect_ratio: mappedAspectRatio,
            autoTitle: settings.autoTitle,
            autoDescription: settings.autoDescription,
            fast_mode: "Balanced",
            sample_steps: settings.inferenceSteps || 30,
            sample_guide_scale: settings.guidanceScale ? Math.round(settings.guidanceScale / 5) : 5
          });
        } else {
          // Use text-to-video if no image is provided
          response = await generateVideo(prompt, {
            aspect_ratio: "16:9",
            autoTitle: settings.autoTitle,
            autoDescription: settings.autoDescription,
            fast_mode: "Balanced"
          });
        }
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
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    } catch (error) {
      console.error("Error generating media:", error);
      setErrorMessage("Failed to generate media. The subscription plan may be expired");
      setIsLoading(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      toast.error("Failed to generate media", {
        position: "bottom-right",
        duration: 5000,
      });
    }
  };

  
  useEffect(() => {
    generateMedia();
    
  
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="w-full p-4 pt-0 flex items-start justify-start">
      <div className="w-full">
        <div className="relative w-full h-[600px] max-xl:h-[450px] max-sm:h-[400px] self-start">
          {mediaData && mediaData.type === "video" ? (
            <video
              ref={videoRef}
              src={mediaData.url}
              className="w-full h-full rounded-lg object-cover"
              controls
              autoPlay
              playsInline
              loop
            />
          ) : mediaData ? (
            <Image
              src={mediaData.url}
              alt={mediaData.title || "Generated image"}
              className="w-full h-full rounded-lg object-cover"
              width={800}
              height={800}
              priority
            />
          ) : null}
        </div>
        <div className="mt-4 text-white space-x-2 w-2/3 flex max-sm:w-full">
          <Button
            className="flex-1 w-full bg-indigo-650 hover:bg-indigo-700 text-white text-sm"
            onClick={handleShare}
            disabled={isLoading}
          >
            Post To
          </Button>
          <Button
            className="flex-1 w-full bg-indigo-650 hover:bg-indigo-700 text-white text-sm"
            onClick={handleShare}
            disabled={isLoading}
          >
            Share
          </Button>
          <Button
            className="flex-1 w-full bg-indigo-650 hover:bg-indigo-700 text-white text-sm"
            onClick={handleDownload}
            disabled={isLoading}
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}

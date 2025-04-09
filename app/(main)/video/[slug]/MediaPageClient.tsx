"use client";

import { useEffect, useState } from "react";
import SettingsPanel from "@/components/Main/components/settings-panel";
import { sampleVideos } from "@/components/Main/modules/VideoGeneration/utlis/Data_tbr";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type MediaData = {
  type: "video";
  url: string;
  title: string;
};

interface MediaPageClientProps {
  slug: string;
  type: "video";
}

export default function MediaPageClient({ slug, type }: MediaPageClientProps) {
  const [mediaData, setMediaData] = useState<MediaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        const index = parseInt(slug.replace("video-", "")) - 1;
        if (index >= 0 && index < sampleVideos.length) {
          setMediaData({
            type: "video",
            url: sampleVideos[index].thumbnailUrl,
            title: sampleVideos[index].title || `Video ${index + 1}`,
          });
        }
      } catch (error) {
        console.error("Error fetching media data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMediaData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-650"></div>
      </div>
    );
  }

  if (!mediaData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white">Media not found</p>
      </div>
    );
  }

  return (
    <div className="p-3 h-screen max-sm:mt-14 max-sm:h-[calc(100vh-56px)] max-sm:p-0 max-lg:h-auto">
      <div className="rounded-[20px] border border-white h-full flex max-xl:flex-col max-sm:border-none overflow-hidden">
        <div className="w-1/4 p-6 max-xl:overflow-y-auto max-h-[calc(40vh)] max-xl:w-full max-xl:order-1 max-xl:p-4 max-xl:max-h-[300px] max-xl:overflowY">
          <SettingsPanel />
        </div>

        <div className="w-3/4 p-10 pl-0 flex items-start justify-start max-xl:w-full max-xl:order-2 max-xl:px-4 max-xl:py-4">
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
      </div>
    </div>
  );
}

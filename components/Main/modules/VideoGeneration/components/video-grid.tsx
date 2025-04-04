"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Download, Play } from "lucide-react";
import MasonryGrid from "../../../components/MasonryGrid";
import { sampleVideos } from "../utlis/Data_tbr";

export default function VideoGrid() {
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, sampleVideos.length);
  }, []);

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
    const video = videoRefs.current[index];
    if (video) {
      video.currentTime = 0;
      video.play().catch((err) => console.error("Video play failed:", err));
    }
  };

  const handleMouseLeave = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
    }
    setHoveredIndex(null);
  };

  const mediaItems = sampleVideos.map((item, index) => {
    const isHovered = hoveredIndex === index;

    return (
      <div
        key={index}
        className="relative overflow-hidden rounded-lg mb-4 group"
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={() => handleMouseLeave(index)}
      >
        <div className="relative">
          <Image
            src={item.thumbnailUrl}
            alt={item.title || `Generated video ${index + 1}`}
            width={800}
            height={800}
            className={`w-full h-auto rounded-lg transition-transform duration-300 group-hover:scale-105 object-cover ${
              isHovered ? "opacity-0" : "opacity-100"
            }`}
          />
          <div
            className={`absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 ${
              isHovered ? "" : "opacity-100"
            }`}
          >
            <div className="border-4 border-white rounded-full p-2 flex items-center opacity-50">
              <Play className="w-8 h-8 text-white " />
            </div>
          </div>
        </div>

        <video
          ref={(el) => (videoRefs.current[index] = el)}
          src={item.videoUrl}
          className={`absolute inset-0 w-full h-full rounded-lg object-cover transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          playsInline
          muted
          loop
          controls={false}
        />

        <div
          className={`absolute left-0 right-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-between gap-4 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <h3 className="text-white font-medium truncate">{item.title}</h3>
          <button className="text-white hover:text-green-400 transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  });

  return (
    <MasonryGrid loading={loading} loadingMessage="Loading amazing videos...">
      {mediaItems}
    </MasonryGrid>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Loader2, Play, X } from "lucide-react";
import MasonryGrid from "../../components/MasonryGrid";

const sampleVideos = [
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    title: "Big Buck Bunny",
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    title: "Elephant Dreams",
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumbnail:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
    title: "Tears of Steel",
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    thumbnail:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg",
    title: "Sintel",
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    thumbnail:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg",
    title: "Subaru Outback On Street And Dirt",
  },
  {
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg",
    title: "For Bigger Blazes",
  },
];

export default function VideoGrid() {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState(sampleVideos);
  const [playing, setPlaying] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleVideoClick = (index: number) => {
    setPlaying(index);
  };

  const handleCloseVideo = () => {
    setPlaying(null);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const videoItems = videos.map((video, index) => (
    <div key={index} className="relative overflow-hidden rounded-lg group">
      <div
        className="relative aspect-video"
        onClick={() => handleVideoClick(index)}
      >
        <Image
          src={video.thumbnail}
          alt={`Video thumbnail ${index + 1}`}
          width={800}
          height={450}
          className="w-full h-auto object-cover rounded-lg transition-transform group-hover:scale-105"
          priority={index < 4}
        />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg cursor-pointer">
          <div className="bg-black/60 rounded-full p-3">
            <Play className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <>
      <MasonryGrid loading={loading} loadingMessage="Loading amazing videos...">
        {videoItems}
      </MasonryGrid>

      {playing !== null && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={handleCloseVideo}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>

            <video
              ref={videoRef}
              src={videos[playing].url}
              className="w-full rounded-lg"
              controls
              autoPlay
            />
          </div>
        </div>
      )}
    </>
  );
}

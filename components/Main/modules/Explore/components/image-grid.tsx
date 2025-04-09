"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import MasonryGrid from "../../../components/MasonryGrid";
import { sampleImages } from "../utlis/Data_tbr";

export default function ImageGrid() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const mediaItems = sampleImages.map((item, index) => {
    const slug = `image-${index + 1}`;
    return (
      <Link href={`/explore/${slug}`} key={index}>
        <div className="relative overflow-hidden rounded-lg mb-2 group cursor-pointer">
          <Image
            src={item.url}
            alt={`Generated image ${index + 1}`}
            width={800}
            height={800}
            className="w-full h-auto rounded-lg transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-opacity flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100">
            <h3 className="text-white font-bold text-lg">{item.title}</h3>
            <p className="text-white text-sm mb-1">{item.description}</p>
            <p className="text-gray-300 text-xs italic">
              Prompt: {item.prompt}
            </p>
          </div>
        </div>
      </Link>
    );
  });

  return (
    <MasonryGrid loading={loading} loadingMessage="Loading amazing images...">
      {mediaItems}
    </MasonryGrid>
  );
}

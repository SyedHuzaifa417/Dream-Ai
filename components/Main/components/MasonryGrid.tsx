"use client";

import { ReactNode } from "react";
import Masonry from "react-masonry-css";
import { Loader2 } from "lucide-react";

export type MasonryBreakpoints = {
  default: number;
  [width: number]: number;
};

interface MasonryGridProps {
  children: ReactNode;
  loading?: boolean;
  loadingMessage?: string;
  breakpointCols?: MasonryBreakpoints;
  className?: string;
}

export default function MasonryGrid({
  children,
  loading = false,
  loadingMessage = "Loading...",
  breakpointCols = {
    default: 4,
    1200: 3,
    900: 2,
    750: 2,
  },
  className = "",
}: MasonryGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-white" size={24} />
        <span className="ml-2 text-white">{loadingMessage}</span>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <Masonry
        breakpointCols={breakpointCols}
        className="mx-2 w-auto flex bg-clip-padding space-x-3 max-sm:space-x-2"
      >
        {children}
      </Masonry>
    </div>
  );
}

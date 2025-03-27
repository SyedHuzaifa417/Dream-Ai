"use client";

import { Input } from "@/components/ui/input";
import ImageGrid from "@/components/image-grid";
import { TbPhoto } from "react-icons/tb";

export default function Home() {
  return (
    <div className="p-3 h-screen">
      <div className="rounded-[20px] p-6 h-full border border-royalIndigo">
        <div className="relative mb-6">
          <Input
            placeholder="Type a prompt here - Example: fantasy world, amazing day view, by going home from school, anime, cinematic shot third person view..."
            className="w-full pl-4 pr-12 py-6 rounded-xl border-[#e5e7eb] bg-white text-gray-700"
          />
          <button className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent hover:bg-transparent">
            <TbPhoto className="size-5" />
          </button>
        </div>
        <ImageGrid />
      </div>
    </div>
  );
}

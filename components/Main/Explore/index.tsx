"use client";

import { Input } from "@/components/ui/input";
import ImageGrid from "@/components/Main/Explore/components/image-grid";
import { TbPhoto } from "react-icons/tb";

export default function ExplorePage() {
  return (
    <div className="p-3 h-screen max-sm:mt-14 max-sm:h-[calc(100vh-56px)] max-sm:p-0">
      <div className="rounded-[20px] border border-white h-full flex flex-col max-sm:border-none">
        <div className="py-4 px-2 max-sm:p-3">
          <div className="relative">
            <Input
              placeholder="Type a prompt here - Example: fantasy world, amazing day view, by going home from school, anime, cinematic shot third person view."
              className="w-full pl-4 pr-12 py-8 max-sm:py-6 rounded-xl border-[#e5e7eb] bg-white text-gray-700 text-base"
            />
            <button className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-gray-800 hover:text-gray-600 bg-transparent hover:bg-transparent">
              <TbPhoto className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflowY mb-3 ">
          <ImageGrid />
        </div>
      </div>
    </div>
  );
}

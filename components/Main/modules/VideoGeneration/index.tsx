"use client";

import { Input } from "@/components/ui/input";
import VideoGrid from "@/components/Main/modules/VideoGeneration/components/video-grid";
import { TbVideo } from "react-icons/tb";

export default function VideoPage() {
  return (
    <div className="p-3 h-screen  max-sm:mt-14 max-sm:h-[calc(100vh-56px)] max-sm:p-0">
      <div className="rounded-[20px] border border-white h-full flex flex-col max-sm:border-none">
        <div className="py-4 px-2 max-sm:p-3">
          <div className="relative">
            <Input
              placeholder="Type a prompt here - Example: waterfall, nature video, cinematic landscape, timelapse video..."
              className="w-full pl-4 pr-12 py-8 max-sm:py-6 rounded-xl border-[#e5e7eb] bg-white text-gray-700"
            />
            <button className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-gray-800 hover:text-gray-600 bg-transparent hover:bg-transparent">
              <TbVideo className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflowY mb-3 ">
          <VideoGrid />
        </div>
      </div>
    </div>
  );
}

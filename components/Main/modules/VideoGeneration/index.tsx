"use client";

import { Input } from "@/components/ui/input";
import VideoGrid from "@/components/Main/modules/VideoGeneration/components/video-grid";
import { TbVideo } from "react-icons/tb";
import SettingsPanel from "../../components/settings-panel";
import { MediaPageClient } from "../../components/MediaPageClient";
import { useState, useCallback } from "react";
import { useAuth } from "@/app/services/auth";

export default function VideoPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [settings, setSettings] = useState({
    style: "",
    aspectRatio: "Square",
    autoTitle: false,
    autoDescription: false,
    guidanceScale: 50,
    inferenceSteps: 30,
    excludeText: "",
  });
  const { user,isAuthenticated } = useAuth();
  // Update settings from the settings panel
  const updateSettings = useCallback((newSettings: any) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
  };

  const handleBack = () => {
    setIsGenerating(false);
  };

  console.log("user", isAuthenticated);
  console.info(user);

  return (
    <div className="p-3 h-screen max-sm:mt-14 max-sm:h-[calc(100vh-56px)] max-sm:p-0">
      <div className="rounded-[20px] border border-white h-full flex flex-col max-sm:border-none">
        <div className="py-4 px-2 max-sm:p-3 sticky top-0 z-10">
          <div className="relative">
            <Input
              placeholder="Type a prompt here - Example: waterfall, nature video, cinematic landscape, timelapse video..."
              className="w-full pl-4 pr-12 py-8 max-sm:py-6 rounded-xl border-[#e5e7eb] bg-white text-gray-700"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-gray-800 bg-transparent ">
              <TbVideo className="w-6 h-6" />
            </span>
          </div>
        </div>

        <div className="flex-1 flex items-start justify-between overflow-y-auto overflowY max-lg:flex-col max-lg:px-1">
          <div className="w-1/6 max-xl:w-1/4 max-lg:w-full max-lg:order-1">
            <SettingsPanel
              type="video"
              onGenerate={handleGenerate}
              isPromptValid={prompt.trim() !== ""}
              onSettingsChange={updateSettings}
            />
          </div>
          <div className="flex mb-3 w-5/6 max-xl:w-3/4 pt-2 max-lg:w-full max-lg:order-2 items-center justify-center">
            {isGenerating ? (
              <MediaPageClient
                type="video"
                onBack={handleBack}
                prompt={prompt}
                settings={settings}
              />
            ) : (
              <VideoGrid />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import ImageGrid from "@/components/Main/modules/ImageGeneration/components/image-grid";
import { TbPhoto } from "react-icons/tb";
import SettingsPanel from "../../components/settings-panel";
import { MediaPageClient } from "@/components/Main/components/MediaPageClient";
import { X } from "lucide-react";

export default function ImagesGenerationPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
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

const fileInputRef = useRef<HTMLInputElement>(null);

  const updateSettings = useCallback((newSettings: any) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
  }, []);

  const handleGenerate = () => {
    setIsGenerating(true);
    setHasGenerated(true);
  };

  const handleBack = () => {
    setIsGenerating(false);
    setHasGenerated(false);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrompt(value);
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-3 h-screen max-sm:mt-14 max-sm:h-[calc(100vh-56px)] max-sm:p-0">
      <div className="rounded-[20px] border border-white h-full flex flex-col max-sm:border-none">
        <div className="py-4 px-2 max-sm:p-3 sticky top-0 z-10">
          <div className="relative">
            <Input
              placeholder="Type a prompt here - Example: fantasy world, amazing day view, by going home from school, anime, cinematic shot third person view."
              className="w-full pl-4 pr-12 py-8 max-sm:py-6 rounded-xl border-[#e5e7eb] bg-white text-gray-700 text-base"
              value={prompt}
              onChange={handlePromptChange}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
               {!uploadedImage && (
              <span 
                className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-gray-800 bg-transparent cursor-pointer hover:text-gray-600"
                onClick={handleImageClick}
              >
                <TbPhoto className="w-6 h-6" />
              </span>
            )}
            {uploadedImage && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="relative w-10 h-10">
                  <div className="w-10 h-10 rounded-md overflow-hidden">
                    <Image 
                      src={URL.createObjectURL(uploadedImage)} 
                      alt="Uploaded image" 
                      className="object-cover w-10 h-10"
                      width={40}
                      height={40}
                    />
                  </div>
                  <button
                    onClick={clearUploadedImage}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 z-10 shadow-md"
                  >
                    <X className="w-3.5 h-3.5 text-gray-900" />
                  </button>
                </div>
              </div>
            )}
        
          </div>
        </div>

        <div className="flex-1 flex items-start justify-between overflow-y-auto overflowY max-lg:flex-col max-lg:px-1">
          <div className="w-1/6 max-xl:w-1/4 max-lg:w-full max-lg:order-1">
            <SettingsPanel
              type="image"
              onGenerate={handleGenerate}
              isPromptValid={prompt.trim() !== "" || uploadedImage !== null}
              onSettingsChange={updateSettings}
              hasGenerated={hasGenerated}
            />
          </div>

          <div className="flex mb-3 w-5/6 max-xl:w-3/4 pt-2 max-lg:w-full max-lg:order-2 items-center justify-center">
            {isGenerating ? (
              <MediaPageClient
                type="image"
                prompt={prompt}
                uploadedImage={uploadedImage}
                onBack={handleBack}
                settings={settings}
              />
            ) : (
              <ImageGrid />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

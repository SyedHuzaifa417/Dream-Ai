"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LuRectangleHorizontal, LuRectangleVertical } from "react-icons/lu";
import { TbRectangle, TbRectangleVertical } from "react-icons/tb";
import { FaRegSquare } from "react-icons/fa";
import { BsInfo } from "react-icons/bs";
import { toast } from "sonner";

export default function SettingsPanel({
  type = "image",
  onGenerate,
  isPromptValid = true,
  onSettingsChange,
}: {
  type?: string;
  onGenerate?: () => void;
  isPromptValid?: boolean;
  onSettingsChange?: (settings: any) => void;
}) {
  const [autoTitle, setAutoTitle] = useState(false);
  const [autoDescription, setAutoDescription] = useState(false);
  const [guidanceScale, setGuidanceScale] = useState(50);
  const [inferenceSteps, setInferenceSteps] = useState(30);
  const [excludeText, setExcludeText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("Square");
  const [openItem, setOpenItem] = useState();

  const styles = ["Photo", "Anime", "Graphic", "3D", "Cyberpunk", "Watercolor"];

  const aspectRatios = [
    { option: "Square", icon: <FaRegSquare /> },
    { option: "Potrait", icon: <TbRectangleVertical /> },
    { option: "Landscape", icon: <TbRectangle /> },
    { option: "Wide", icon: <LuRectangleHorizontal /> },
    { option: "Tall", icon: <LuRectangleVertical /> },
  ];

  useEffect(() => {
    const currentSettings = {
      style: selectedStyle,
      aspectRatio: selectedAspectRatio,
      autoTitle,
      autoDescription,
      guidanceScale,
      inferenceSteps,
      excludeText,
    };

    if (onSettingsChange) {
      onSettingsChange(currentSettings);
    }
  }, [
    selectedStyle,
    selectedAspectRatio,
    autoTitle,
    autoDescription,
    guidanceScale,
    inferenceSteps,
    excludeText,
    onSettingsChange,
  ]);

  const handleAccordionChange = (value: any) => {
    setOpenItem(value === openItem ? null : value);
  };

  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style);
  };

  const handleAspectRatioSelect = (ratio: string) => {
    setSelectedAspectRatio(ratio);
  };

  const handleAutoTitleChange = (checked: boolean) => {
    setAutoTitle(checked);
  };

  const handleAutoDescriptionChange = (checked: boolean) => {
    setAutoDescription(checked);
  };

  const handleGuidanceScaleChange = (value: number[]) => {
    setGuidanceScale(value[0]);
  };

  const handleInferenceStepsChange = (value: number[]) => {
    setInferenceSteps(value[0]);
  };

  const handleExcludeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExcludeText(e.target.value);
  };

  const handleGenerate = () => {
    if (!isPromptValid) {
      toast.error("Please enter a prompt first", {
        position: "bottom-right",
        duration: 3000,
      });
      return;
    }

    console.log("Generation settings:", {
      type,
      style: selectedStyle,
      aspectRatio: selectedAspectRatio,
      autoTitle,
      autoDescription,
      guidanceScale,
      inferenceSteps,
      excludeText,
    });

    if (onGenerate) {
      onGenerate();
    }
  };

  return (
    <div className="text-white p-2 w-full  space-y-4">
      <Accordion
        type="single"
        collapsible
        className="w-full bg-white rounded-lg text-black"
        value={openItem}
        onValueChange={handleAccordionChange}
      >
        <AccordionItem value="style" className="border-b-0">
          <div className="px-3">
            <AccordionTrigger className="py-3 hover:no-underline text-lg font-semibold w-full">
              <span>Choose a Style</span>
            </AccordionTrigger>
          </div>
          <AccordionContent className="pb-1">
            <div className="flex flex-col items-start justify-start">
              {styles.map((style) => (
                <button
                  key={style}
                  onClick={() => handleStyleSelect(style)}
                  className={`p-3 text-base font-semibold w-full text-start border-t border-black ${
                    selectedStyle === style
                      ? "bg-indigo-650 text-white"
                      : "text-gray-900 hover:bg-indigo-650 hover:text-white"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="space-y-1">
        <div className="flex items-center">
          <Label className="text-sm mr-2">Exclude</Label>
          <span className="h-4 w-4 rounded-full flex items-center justify-center text-black bg-white ">
            <BsInfo />
          </span>
        </div>
        <Input
          className="bg-white py-6 text-gray-900 border-gray-700 rounded-md w-full text-sm"
          placeholder="example: adult people"
          value={excludeText}
          onChange={handleExcludeChange}
        />
      </div>

      <Accordion
        type="single"
        collapsible
        className="w-full bg-white rounded-lg text-black"
        value={openItem}
        onValueChange={handleAccordionChange}
      >
        <AccordionItem value="aspect-ratio" className="border-b-0">
          <div className="px-3">
            <AccordionTrigger className="py-3 hover:no-underline text-lg font-semibold w-full ">
              <span>Aspect Ratio</span>
            </AccordionTrigger>
          </div>
          <AccordionContent className="pb-1">
            <div className="flex flex-col items-start justify-start">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.option}
                  onClick={() => handleAspectRatioSelect(ratio.option)}
                  className={`p-3 text-base font-semibold w-full border-t border-black flex items-center justify-between ${
                    selectedAspectRatio === ratio.option
                      ? "bg-indigo-650 text-white"
                      : "text-gray-900 hover:bg-indigo-650 hover:text-white"
                  }`}
                >
                  <span>{ratio.option}</span>
                  <span>{ratio.icon}</span>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex items-center justify-between">
        <Label htmlFor="auto-title" className="text-sm">
          Auto Title
        </Label>
        <Switch
          id="auto-title"
          checked={autoTitle}
          onCheckedChange={handleAutoTitleChange}
          className="data-[state=checked]:bg-indigo-650 data-[state=unchecked]:bg-white border border-white data-[state=checked]:border-none data-[state=unchecked]:[&>span]:bg-indigo-650"
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="auto-description" className="text-sm">
          Auto Description
        </Label>
        <Switch
          id="auto-description"
          checked={autoDescription}
          onCheckedChange={handleAutoDescriptionChange}
          className="data-[state=checked]:bg-indigo-650 data-[state=unchecked]:bg-white border border-white data-[state=checked]:border-none data-[state=unchecked]:[&>span]:bg-indigo-650"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Guidance Scale</Label>
        <Slider
          value={[guidanceScale]}
          onValueChange={handleGuidanceScaleChange}
          max={100}
          step={1}
          className="py-2 [&_[data-state=active]]:bg-indigo-600  [&>span>span]:bg-indigo-650 [&>span>button]:border-indigo-650 [&>span>button]:bg-white"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm">Num Inference Steps</Label>
        <Slider
          value={[inferenceSteps]}
          onValueChange={handleInferenceStepsChange}
          max={100}
          step={1}
          className="py-2 [&_[data-state=active]]:bg-indigo-600  [&>span>span]:bg-indigo-650 [&>span>button]:border-indigo-650 [&>span>button]:bg-white"
        />
      </div>

      <Button
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm uppercase font-medium"
        onClick={handleGenerate}
        // disabled={!isPromptValid}
      >
        Generate
      </Button>
    </div>
  );
}

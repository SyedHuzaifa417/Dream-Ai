"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function SettingsPanel() {
  const [autoTitle, setAutoTitle] = useState(true);
  const [autoDescription, setAutoDescription] = useState(true);
  const [guidanceScale, setGuidanceScale] = useState(50);
  const [inferenceSteps, setInferenceSteps] = useState(30);
  const [excludeText, setExcludeText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedAspectRatio, setSelectedAspectRatio] = useState("");
  const [openItem, setOpenItem] = useState();

  const styles = [
    "Realistic",
    "Anime",
    "Cartoon",
    "Watercolor",
    "Oil Painting",
    "Sketch",
  ];

  const aspectRatios = [
    "1:1 (Square)",
    "4:3 (Standard)",
    "16:9 (Widescreen)",
    "9:16 (Portrait)",
    "3:2 (Classic)",
    "2:3 (Portrait Classic)",
  ];

  const handleAccordionChange = (value: any) => {
    setOpenItem(value === openItem ? null : value);
  };

  return (
    <div className="text-white p-4 w-full  space-y-4">
      <Accordion
        type="single"
        collapsible
        className="w-full bg-white rounded-lg text-black"
        value={openItem}
        onValueChange={handleAccordionChange}
      >
        <AccordionItem value="style" className="border-b-0">
          <div className="px-3">
            <AccordionTrigger className="py-3 hover:no-underline text-base font-semibold w-full">
              <span>Choose a Style</span>
            </AccordionTrigger>
          </div>
          <AccordionContent className="pb-1">
            <div className="flex flex-col items-start justify-start">
              {styles.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
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
          <Label className="text-sm">Exclude</Label>
          <span className="h-4 w-4 rounded-full bg-indigo-600 ml-2"></span>
        </div>
        <Input
          className="bg-white py-6 text-gray-900 border-gray-700 rounded-md w-full text-sm"
          placeholder="example: adult people"
          value={excludeText}
          onChange={(e) => setExcludeText(e.target.value)}
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
            <AccordionTrigger className="py-3 hover:no-underline text-base font-semibold w-full ">
              <span>Aspect Ratio</span>
            </AccordionTrigger>
          </div>
          <AccordionContent className="pb-1">
            <div className="flex flex-col items-start justify-start">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setSelectedAspectRatio(ratio)}
                  className={`p-3 text-base font-semibold w-full text-start border-t border-black ${
                    selectedAspectRatio === ratio
                      ? "bg-indigo-650 text-white"
                      : "text-gray-900 hover:bg-indigo-650 hover:text-white"
                  }`}
                >
                  {ratio}
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
          onCheckedChange={setAutoTitle}
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
          onCheckedChange={setAutoDescription}
          className="data-[state=checked]:bg-indigo-650 data-[state=unchecked]:bg-white border border-white data-[state=checked]:border-none data-[state=unchecked]:[&>span]:bg-indigo-650"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Guidance Scale</Label>
        <Slider
          value={[guidanceScale]}
          onValueChange={(value) => setGuidanceScale(value[0])}
          max={100}
          step={1}
          className="py-2 [&_[data-state=active]]:bg-indigo-600  [&>span>span]:bg-indigo-650 [&>span>button]:border-indigo-650 [&>span>button]:bg-white"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm">Num Inference Steps</Label>
        <Slider
          value={[inferenceSteps]}
          onValueChange={(value) => setInferenceSteps(value[0])}
          max={100}
          step={1}
          className="py-2 [&_[data-state=active]]:bg-indigo-600  [&>span>span]:bg-indigo-650 [&>span>button]:border-indigo-650 [&>span>button]:bg-white"
        />
      </div>

      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm uppercase font-medium">
        Generate
      </Button>
    </div>
  );
}

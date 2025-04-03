"use client";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export default function SettingsPanel() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Image Quality</Label>
        <Slider
          defaultValue={[75]}
          max={100}
          step={1}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Style Strength</Label>
        <Slider
          defaultValue={[50]}
          max={100}
          step={1}
        />
      </div>
      
      <div className="space-y-2">
        <Label>Creativity Level</Label>
        <Slider
          defaultValue={[65]}
          max={100}
          step={1}
        />
      </div>
    </div>
  );
}
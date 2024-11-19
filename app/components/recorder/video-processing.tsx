"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { VideoProcessingOptions } from "./types";
import {
  FastForward,
  Transition,
  Scissors,
  Wand2,
  Layers
} from "lucide-react";

interface VideoProcessingProps {
  options: VideoProcessingOptions;
  onChange: (options: VideoProcessingOptions) => void;
}

export const VideoProcessing = ({ options, onChange }: VideoProcessingProps) => {
  const [showEffectsPanel, setShowEffectsPanel] = useState(false);

  const handleSpeedChange = (value: number[]) => {
    onChange({ ...options, speed: value[0] });
  };

  const handleTransitionChange = (type: "fade" | "slide" | "zoom") => {
    onChange({
      ...options,
      transition: { type, duration: options.transition?.duration || 500 }
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <FastForward className="w-4 h-4" />
            Playback Speed
          </Label>
          <Slider
            value={[options.speed || 1]}
            onValueChange={handleSpeedChange}
            min={0.25}
            max={2}
            step={0.25}
          />
          <div className="text-sm text-muted-foreground text-center">
            {options.speed || 1}x
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Transition className="w-4 h-4" />
            Transitions
          </Label>
          <div className="grid grid-cols-3 gap-2">
            {["fade", "slide", "zoom"].map((type) => (
              <Button
                key={type}
                variant={
                  options.transition?.type === type ? "default" : "outline"
                }
                onClick={() => handleTransitionChange(type as any)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Scissors className="w-4 h-4" />
              Auto Cut Silence
            </Label>
            <Switch
              checked={options.motionDetection}
              onCheckedChange={(checked) =>
                onChange({ ...options, motionDetection: checked })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              Apply Effects
            </Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEffectsPanel(!showEffectsPanel)}
            >
              {showEffectsPanel ? "Hide Effects" : "Show Effects"}
            </Button>
          </div>

          {showEffectsPanel && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                variant="outline"
                onClick={() =>
                  onChange({
                    ...options,
                    effects: [...(options.effects || []), "slowmo"]
                  })
                }
              >
                Slow Motion
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  onChange({
                    ...options,
                    effects: [...(options.effects || []), "timelapse"]
                  })
                }
              >
                Timelapse
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Region Selection
            </Label>
            <Switch
              checked={options.region?.enabled}
              onCheckedChange={(checked) =>
                onChange({
                  ...options,
                  region: {
                    enabled: checked,
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100
                  }
                })
              }
            />
          </div>

          {options.region?.enabled && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Width (%)</Label>
                <Slider
                  value={[options.region.width]}
                  onValueChange={([width]) =>
                    onChange({
                      ...options,
                      region: { ...options.region, width }
                    })
                  }
                  min={10}
                  max={100}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <Label>Height (%)</Label>
                <Slider
                  value={[options.region.height]}
                  onValueChange={([height]) =>
                    onChange({
                      ...options,
                      region: { ...options.region, height }
                    })
                  }
                  min={10}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
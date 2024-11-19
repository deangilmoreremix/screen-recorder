"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { VideoEffect, VideoFormat, LayoutTemplate } from "./types";
import { ColorPicker } from "./color-picker";
import { 
  Layout, 
  Layers, 
  Monitor, 
  Camera, 
  Grid2x2,
  SplitSquareVertical,
  LayoutPanelTop,
  Palette,
  Wand2
} from "lucide-react";
import { useState } from "react";

interface VideoEffectsProps {
  onEffectChange: (effect: VideoEffect) => void;
  onLayoutChange: (layout: LayoutTemplate) => void;
  onFormatChange: (format: VideoFormat) => void;
  onChromaKeyChange: (settings: { color: string; similarity: number; smoothness: number }) => void;
}

export const VideoEffects = ({
  onEffectChange,
  onLayoutChange,
  onFormatChange,
  onChromaKeyChange
}: VideoEffectsProps) => {
  const [activeTab, setActiveTab] = useState("layout");
  const [selectedEffect, setSelectedEffect] = useState<VideoEffect>("none");
  const [selectedLayout, setSelectedLayout] = useState<LayoutTemplate>("pip");
  const [selectedFormat, setSelectedFormat] = useState<VideoFormat>("16:9");
  const [chromaSettings, setChromaSettings] = useState({
    color: "#00FF00",
    similarity: 50,
    smoothness: 30
  });

  const handleEffectChange = (effect: VideoEffect) => {
    setSelectedEffect(effect);
    onEffectChange(effect);
  };

  const handleLayoutChange = (layout: LayoutTemplate) => {
    setSelectedLayout(layout);
    onLayoutChange(layout);
  };

  const handleFormatChange = (format: VideoFormat) => {
    setSelectedFormat(format);
    if (onFormatChange) {
      onFormatChange(format);
    }
  };

  const handleChromaKeyChange = (updates: Partial<typeof chromaSettings>) => {
    const newSettings = { ...chromaSettings, ...updates };
    setChromaSettings(newSettings);
    onChromaKeyChange(newSettings);
  };

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 gap-4 mb-6">
          <TabsTrigger value="layout" className="flex items-center gap-2">
            <Layout className="w-4 h-4" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="effects" className="flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            Effects
          </TabsTrigger>
          <TabsTrigger value="format" className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Format
          </TabsTrigger>
          <TabsTrigger value="chroma" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Chroma Key
          </TabsTrigger>
        </TabsList>

        <TabsContent value="layout" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant={selectedLayout === "pip" ? "default" : "outline"}
              onClick={() => handleLayoutChange("pip")}
              className="flex flex-col gap-2 h-auto p-4"
            >
              <Camera className="w-5 h-5" />
              <span>Picture in Picture</span>
            </Button>
            <Button
              variant={selectedLayout === "side-by-side" ? "default" : "outline"}
              onClick={() => handleLayoutChange("side-by-side")}
              className="flex flex-col gap-2 h-auto p-4"
            >
              <SplitSquareVertical className="w-5 h-5" />
              <span>Side by Side</span>
            </Button>
            <Button
              variant={selectedLayout === "stacked" ? "default" : "outline"}
              onClick={() => handleLayoutChange("stacked")}
              className="flex flex-col gap-2 h-auto p-4"
            >
              <LayoutPanelTop className="w-5 h-5" />
              <span>Stacked</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="effects" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {["none", "blur", "grayscale", "sepia", "vintage"].map((effect) => (
              <Button
                key={effect}
                variant={selectedEffect === effect ? "default" : "outline"}
                onClick={() => handleEffectChange(effect as VideoEffect)}
                className="capitalize"
              >
                {effect}
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="format" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["16:9", "1:1", "9:16", "4:3"].map((format) => (
              <Button
                key={format}
                variant={selectedFormat === format ? "default" : "outline"}
                onClick={() => handleFormatChange(format as VideoFormat)}
                className="flex flex-col gap-2 h-auto p-4"
              >
                <Grid2x2 className="w-5 h-5" />
                <span>{format}</span>
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chroma" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Key Color</Label>
              <ColorPicker
                color={chromaSettings.color}
                onChange={(color) => handleChromaKeyChange({ color })}
              />
            </div>

            <div className="space-y-2">
              <Label>Similarity ({chromaSettings.similarity}%)</Label>
              <Slider
                value={[chromaSettings.similarity]}
                onValueChange={([similarity]) => handleChromaKeyChange({ similarity })}
                min={0}
                max={100}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Smoothness ({chromaSettings.smoothness}%)</Label>
              <Slider
                value={[chromaSettings.smoothness]}
                onValueChange={([smoothness]) => handleChromaKeyChange({ smoothness })}
                min={0}
                max={100}
                step={1}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
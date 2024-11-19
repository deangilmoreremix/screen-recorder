"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VideoEffects } from "../video-effects";
import { OverlayTemplates } from "../video-processing/overlay-templates";
import { VideoProcessing } from "../video-processing";
import { useState } from "react";

export const VideoFeatures = () => {
  const [videoEffect, setVideoEffect] = useState("none");
  const [layout, setLayout] = useState("pip");
  const [format, setFormat] = useState("16:9");
  const [chromaKey, setChromaKey] = useState({
    enabled: false,
    color: "#00FF00",
    similarity: 0.4,
    smoothness: 0.1
  });

  return (
    <Tabs defaultValue="effects">
      <TabsList className="grid grid-cols-4 gap-4 mb-4">
        <TabsTrigger value="effects">Effects</TabsTrigger>
        <TabsTrigger value="overlays">Overlays</TabsTrigger>
        <TabsTrigger value="layout">Layout</TabsTrigger>
        <TabsTrigger value="processing">Processing</TabsTrigger>
      </TabsList>

      <TabsContent value="effects">
        <VideoEffects
          onEffectChange={setVideoEffect}
          onLayoutChange={setLayout}
          onFormatChange={setFormat}
          onChromaKeyChange={setChromaKey}
        />
      </TabsContent>

      <TabsContent value="overlays">
        <OverlayTemplates />
      </TabsContent>

      <TabsContent value="layout">
        <Card className="p-6">
          {/* Layout controls will be implemented here */}
        </Card>
      </TabsContent>

      <TabsContent value="processing">
        <VideoProcessing
          onProcessingChange={(settings) => {
            console.log('Processing settings updated:', settings);
          }}
        />
      </TabsContent>
    </Tabs>
  );
};
"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AudioVisualization } from "../audio-visualization";
import { AudioDucking } from "../audio-processing/audio-ducking";
import { AudioMixing } from "../audio-mixing";
import { VoiceFilters } from "../audio-processing/voice-filters";
import { useState } from "react";

export const AudioFeatures = () => {
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  return (
    <Tabs defaultValue="visualization">
      <TabsList className="grid grid-cols-4 gap-4 mb-4">
        <TabsTrigger value="visualization">Waveform</TabsTrigger>
        <TabsTrigger value="ducking">Ducking</TabsTrigger>
        <TabsTrigger value="mixing">Mixing</TabsTrigger>
        <TabsTrigger value="filters">Filters</TabsTrigger>
      </TabsList>

      <TabsContent value="visualization">
        {audioStream && <AudioVisualization stream={audioStream} />}
      </TabsContent>

      <TabsContent value="ducking">
        <AudioDucking />
      </TabsContent>

      <TabsContent value="mixing">
        <AudioMixing />
      </TabsContent>

      <TabsContent value="filters">
        <VoiceFilters />
      </TabsContent>
    </Tabs>
  );
};
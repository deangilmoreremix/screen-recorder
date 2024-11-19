"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MotionDetector } from "../smart-recording/motion-detector";
import { VoiceActivator } from "../smart-recording/voice-activator";
import { FaceTracking } from "../smart-recording/face-tracking";
import { AutoHighlight } from "../smart-recording/auto-highlight";
import { useState } from "react";

export const SmartFeatures = () => {
  const [motionConfig, setMotionConfig] = useState({
    enabled: false,
    sensitivity: 0.5,
    threshold: 0.3,
    zones: []
  });

  const [voiceConfig, setVoiceConfig] = useState({
    enabled: false,
    threshold: -40,
    delay: 1,
    minDuration: 2
  });

  const [faceConfig, setFaceConfig] = useState({
    enabled: false,
    tracking: true,
    blur: false,
    replacement: false,
    backgroundImage: null as string | null
  });

  return (
    <Tabs defaultValue="motion">
      <TabsList className="grid grid-cols-4 gap-4 mb-4">
        <TabsTrigger value="motion">Motion</TabsTrigger>
        <TabsTrigger value="voice">Voice</TabsTrigger>
        <TabsTrigger value="face">Face</TabsTrigger>
        <TabsTrigger value="highlight">Highlights</TabsTrigger>
      </TabsList>

      <TabsContent value="motion">
        <MotionDetector 
          config={motionConfig}
          onChange={setMotionConfig}
        />
      </TabsContent>

      <TabsContent value="voice">
        <VoiceActivator 
          config={voiceConfig}
          onChange={setVoiceConfig}
        />
      </TabsContent>

      <TabsContent value="face">
        <FaceTracking 
          config={faceConfig}
          onChange={setFaceConfig}
        />
      </TabsContent>

      <TabsContent value="highlight">
        <AutoHighlight />
      </TabsContent>
    </Tabs>
  );
};
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useRecorder } from "./hooks/use-recorder";
import { useMultiSource } from "./hooks/use-multi-source";
import { VideoPreview } from "./video-preview";
import { PreviewCanvas } from "./preview-canvas";
import { RecordingControls } from "./recording-controls";
import { SourceList } from "./source-list";
import { RecordingOptions } from "./recording-options";
import { AudioFeatures } from "./tabs/audio-features";
import { VideoFeatures } from "./tabs/video-features";
import { SmartFeatures } from "./tabs/smart-features";
import { ExportOptions } from "./tabs/export-options";
import { RecordingType } from "./types";

export const Recorder = () => {
  const [activeTab, setActiveTab] = useState("recording");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoEffect, setVideoEffect] = useState("none");

  const { sources, addSource, removeSource, toggleSource } = useMultiSource({
    maxSources: 3
  });

  const { isRecording, isPaused, recordingType, stats, start, stop, pause, resume } = useRecorder({
    onStart: () => toast.success("Recording started"),
    onStop: (blob) => {
      setRecordedBlob(blob);
      toast.success("Recording saved successfully!");
    },
    onPause: () => toast.info("Recording paused"),
    onResume: () => toast.info("Recording resumed"),
    onError: () => toast.error("Failed to start recording")
  });

  const handleStartRecording = async (type: RecordingType) => {
    try {
      if (type === "screen") {
        await addSource("screen");
      } else if (type === "camera") {
        await addSource("camera");
      }
      await start(type, sources);
    } catch (error) {
      console.error(error);
      toast.error("Failed to start recording");
    }
  };

  const handleStopRecording = () => {
    stop();
    sources.forEach(source => removeSource(source.id));
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  return (
    <div className="space-y-4">
      <Card className="aspect-video overflow-hidden bg-black/5 dark:bg-black/20">
        {sources.length > 0 ? (
          <PreviewCanvas
            sources={sources}
            effect={videoEffect}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Select a source to start recording
          </div>
        )}
      </Card>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 gap-4 mb-4">
            <TabsTrigger value="recording">Recording</TabsTrigger>
            <TabsTrigger value="audio">Audio</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="smart">Smart</TabsTrigger>
          </TabsList>

          <TabsContent value="recording">
            <div className="space-y-4">
              <RecordingOptions
                onStartRecording={handleStartRecording}
                isRecording={isRecording}
                sourcesCount={sources.length}
              />

              {isRecording && (
                <RecordingControls
                  onStop={handleStopRecording}
                  onPause={pause}
                  onResume={resume}
                  isPaused={isPaused}
                />
              )}

              <SourceList
                sources={sources}
                onToggle={toggleSource}
                onRemove={removeSource}
              />
            </div>
          </TabsContent>

          <TabsContent value="audio">
            <AudioFeatures />
          </TabsContent>

          <TabsContent value="video">
            <VideoFeatures />
          </TabsContent>

          <TabsContent value="smart">
            <SmartFeatures />
          </TabsContent>
        </Tabs>
      </Card>

      {recordedBlob && (
        <VideoPreview
          stream={new MediaStream()}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      )}
    </div>
  );
};
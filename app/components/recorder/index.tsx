"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useRecorder } from "./use-recorder";
import { RecorderButton } from "./recorder-button";
import { RecorderStats } from "./recorder-stats";
import { RecordingType } from "./types";
import { CountdownTimer } from "./countdown-timer";
import { useMultiSource } from "./use-multi-source";
import { RecorderSources } from "./recorder-sources";

export const Recorder = () => {
  const [showCountdown, setShowCountdown] = useState(false);
  const [pendingRecordingType, setPendingRecordingType] = useState<RecordingType>(null);

  const { 
    sources, 
    addSource, 
    removeSource, 
    toggleSource 
  } = useMultiSource();

  const { 
    isRecording, 
    isPaused,
    recordingType, 
    stats,
    start, 
    stop,
    pause,
    resume
  } = useRecorder({
    onStart: () => toast.success("Recording started"),
    onStop: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `recording-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Recording saved successfully!");
    },
    onPause: () => toast.info("Recording paused"),
    onResume: () => toast.info("Recording resumed"),
    onError: () => toast.error("Failed to start recording. Please check permissions.")
  });

  const handleStartRecording = async (type: RecordingType) => {
    try {
      if (type === "screen") {
        await addSource("screen");
      } else if (type === "camera") {
        await addSource("camera");
      }
      setPendingRecordingType(type);
      setShowCountdown(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to access recording device");
    }
  };

  const handleCountdownComplete = async () => {
    setShowCountdown(false);
    try {
      await start(pendingRecordingType);
    } catch (error) {
      console.error(error);
      toast.error("Failed to start recording");
    }
  };

  const handleStopRecording = () => {
    stop();
    sources.forEach(source => removeSource(source.id));
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            {!isRecording ? (
              <>
                <RecorderButton
                  type="screen"
                  onClick={() => handleStartRecording("screen")}
                  isRecording={false}
                />
                <RecorderButton
                  type="camera"
                  onClick={() => handleStartRecording("camera")}
                  isRecording={false}
                />
              </>
            ) : (
              <RecorderButton
                type={recordingType}
                onClick={handleStopRecording}
                onPause={pause}
                onResume={resume}
                isRecording={true}
                isPaused={isPaused}
              />
            )}
          </div>

          {isRecording && stats && <RecorderStats stats={stats} />}
        </div>
      </Card>

      {sources.length > 0 && (
        <RecorderSources
          sources={sources}
          onToggle={toggleSource}
          onRemove={removeSource}
        />
      )}

      {showCountdown && (
        <CountdownTimer
          duration={5}
          onComplete={handleCountdownComplete}
          onCancel={() => {
            setShowCountdown(false);
            sources.forEach(source => removeSource(source.id));
          }}
        />
      )}
    </div>
  );
};
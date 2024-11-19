"use client";

import { useCallback, useRef, useState } from "react";
import { Camera, Mic, StopCircle, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type RecordingType = "screen" | "camera" | null;

export const Recorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<RecordingType>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleDataAvailable = useCallback((event: BlobEvent) => {
    if (event.data.size > 0) {
      chunksRef.current.push(event.data);
    }
  }, []);

  const saveRecording = useCallback(() => {
    const blob = new Blob(chunksRef.current, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recording-${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
    chunksRef.current = [];
    toast.success("Recording saved successfully!");
  }, []);

  const startRecording = async (type: RecordingType) => {
    try {
      let stream: MediaStream;
      
      if (type === "screen") {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
      } else {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm"
      });

      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.onstop = saveRecording;

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingType(type);
      toast.success(`${type === "screen" ? "Screen" : "Camera"} recording started`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to start recording. Please check permissions.");
    }
  };

  const stopRecording = () => {
    try {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        setRecordingType(null);
        toast.info("Processing recording...");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to stop recording");
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Screen & Camera Recorder</h2>
          <p className="text-muted-foreground">
            Record your screen or camera with audio
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {!isRecording ? (
            <>
              <Button
                className="flex items-center gap-2"
                onClick={() => startRecording("screen")}
                size="lg"
              >
                <Video className="w-5 h-5" />
                Record Screen
              </Button>
              <Button
                className="flex items-center gap-2"
                onClick={() => startRecording("camera")}
                size="lg"
              >
                <Camera className="w-5 h-5" />
                Record Camera
              </Button>
            </>
          ) : (
            <Button
              variant="destructive"
              className="flex items-center gap-2"
              onClick={stopRecording}
              size="lg"
            >
              <StopCircle className="w-5 h-5" />
              Stop Recording
            </Button>
          )}
        </div>

        {isRecording && (
          <div className="flex items-center justify-center gap-2 text-red-500">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            Recording in progress
          </div>
        )}

        <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
          <Mic className="w-4 h-4" />
          Audio is automatically recorded
        </div>
      </div>
    </Card>
  );
};
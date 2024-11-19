"use client";

import { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { User, Focus } from 'lucide-react';

interface FaceTrackingProps {
  videoStream: MediaStream;
  onFrameUpdate: (frame: { x: number; y: number; width: number; height: number }) => void;
}

export const FaceTracking = ({ videoStream, onFrameUpdate }: FaceTrackingProps) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [smoothing, setSmoothing] = useState(0.3);
  const [padding, setPadding] = useState(0.2);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isEnabled || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    video.srcObject = videoStream;
    video.play();

    let frameId: number;
    let previousFrame: any = null;

    const detectFaces = async () => {
      if (!video || !canvasRef.current) return;

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(video, 0, 0);
      
      // Simulate face detection with a fixed region
      const frame = {
        x: video.videoWidth * 0.25,
        y: video.videoHeight * 0.25,
        width: video.videoWidth * 0.5,
        height: video.videoHeight * 0.5
      };

      if (previousFrame) {
        frame.x = frame.x * (1 - smoothing) + previousFrame.x * smoothing;
        frame.y = frame.y * (1 - smoothing) + previousFrame.y * smoothing;
        frame.width = frame.width * (1 - smoothing) + previousFrame.width * smoothing;
        frame.height = frame.height * (1 - smoothing) + previousFrame.height * smoothing;
      }

      onFrameUpdate(frame);
      previousFrame = frame;

      frameId = requestAnimationFrame(detectFaces);
    };

    detectFaces();

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isEnabled, videoStream, onFrameUpdate, smoothing, padding]);

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Face Tracking
          </Label>
          <Switch
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
          />
        </div>

        {isEnabled && (
          <>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Focus className="w-4 h-4" />
                Smoothing ({Math.round(smoothing * 100)}%)
              </Label>
              <Slider
                value={[smoothing * 100]}
                onValueChange={([value]) => setSmoothing(value / 100)}
                max={100}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Frame Padding ({Math.round(padding * 100)}%)</Label>
              <Slider
                value={[padding * 100]}
                onValueChange={([value]) => setPadding(value / 100)}
                max={50}
                step={1}
              />
            </div>

            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                playsInline
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0"
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
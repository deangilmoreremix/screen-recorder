"use client";

import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import { StreamSource, VideoEffect } from './types';

interface PreviewCanvasProps {
  sources: StreamSource[];
  effect: VideoEffect;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const PreviewCanvas = ({
  sources,
  effect,
  isFullscreen,
  onToggleFullscreen
}: PreviewCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 1920;
    canvas.height = 1080;

    const applyEffect = (imageData: ImageData) => {
      const { data } = imageData;
      
      switch (effect) {
        case "grayscale":
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = data[i + 1] = data[i + 2] = avg;
          }
          break;
        case "sepia":
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
            data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
            data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
          }
          break;
        case "vintage":
          for (let i = 0; i < data.length; i += 4) {
            data[i] *= 1.2;     // Increase red
            data[i + 2] *= 0.8; // Decrease blue
          }
          break;
        case "slowmo":
          // Handled by MediaRecorder options
          break;
        case "timelapse":
          // Handled by MediaRecorder options
          break;
      }
      
      return imageData;
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      sources.forEach((source, index) => {
        if (!source.active) return;

        const video = document.createElement('video');
        video.srcObject = source.stream;
        video.autoplay = true;
        video.muted = true;

        // Calculate dimensions based on source type and count
        const width = sources.length > 1 ? canvas.width / 2 : canvas.width;
        const height = sources.length > 1 ? canvas.height / 2 : canvas.height;
        const x = index % 2 === 1 ? canvas.width / 2 : 0;
        const y = index > 1 ? canvas.height / 2 : 0;

        // Draw video frame
        ctx.drawImage(video, x, y, width, height);

        // Apply effects
        if (effect !== 'none') {
          const imageData = ctx.getImageData(x, y, width, height);
          ctx.putImageData(applyEffect(imageData), x, y);
        }
      });

      animationFrameRef.current = requestAnimationFrame(drawFrame);
    };

    drawFrame();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [sources, effect]);

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
      <canvas
        id="preview-canvas"
        ref={canvasRef}
        className="w-full h-full object-contain"
      />
      <div className="absolute top-4 right-4">
        <Button
          variant="secondary"
          size="icon"
          onClick={onToggleFullscreen}
          className="bg-black/50 hover:bg-black/70 text-white"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
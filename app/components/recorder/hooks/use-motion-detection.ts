"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { MotionDetectionConfig } from '../types';

export const useMotionDetection = (config: MotionDetectionConfig) => {
  const [isMotionDetected, setIsMotionDetected] = useState(false);
  const [activeZones, setActiveZones] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>();
  const previousFrameRef = useRef<ImageData>();
  const frameCountRef = useRef(0);

  const analyzeFrame = useCallback((currentFrame: ImageData) => {
    if (!previousFrameRef.current) {
      previousFrameRef.current = currentFrame;
      return false;
    }

    const prev = previousFrameRef.current.data;
    const curr = currentFrame.data;
    let motionPixels = 0;
    
    for (let i = 0; i < curr.length; i += 4) {
      const diffR = Math.abs(curr[i] - prev[i]);
      const diffG = Math.abs(curr[i + 1] - prev[i + 1]);
      const diffB = Math.abs(curr[i + 2] - prev[i + 2]);
      
      if ((diffR + diffG + diffB) / 3 > config.threshold) {
        motionPixels++;
      }
    }

    const motionRatio = motionPixels / (currentFrame.width * currentFrame.height);
    previousFrameRef.current = currentFrame;
    
    return motionRatio > config.sensitivity;
  }, [config.sensitivity, config.threshold]);

  const detectMotion = useCallback((stream: MediaStream) => {
    if (!config.enabled) return;

    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const checkFrame = () => {
      ctx.drawImage(video, 0, 0);
      
      const activeZoneIndices: number[] = [];
      config.zones.forEach((zone, index) => {
        const zoneData = ctx.getImageData(
          zone.x,
          zone.y,
          zone.width,
          zone.height
        );
        
        if (analyzeFrame(zoneData)) {
          activeZoneIndices.push(index);
        }
      });

      setActiveZones(activeZoneIndices);
      setIsMotionDetected(activeZoneIndices.length > 0);
      
      frameCountRef.current++;
      requestAnimationFrame(checkFrame);
    };

    checkFrame();
  }, [config, analyzeFrame]);

  useEffect(() => {
    return () => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    };
  }, []);

  return {
    isMotionDetected,
    activeZones,
    detectMotion,
    frameCount: frameCountRef.current
  };
};
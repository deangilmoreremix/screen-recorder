"use client";

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface CameraOptions {
  facingMode?: 'user' | 'environment';
  width?: number;
  height?: number;
  frameRate?: number;
}

export const useCameraCapture = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCapture = useCallback(async (options: CameraOptions = {}) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: options.facingMode || 'user',
          width: options.width || 1280,
          height: options.height || 720,
          frameRate: options.frameRate || 30
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      setStream(mediaStream);
      return mediaStream;
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera');
      throw error;
    }
  }, []);

  const stopCapture = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  return {
    stream,
    startCapture,
    stopCapture
  };
};
"use client";

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useScreenCapture = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCapture = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor',
          logicalSurface: true,
          cursor: 'always'
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
      console.error('Error accessing screen:', error);
      toast.error('Failed to access screen');
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
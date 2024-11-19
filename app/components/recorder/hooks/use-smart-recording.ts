"use client";

import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

interface SmartRecordingOptions {
  motionDetection?: {
    enabled: boolean;
    sensitivity: number;
  };
  voiceActivation?: {
    enabled: boolean;
    threshold: number;
  };
  autoPause?: {
    enabled: boolean;
    timeout: number;
  };
}

export const useSmartRecording = (options: SmartRecordingOptions = {}) => {
  const [isActive, setIsActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>();
  const previousImageData = useRef<ImageData>();
  const timeoutRef = useRef<number>();

  const detectMotion = useCallback((stream: MediaStream) => {
    if (!options.motionDetection?.enabled) return;

    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const checkMotion = () => {
      ctx.drawImage(video, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      if (previousImageData.current) {
        let diff = 0;
        for (let i = 0; i < imageData.data.length; i += 4) {
          diff += Math.abs(imageData.data[i] - previousImageData.current.data[i]);
        }
        
        const motionLevel = diff / (canvas.width * canvas.height);
        if (motionLevel > (options.motionDetection.sensitivity || 0.1)) {
          setIsActive(true);
        } else {
          setIsActive(false);
        }
      }

      previousImageData.current = imageData;
      requestAnimationFrame(checkMotion);
    };

    checkMotion();
  }, [options.motionDetection]);

  const detectVoice = useCallback((stream: MediaStream) => {
    if (!options.voiceActivation?.enabled) return;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkAudio = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      
      if (average > (options.voiceActivation.threshold || -50)) {
        setIsActive(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      } else {
        timeoutRef.current = window.setTimeout(() => {
          setIsActive(false);
        }, 1000);
      }

      requestAnimationFrame(checkAudio);
    };

    checkAudio();
  }, [options.voiceActivation]);

  const startSmartRecording = useCallback((stream: MediaStream) => {
    if (options.motionDetection?.enabled) {
      detectMotion(stream);
    }
    if (options.voiceActivation?.enabled) {
      detectVoice(stream);
    }
  }, [options, detectMotion, detectVoice]);

  const stopSmartRecording = useCallback(() => {
    setIsActive(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    isActive,
    startSmartRecording,
    stopSmartRecording
  };
};
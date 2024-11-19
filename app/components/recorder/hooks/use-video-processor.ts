"use client";

import { useState, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

interface VideoProcessingOptions {
  speed?: number;
  transition?: {
    type: 'fade' | 'slide' | 'zoom';
    duration: number;
  };
  effects?: string[];
  region?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const useVideoProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [ffmpeg] = useState(() => new FFmpeg());
  const [isLoaded, setIsLoaded] = useState(false);

  const loadFFmpeg = useCallback(async () => {
    if (!isLoaded) {
      await ffmpeg.load();
      setIsLoaded(true);
    }
  }, [ffmpeg, isLoaded]);

  const processVideo = useCallback(async (blob: Blob, options: VideoProcessingOptions = {}) => {
    try {
      setIsProcessing(true);

      if (!isLoaded) {
        await loadFFmpeg();
      }

      // Write input file
      await ffmpeg.writeFile('input.webm', await fetchFile(blob));

      // Prepare FFmpeg command
      const command = ['-i', 'input.webm'];

      // Add speed effect
      if (options.speed && options.speed !== 1) {
        command.push('-filter:v', `setpts=${1/options.speed}*PTS`);
      }

      // Add transition effect
      if (options.transition) {
        const duration = options.transition.duration / 1000;
        switch (options.transition.type) {
          case 'fade':
            command.push('-vf', `fade=t=in:st=0:d=${duration},fade=t=out:st=${duration}:d=${duration}`);
            break;
          case 'slide':
            command.push('-vf', `crop=iw/2:ih:0:0,pad=iw*2:ih:iw:0`);
            break;
          case 'zoom':
            command.push('-vf', `scale=iw*2:ih*2,crop=iw:ih`);
            break;
        }
      }

      // Add region cropping
      if (options.region) {
        command.push(
          '-filter:v',
          `crop=${options.region.width}:${options.region.height}:${options.region.x}:${options.region.y}`
        );
      }

      // Add output options
      command.push(
        '-c:v', 'libvpx-vp9',
        '-c:a', 'libopus',
        'output.webm'
      );

      // Execute command
      await ffmpeg.exec(command);

      // Read output file
      const data = await ffmpeg.readFile('output.webm');
      return new Blob([data], { type: 'video/webm' });
    } catch (error) {
      console.error('Error processing video:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [ffmpeg, isLoaded, loadFFmpeg]);

  return {
    isProcessing,
    processVideo,
    isLoaded
  };
};
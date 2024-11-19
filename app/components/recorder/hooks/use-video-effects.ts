"use client";

import { useState, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

interface VideoEffectOptions {
  type: "blur" | "grayscale" | "sepia" | "vintage" | "chroma" | "slowmo" | "timelapse" | "none";
  intensity?: number;
  chromaKey?: {
    color: string;
    similarity: number;
    smoothness: number;
  };
}

export const useVideoEffects = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [ffmpeg] = useState(() => new FFmpeg());

  const applyEffect = useCallback(async (
    sourceBlob: Blob,
    options: VideoEffectOptions
  ) => {
    try {
      setIsProcessing(true);

      await ffmpeg.load();
      await ffmpeg.writeFile('input.webm', await fetchFile(sourceBlob));

      const command = ['-i', 'input.webm'];

      switch (options.type) {
        case 'blur':
          command.push('-vf', `boxblur=${options.intensity || 2}`);
          break;

        case 'grayscale':
          command.push('-vf', 'colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3');
          break;

        case 'sepia':
          command.push('-vf', 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131');
          break;

        case 'vintage':
          command.push('-vf', 'curves=vintage');
          break;

        case 'chroma':
          if (options.chromaKey) {
            command.push(
              '-vf',
              `chromakey=${options.chromaKey.color}:${options.chromaKey.similarity}:${options.chromaKey.smoothness}`
            );
          }
          break;

        case 'slowmo':
          command.push('-vf', 'setpts=2.0*PTS');
          break;

        case 'timelapse':
          command.push('-vf', 'setpts=0.5*PTS');
          break;
      }

      command.push(
        '-c:v', 'libvpx-vp9',
        '-c:a', 'copy',
        'output.webm'
      );

      await ffmpeg.exec(command);

      const data = await ffmpeg.readFile('output.webm');
      return new Blob([data], { type: 'video/webm' });
    } catch (error) {
      console.error('Error applying video effect:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [ffmpeg]);

  return {
    isProcessing,
    applyEffect
  };
};
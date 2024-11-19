"use client";

import { useState, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

interface TransitionOptions {
  type: "fade" | "slide" | "zoom" | "none";
  duration: number;
  direction?: "left" | "right" | "top" | "bottom";
}

export const useTransitions = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [ffmpeg] = useState(() => new FFmpeg());

  const applyTransition = useCallback(async (
    sourceBlob: Blob,
    options: TransitionOptions
  ) => {
    try {
      setIsProcessing(true);

      await ffmpeg.load();
      await ffmpeg.writeFile('input.webm', await fetchFile(sourceBlob));

      const command = ['-i', 'input.webm'];

      switch (options.type) {
        case 'fade':
          command.push(
            '-vf',
            `fade=t=in:st=0:d=${options.duration/1000},fade=t=out:st=${options.duration/1000}:d=${options.duration/1000}`
          );
          break;

        case 'slide':
          const direction = options.direction || 'left';
          let slideFilter = '';
          switch (direction) {
            case 'left':
              slideFilter = `crop=iw/2:ih:0:0,pad=iw*2:ih:iw:0`;
              break;
            case 'right':
              slideFilter = `crop=iw/2:ih:iw/2:0,pad=iw*2:ih:0:0`;
              break;
            case 'top':
              slideFilter = `crop=iw:ih/2:0:0,pad=iw:ih*2:0:ih`;
              break;
            case 'bottom':
              slideFilter = `crop=iw:ih/2:0:ih/2,pad=iw:ih*2:0:0`;
              break;
          }
          command.push('-vf', slideFilter);
          break;

        case 'zoom':
          command.push(
            '-vf',
            `scale=iw*2:ih*2,crop=iw:ih`
          );
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
      console.error('Error applying transition:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [ffmpeg]);

  return {
    isProcessing,
    applyTransition
  };
};
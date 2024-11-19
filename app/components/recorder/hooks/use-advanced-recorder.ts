"use client";

import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { getVideoMetadata } from '@remotion/media-utils';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

interface AdvancedRecorderOptions {
  videoConfig?: {
    width?: number;
    height?: number;
    frameRate?: number;
    bitrate?: number;
    codec?: string;
  };
  audioConfig?: {
    sampleRate?: number;
    bitrate?: number;
    echoCancellation?: boolean;
    noiseSuppression?: boolean;
  };
  onProgress?: (progress: number) => void;
}

export const useAdvancedRecorder = (options: AdvancedRecorderOptions = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const ffmpegRef = useRef<FFmpeg>();
  const [metadata, setMetadata] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const initFFmpeg = useCallback(async () => {
    if (!ffmpegRef.current) {
      const ffmpeg = new FFmpeg();
      
      try {
        await ffmpeg.load();
        ffmpegRef.current = ffmpeg;
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading FFmpeg:', error);
        toast.error('Failed to initialize video processing');
        throw error;
      }
    }
    return ffmpegRef.current;
  }, []);

  const processVideo = useCallback(async (blob: Blob, operations: {
    trim?: { start: number; end: number };
    resize?: { width: number; height: number };
    compress?: boolean;
    addWatermark?: { text: string; position: string };
  }) => {
    try {
      setIsProcessing(true);
      
      // Initialize FFmpeg if not already loaded
      if (!isLoaded) {
        await initFFmpeg();
      }
      
      const ffmpeg = ffmpegRef.current;
      if (!ffmpeg) {
        throw new Error('FFmpeg not initialized');
      }

      // Write input file
      await ffmpeg.writeFile('input.webm', await fetchFile(blob));

      // Prepare FFmpeg command
      const command = ['-i', 'input.webm'];

      // Add operations
      if (operations.trim) {
        command.push(
          '-ss', String(operations.trim.start),
          '-t', String(operations.trim.end - operations.trim.start)
        );
      }

      if (operations.resize) {
        command.push('-vf', `scale=${operations.resize.width}:${operations.resize.height}`);
      }

      if (operations.compress) {
        command.push('-crf', '23');
      }

      if (operations.addWatermark?.text) {
        command.push('-vf', `drawtext=text='${operations.addWatermark.text}':x=10:y=10:fontsize=24:fontcolor=white`);
      }

      // Add output options
      command.push(
        '-c:v', 'libx264',
        '-preset', 'medium',
        '-c:a', 'aac',
        'output.mp4'
      );

      // Execute command
      await ffmpeg.exec(command);

      // Read output file
      const data = await ffmpeg.readFile('output.mp4');
      return new Blob([data], { type: 'video/mp4' });
    } catch (error) {
      console.error('Error processing video:', error);
      toast.error('Failed to process video');
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [initFFmpeg, isLoaded]);

  const analyzeVideo = useCallback(async (blob: Blob) => {
    try {
      const url = URL.createObjectURL(blob);
      const metadata = await getVideoMetadata(url);
      setMetadata(metadata);
      URL.revokeObjectURL(url);
      return metadata;
    } catch (error) {
      console.error('Error analyzing video:', error);
      toast.error('Failed to analyze video');
      throw error;
    }
  }, []);

  return {
    isProcessing,
    metadata,
    processVideo,
    analyzeVideo,
    isLoaded
  };
};
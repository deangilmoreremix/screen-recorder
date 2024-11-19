"use client";

import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { RecordingType, StreamSource } from '../types';

interface UseRecorderOptions {
  onStart?: () => void;
  onStop?: (blob: Blob) => void;
  onPause?: () => void;
  onResume?: () => void;
  onError?: (error: Error) => void;
}

export const useRecorder = (options: UseRecorderOptions = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingType, setRecordingType] = useState<RecordingType>(null);
  const [stats, setStats] = useState<{
    duration: number;
    fileSize: number;
    frameRate?: number;
    bitrate?: number;
    sources: number;
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const statsIntervalRef = useRef<number>();

  const updateStats = useCallback(() => {
    if (!startTimeRef.current) return;

    const duration = Date.now() - startTimeRef.current;
    const totalSize = chunksRef.current.reduce((acc, chunk) => acc + chunk.size, 0);
    
    setStats({
      duration,
      fileSize: totalSize,
      frameRate: mediaRecorderRef.current?.videoBitsPerSecond ? 60 : undefined,
      bitrate: mediaRecorderRef.current?.videoBitsPerSecond,
      sources: 1
    });
  }, []);

  const handleDataAvailable = useCallback((event: BlobEvent) => {
    if (event.data.size > 0) {
      chunksRef.current.push(event.data);
      updateStats();
    }
  }, [updateStats]);

  const start = useCallback(async (type: RecordingType, sources: StreamSource[]) => {
    try {
      const canvas = document.querySelector('#preview-canvas') as HTMLCanvasElement;
      if (!canvas) throw new Error("Preview canvas not found");

      const canvasStream = canvas.captureStream(60);
      const combinedStream = new MediaStream();

      // Add video track from canvas
      const videoTrack = canvasStream.getVideoTracks()[0];
      if (videoTrack) combinedStream.addTrack(videoTrack);

      // Add audio tracks from all sources
      sources.forEach(source => {
        if (source.active) {
          const audioTracks = source.stream.getAudioTracks();
          audioTracks.forEach(track => {
            if (track.enabled) {
              combinedStream.addTrack(track.clone());
            }
          });
        }
      });

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000
      });

      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.onstop = () => {
        const finalBlob = new Blob(chunksRef.current, { type: 'video/webm' });
        options.onStop?.(finalBlob);
        combinedStream.getTracks().forEach(track => track.stop());
        clearInterval(statsIntervalRef.current);
        setStats(null);
        setIsRecording(false);
        setRecordingType(null);
        setIsPaused(false);
        chunksRef.current = [];
      };

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      startTimeRef.current = Date.now();
      
      mediaRecorder.start(1000);
      statsIntervalRef.current = window.setInterval(updateStats, 1000);
      
      setIsRecording(true);
      setRecordingType(type);
      options.onStart?.();
    } catch (error) {
      console.error("Failed to start recording:", error);
      options.onError?.(error as Error);
      toast.error("Failed to start recording. Please check permissions.");
    }
  }, [handleDataAvailable, options, updateStats]);

  const stop = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const pause = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      options.onPause?.();
    }
  }, [options]);

  const resume = useCallback(() => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      options.onResume?.();
    }
  }, [options]);

  return {
    isRecording,
    isPaused,
    recordingType,
    stats,
    start,
    stop,
    pause,
    resume
  };
};
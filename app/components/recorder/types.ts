"use client";

export type RecordingType = "screen" | "camera" | "multi" | null;
export type VideoFormat = "1:1" | "16:9" | "9:16" | "4:3" | "custom";
export type Platform = "twitter" | "youtube" | "tiktok" | "instagram";
export type VideoEffect = "blur" | "grayscale" | "sepia" | "vintage" | "chroma" | "slowmo" | "timelapse" | "none";
export type AudioEffect = "noise-reduction" | "echo" | "pitch" | "reverb" | "none";
export type LayoutTemplate = "pip" | "side-by-side" | "stacked" | "custom";

export interface MotionDetectionConfig {
  enabled: boolean;
  sensitivity: number;
  zones: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  threshold: number;
}

export interface VoiceActivationConfig {
  enabled: boolean;
  threshold: number;
  delay: number;
  minDuration: number;
}

export interface SmartRecordingConfig {
  motionDetection?: MotionDetectionConfig;
  voiceActivation?: VoiceActivationConfig;
  autoStop?: {
    enabled: boolean;
    duration: number;
    onSilence: boolean;
    silenceDuration: number;
  };
}

export interface VideoProcessingConfig {
  effects: VideoEffect[];
  watermark?: {
    text: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    size: number;
    opacity: number;
  };
  pip?: {
    enabled: boolean;
    position: { x: number; y: number };
    size: { width: number; height: number };
  };
  mixing?: {
    sources: string[];
    layout: LayoutTemplate;
  };
}

export interface RecordingOptions {
  format: VideoFormat;
  platform: Platform;
  audio: boolean;
  frameRate?: number;
  videoBitsPerSecond?: number;
  audioBitsPerSecond?: number;
  width?: number;
  height?: number;
  captions?: boolean;
  endCard?: boolean;
  videoEffect?: VideoEffect;
  audioEffect?: AudioEffect;
  layout?: LayoutTemplate;
  chromaKey?: {
    color: string;
    similarity: number;
    smoothness: number;
  };
  smartRecording?: SmartRecordingConfig;
  videoProcessing?: VideoProcessingConfig;
  bufferSize?: number;
  timeLimit?: number;
  monitors?: string[];
  region?: {
    enabled: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface RecordingStats {
  duration: number;
  fileSize: number;
  frameRate?: number;
  bitrate?: number;
  sources: number;
  motionEvents?: number;
  voiceEvents?: number;
}

export interface UseRecorderOptions {
  onStart?: () => void;
  onStop?: (blob: Blob) => void;
  onPause?: () => void;
  onResume?: () => void;
  onError?: (error: Error) => void;
  onMotionDetected?: (zone: number) => void;
  onVoiceDetected?: (level: number) => void;
}

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface StreamSource {
  id: string;
  type: "screen" | "camera";
  stream: MediaStream;
  active: boolean;
  position?: Position;
  size?: Size;
  effect?: VideoEffect;
  monitor?: string;
}

export interface AudioTrack {
  id: string;
  type: "mic" | "system" | "music" | "voice";
  stream: MediaStreamTrack;
  volume: number;
  muted: boolean;
  effects: AudioEffect[];
}

export interface VideoCodec {
  name: string;
  mime: string;
  quality: "low" | "medium" | "high";
  bitrate: number;
}

export interface ExportOptions {
  format: "mp4" | "webm" | "gif";
  codec: VideoCodec;
  quality: number;
  fps: number;
}

export interface KeyboardShortcut {
  key: string;
  action: () => void;
  description: string;
}

export interface Caption {
  id: string;
  start: number;
  end: number;
  text: string;
  confidence?: number;
}

export interface CaptionStyle {
  fontSize: number;
  color: string;
  backgroundColor: string;
  backgroundOpacity: number;
  position: {
    x: number;
    y: number;
  };
  alignment: "left" | "center" | "right";
}
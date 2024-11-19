"use client";

import { useCallback, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import * as Tone from 'tone';

interface AudioSegment {
  start: number;
  end: number;
  type: 'speech' | 'silence' | 'music';
}

interface AudioProcessorOptions {
  silenceThreshold?: number;
  minSilenceDuration?: number;
  musicVolume?: number;
  onProgress?: (progress: number) => void;
}

const DEFAULT_OPTIONS: AudioProcessorOptions = {
  silenceThreshold: -45,
  minSilenceDuration: 500,
  musicVolume: 0.2,
};

export const useAudioProcessor = (options: AudioProcessorOptions = {}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [segments, setSegments] = useState<AudioSegment[]>([]);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const toneRef = useRef<Tone.ToneAudioBuffer | null>(null);

  const detectSilence = useCallback(async (audioBuffer: AudioBuffer, onProgress?: (progress: number) => void) => {
    const { silenceThreshold = DEFAULT_OPTIONS.silenceThreshold, 
            minSilenceDuration = DEFAULT_OPTIONS.minSilenceDuration } = options;
    
    const rawData = audioBuffer.getChannelData(0);
    const segments: AudioSegment[] = [];
    let isInSilence = false;
    let silenceStart = 0;
    
    const samplesPerAnalysis = Math.floor(audioBuffer.sampleRate * 0.02);
    const totalSteps = Math.ceil(rawData.length / samplesPerAnalysis);
    let currentStep = 0;
    
    for (let i = 0; i < rawData.length; i += samplesPerAnalysis) {
      const slice = rawData.slice(i, i + samplesPerAnalysis);
      const rms = Math.sqrt(slice.reduce((acc, val) => acc + val * val, 0) / slice.length);
      const db = 20 * Math.log10(rms);
      
      if (db < silenceThreshold) {
        if (!isInSilence) {
          isInSilence = true;
          silenceStart = i / audioBuffer.sampleRate;
        }
      } else if (isInSilence) {
        const silenceEnd = i / audioBuffer.sampleRate;
        if ((silenceEnd - silenceStart) * 1000 >= minSilenceDuration) {
          segments.push({
            start: silenceStart,
            end: silenceEnd,
            type: 'silence'
          });
        }
        isInSilence = false;
      }

      currentStep++;
      onProgress?.(currentStep / totalSteps * 0.5);
    }
    
    return segments;
  }, [options]);

  const applyAudioEffect = useCallback(async (audioBuffer: AudioBuffer, effect: string) => {
    await Tone.start();
    const toneBuffer = new Tone.ToneAudioBuffer(audioBuffer);
    toneRef.current = toneBuffer;

    const player = new Tone.Player(toneBuffer).toDestination();
    const effects: Record<string, Tone.Effect> = {
      'echo': new Tone.FeedbackDelay('8n', 0.5),
      'reverb': new Tone.Reverb(3),
      'pitch': new Tone.PitchShift(12),
    };

    if (effect in effects) {
      player.connect(effects[effect]);
      effects[effect].toDestination();
    }

    return player;
  }, []);

  const processAudio = useCallback(async (
    audioBlob: Blob, 
    options: {
      removeSilences?: boolean;
      effect?: string;
      backgroundMusic?: string;
      musicVolume?: number;
    } = {}
  ) => {
    setIsProcessing(true);
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const ctx = new AudioContext();
      let audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      if (options.effect) {
        const player = await applyAudioEffect(audioBuffer, options.effect);
        // Process the audio with the effect...
      }
      
      if (options.removeSilences) {
        const silenceSegments = await detectSilence(audioBuffer);
        setSegments(silenceSegments);
        // Remove silence segments...
      }

      // Convert back to blob
      const mediaStreamDest = ctx.createMediaStreamDestination();
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(mediaStreamDest);
      source.start();

      const mediaRecorder = new MediaRecorder(mediaStreamDest.stream);
      const chunks: Blob[] = [];

      return new Promise<Blob>((resolve) => {
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const finalBlob = new Blob(chunks, { type: 'audio/webm' });
          resolve(finalBlob);
        };
        
        mediaRecorder.start();
        setTimeout(() => {
          mediaRecorder.stop();
          options.onProgress?.(1);
        }, audioBuffer.duration * 1000);
      });
    } finally {
      setIsProcessing(false);
    }
  }, [applyAudioEffect, detectSilence]);

  const visualizeAudio = useCallback((audioBuffer: AudioBuffer) => {
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }
    
    wavesurferRef.current = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'rgb(99, 102, 241)',
      progressColor: 'rgb(79, 70, 229)',
      height: 100,
      normalize: true,
      cursorWidth: 0,
      barWidth: 2,
      barGap: 1,
      barRadius: 3,
    });
    
    wavesurferRef.current.loadDecodedBuffer(audioBuffer);
  }, []);

  return {
    isProcessing,
    segments,
    processAudio,
    visualizeAudio,
    applyAudioEffect
  };
};
"use client";

import { useState, useCallback } from 'react';
import * as Tone from 'tone';

interface AudioProcessingOptions {
  noiseReduction?: boolean;
  echoCancellation?: boolean;
  gainLevel?: number;
  equalizer?: {
    low?: number;
    mid?: number;
    high?: number;
  };
  backgroundMusic?: {
    file?: File;
    volume?: number;
  };
}

export const useAudioProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioContext] = useState(() => new AudioContext());

  const processAudioStream = useCallback(async (stream: MediaStream, options: AudioProcessingOptions = {}) => {
    try {
      setIsProcessing(true);

      // Create audio source from stream
      const source = audioContext.createMediaStreamSource(stream);
      const destination = audioContext.createMediaStreamDestination();

      // Create processing nodes
      const gainNode = audioContext.createGain();
      const analyser = audioContext.createAnalyser();
      const compressor = audioContext.createDynamicsCompressor();
      
      // Configure nodes based on options
      if (options.gainLevel) {
        gainNode.gain.value = options.gainLevel;
      }

      if (options.equalizer) {
        const lowEQ = audioContext.createBiquadFilter();
        const midEQ = audioContext.createBiquadFilter();
        const highEQ = audioContext.createBiquadFilter();

        lowEQ.type = 'lowshelf';
        midEQ.type = 'peaking';
        highEQ.type = 'highshelf';

        lowEQ.frequency.value = 320;
        midEQ.frequency.value = 1000;
        highEQ.frequency.value = 3200;

        lowEQ.gain.value = options.equalizer.low || 0;
        midEQ.gain.value = options.equalizer.mid || 0;
        highEQ.gain.value = options.equalizer.high || 0;

        // Connect EQ nodes
        source
          .connect(lowEQ)
          .connect(midEQ)
          .connect(highEQ)
          .connect(gainNode);
      } else {
        source.connect(gainNode);
      }

      // Add background music if provided
      if (options.backgroundMusic?.file) {
        const musicBuffer = await options.backgroundMusic.file.arrayBuffer();
        const musicSource = audioContext.createBufferSource();
        musicSource.buffer = await audioContext.decodeAudioData(musicBuffer);
        
        const musicGain = audioContext.createGain();
        musicGain.gain.value = options.backgroundMusic.volume || 0.5;
        
        musicSource
          .connect(musicGain)
          .connect(destination);
        
        musicSource.start();
      }

      // Connect processing chain
      gainNode
        .connect(compressor)
        .connect(analyser)
        .connect(destination);

      return destination.stream;
    } catch (error) {
      console.error('Error processing audio:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  }, [audioContext]);

  const applyAudioEffect = useCallback(async (buffer: AudioBuffer, effect: 'reverb' | 'delay' | 'distortion') => {
    await Tone.start();
    const player = new Tone.Player(buffer).toDestination();

    switch (effect) {
      case 'reverb':
        const reverb = new Tone.Reverb(3).toDestination();
        player.connect(reverb);
        break;
      case 'delay':
        const delay = new Tone.FeedbackDelay('8n', 0.5).toDestination();
        player.connect(delay);
        break;
      case 'distortion':
        const distortion = new Tone.Distortion(0.8).toDestination();
        player.connect(distortion);
        break;
    }

    return player;
  }, []);

  return {
    isProcessing,
    processAudioStream,
    applyAudioEffect,
    audioContext
  };
};
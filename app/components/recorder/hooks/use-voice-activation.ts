"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { VoiceActivationConfig } from '../types';

export const useVoiceActivation = (config: VoiceActivationConfig) => {
  const [isVoiceDetected, setIsVoiceDetected] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const timeoutRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode>();
  const dataArrayRef = useRef<Uint8Array>();

  const detectVoice = useCallback((stream: MediaStream) => {
    if (!config.enabled) return;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    source.connect(analyser);

    analyserRef.current = analyser;
    const bufferLength = analyser.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);

    const checkAudioLevel = () => {
      if (!analyserRef.current || !dataArrayRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const average = dataArrayRef.current.reduce((a, b) => a + b) / bufferLength;
      const normalizedLevel = average / 255;
      
      setAudioLevel(normalizedLevel);

      if (normalizedLevel > config.threshold) {
        setIsVoiceDetected(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      } else {
        timeoutRef.current = window.setTimeout(() => {
          setIsVoiceDetected(false);
        }, config.delay);
      }

      requestAnimationFrame(checkAudioLevel);
    };

    checkAudioLevel();

    return () => {
      audioContext.close();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [config]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isVoiceDetected,
    audioLevel,
    detectVoice
  };
};
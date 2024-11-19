"use client";

import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Card } from "@/components/ui/card";

interface AudioVisualizationProps {
  stream: MediaStream;
  height?: number;
  waveColor?: string;
  progressColor?: string;
}

export const AudioVisualization = ({
  stream,
  height = 100,
  waveColor = '#4f46e5',
  progressColor = '#312e81'
}: AudioVisualizationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer>();

  useEffect(() => {
    if (!containerRef.current) return;

    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      height,
      waveColor,
      progressColor,
      cursorWidth: 0,
      barWidth: 2,
      barGap: 1,
      barRadius: 3,
      normalize: true,
      interact: false,
      mediaControls: false
    });

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const draw = () => {
      analyser.getByteTimeDomainData(dataArray);
      wavesurfer.loadDecodedBuffer(createAudioBuffer(dataArray, audioContext));
      requestAnimationFrame(draw);
    };

    draw();
    wavesurferRef.current = wavesurfer;

    return () => {
      wavesurfer.destroy();
      audioContext.close();
    };
  }, [stream, height, waveColor, progressColor]);

  const createAudioBuffer = (dataArray: Uint8Array, context: AudioContext) => {
    const buffer = context.createBuffer(1, dataArray.length, context.sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataArray.length; i++) {
      channelData[i] = (dataArray[i] - 128) / 128;
    }
    return buffer;
  };

  return (
    <Card className="p-4">
      <div ref={containerRef} />
    </Card>
  );
};
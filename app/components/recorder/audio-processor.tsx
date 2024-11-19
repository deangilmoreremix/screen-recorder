"use client";

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Music2, Volume2, Waveform } from 'lucide-react';
import { useAudioProcessor } from './use-audio-processor';
import { Progress } from '@/components/ui/progress';

interface AudioProcessorProps {
  recordingBlob: Blob;
  onProcessingComplete?: (processedBlob: Blob) => void;
}

export const AudioProcessor = ({ 
  recordingBlob,
  onProcessingComplete 
}: AudioProcessorProps) => {
  const [removeSilence, setRemoveSilence] = useState(true);
  const [addMusic, setAddMusic] = useState(false);
  const [musicVolume, setMusicVolume] = useState(20);
  const [progress, setProgress] = useState(0);
  const waveformRef = useRef<HTMLDivElement>(null);
  
  const { 
    isProcessing,
    segments,
    processAudio,
    visualizeAudio 
  } = useAudioProcessor({
    onProgress: (value) => setProgress(value * 100)
  });

  useEffect(() => {
    if (recordingBlob && waveformRef.current) {
      const audioContext = new AudioContext();
      recordingBlob.arrayBuffer()
        .then(buffer => audioContext.decodeAudioData(buffer))
        .then(audioBuffer => visualizeAudio(audioBuffer));
    }
  }, [recordingBlob, visualizeAudio]);

  const handleProcess = async () => {
    try {
      const processedBlob = await processAudio(recordingBlob, {
        removeSilences: removeSilence,
        backgroundMusic: addMusic 
          ? '/audio/background-music.mp3'
          : undefined,
        musicVolume: musicVolume / 100
      });

      onProcessingComplete?.(processedBlob);
    } catch (error) {
      console.error('Audio processing failed:', error);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Audio Processing</h3>
        <p className="text-sm text-muted-foreground">
          Enhance your recording with advanced audio processing
        </p>
      </div>

      <div ref={waveformRef} id="waveform" className="w-full h-24 bg-secondary/20 rounded-lg" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Waveform className="w-4 h-4" />
            <Label htmlFor="remove-silence">Remove Silence</Label>
          </div>
          <Switch
            id="remove-silence"
            checked={removeSilence}
            onCheckedChange={setRemoveSilence}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music2 className="w-4 h-4" />
              <Label htmlFor="add-music">Background Music</Label>
            </div>
            <Switch
              id="add-music"
              checked={addMusic}
              onCheckedChange={setAddMusic}
            />
          </div>
          
          {addMusic && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <Label>Music Volume ({musicVolume}%)</Label>
              </div>
              <Slider
                value={[musicVolume]}
                onValueChange={([value]) => setMusicVolume(value)}
                max={100}
                step={1}
              />
            </div>
          )}
        </div>

        {segments.length > 0 && (
          <div className="text-sm text-muted-foreground">
            Detected {segments.length} silence segments
          </div>
        )}

        {isProcessing && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-center text-muted-foreground">
              Processing audio... {Math.round(progress)}%
            </p>
          </div>
        )}

        <Button 
          onClick={handleProcess}
          disabled={!recordingBlob || isProcessing}
          className="w-full"
        >
          {isProcessing ? 'Processing...' : 'Process Audio'}
        </Button>
      </div>
    </Card>
  );
};
"use client";

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Volume2, Mic, Music, Waveform } from "lucide-react";

interface AudioTrack {
  id: string;
  type: 'mic' | 'system' | 'music';
  volume: number;
  muted: boolean;
  effects: {
    eq: { low: number; mid: number; high: number };
    compression: boolean;
    noise: boolean;
  };
}

export const AudioMixing = () => {
  const [tracks, setTracks] = useState<AudioTrack[]>([
    {
      id: 'mic',
      type: 'mic',
      volume: 1,
      muted: false,
      effects: {
        eq: { low: 0, mid: 0, high: 0 },
        compression: true,
        noise: true
      }
    },
    {
      id: 'system',
      type: 'system',
      volume: 0.8,
      muted: false,
      effects: {
        eq: { low: 0, mid: 0, high: 0 },
        compression: false,
        noise: false
      }
    },
    {
      id: 'music',
      type: 'music',
      volume: 0.5,
      muted: false,
      effects: {
        eq: { low: 0, mid: 0, high: 0 },
        compression: false,
        noise: false
      }
    }
  ]);

  const updateTrack = (id: string, updates: Partial<AudioTrack>) => {
    setTracks(tracks.map(track =>
      track.id === id ? { ...track, ...updates } : track
    ));
  };

  const getTrackIcon = (type: AudioTrack['type']) => {
    switch (type) {
      case 'mic': return <Mic className="w-4 h-4" />;
      case 'system': return <Volume2 className="w-4 h-4" />;
      case 'music': return <Music className="w-4 h-4" />;
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-6">
        {tracks.map(track => (
          <div key={track.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                {getTrackIcon(track.type)}
                {track.type.charAt(0).toUpperCase() + track.type.slice(1)}
              </Label>
              <Switch
                checked={!track.muted}
                onCheckedChange={(checked) => updateTrack(track.id, { muted: !checked })}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Volume ({Math.round(track.volume * 100)}%)</Label>
                <Slider
                  value={[track.volume * 100]}
                  onValueChange={([value]) => updateTrack(track.id, { volume: value / 100 })}
                  max={100}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Waveform className="w-4 h-4" />
                  Equalizer
                </Label>
                {Object.entries(track.effects.eq).map(([band, value]) => (
                  <div key={band} className="space-y-2">
                    <Label className="capitalize">{band} ({value}dB)</Label>
                    <Slider
                      value={[value]}
                      onValueChange={([newValue]) =>
                        updateTrack(track.id, {
                          effects: {
                            ...track.effects,
                            eq: { ...track.effects.eq, [band]: newValue }
                          }
                        })
                      }
                      min={-12}
                      max={12}
                      step={1}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={track.effects.compression}
                    onCheckedChange={(compression) =>
                      updateTrack(track.id, {
                        effects: { ...track.effects, compression }
                      })
                    }
                  />
                  <Label>Compression</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={track.effects.noise}
                    onCheckedChange={(noise) =>
                      updateTrack(track.id, {
                        effects: { ...track.effects, noise }
                      })
                    }
                  />
                  <Label>Noise Reduction</Label>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Button className="w-full">
          Apply Audio Mix
        </Button>
      </div>
    </Card>
  );
};
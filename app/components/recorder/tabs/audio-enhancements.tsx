"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Volume2, Mic, Music, Waveform } from "lucide-react";
import { useState } from "react";

export const AudioEnhancements = () => {
  const [settings, setSettings] = useState({
    noiseReduction: true,
    echoCancellation: true,
    gain: 1,
    backgroundMusic: {
      enabled: false,
      volume: 0.5,
      file: null as File | null
    },
    equalizer: {
      low: 0,
      mid: 0,
      high: 0
    }
  });

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Waveform className="w-4 h-4" />
            Noise Reduction
          </Label>
          <Switch
            checked={settings.noiseReduction}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, noiseReduction: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Echo Cancellation
          </Label>
          <Switch
            checked={settings.echoCancellation}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, echoCancellation: checked })
            }
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Gain ({Math.round(settings.gain * 100)}%)
          </Label>
          <Slider
            value={[settings.gain * 100]}
            onValueChange={([value]) =>
              setSettings({ ...settings, gain: value / 100 })
            }
            max={200}
            step={1}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Background Music
            </Label>
            <Switch
              checked={settings.backgroundMusic.enabled}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  backgroundMusic: {
                    ...settings.backgroundMusic,
                    enabled: checked
                  }
                })
              }
            />
          </div>

          {settings.backgroundMusic.enabled && (
            <div className="space-y-4">
              <Input
                type="file"
                accept="audio/*"
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    backgroundMusic: {
                      ...settings.backgroundMusic,
                      file: e.target.files?.[0] || null
                    }
                  })
                }
              />
              <div className="space-y-2">
                <Label>Volume ({Math.round(settings.backgroundMusic.volume * 100)}%)</Label>
                <Slider
                  value={[settings.backgroundMusic.volume * 100]}
                  onValueChange={([value]) =>
                    setSettings({
                      ...settings,
                      backgroundMusic: {
                        ...settings.backgroundMusic,
                        volume: value / 100
                      }
                    })
                  }
                  max={100}
                  step={1}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Label>Equalizer</Label>
          <div className="space-y-4">
            {Object.entries(settings.equalizer).map(([band, value]) => (
              <div key={band} className="space-y-2">
                <Label className="capitalize">
                  {band} ({value}dB)
                </Label>
                <Slider
                  value={[value]}
                  onValueChange={([newValue]) =>
                    setSettings({
                      ...settings,
                      equalizer: {
                        ...settings.equalizer,
                        [band]: newValue
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
        </div>
      </div>
    </Card>
  );
};
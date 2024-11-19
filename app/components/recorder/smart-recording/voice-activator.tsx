"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { VoiceActivationConfig } from "../types";
import { Mic, Volume2, Clock } from "lucide-react";

interface VoiceActivatorProps {
  config: VoiceActivationConfig;
  onChange: (config: VoiceActivationConfig) => void;
  audioLevel?: number;
}

export const VoiceActivator = ({
  config,
  onChange,
  audioLevel = 0
}: VoiceActivatorProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Voice Activation
          </Label>
          <Switch
            checked={config.enabled}
            onCheckedChange={(enabled) => onChange({ ...config, enabled })}
          />
        </div>

        {config.enabled && (
          <>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Threshold ({config.threshold} dB)
              </Label>
              <Slider
                value={[config.threshold]}
                onValueChange={([value]) =>
                  onChange({ ...config, threshold: value })
                }
                min={-60}
                max={-20}
                step={1}
              />
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(audioLevel / -20) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Delay (seconds)
              </Label>
              <Input
                type="number"
                value={config.delay}
                onChange={(e) =>
                  onChange({ ...config, delay: parseFloat(e.target.value) || 0 })
                }
                min={0}
                step={0.1}
              />
            </div>

            <div className="space-y-2">
              <Label>Minimum Duration (seconds)</Label>
              <Input
                type="number"
                value={config.minDuration}
                onChange={(e) =>
                  onChange({
                    ...config,
                    minDuration: parseFloat(e.target.value) || 0
                  })
                }
                min={0}
                step={0.1}
              />
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
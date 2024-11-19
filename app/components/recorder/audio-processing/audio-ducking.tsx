"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Volume2, Mic } from "lucide-react";

export const AudioDucking = () => {
  const [settings, setSettings] = useState({
    enabled: false,
    threshold: -30,
    reduction: 12,
    attack: 50,
    release: 300
  });

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            Auto-Ducking
          </Label>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(enabled) => setSettings({ ...settings, enabled })}
          />
        </div>

        {settings.enabled && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Threshold ({settings.threshold} dB)</Label>
              <Slider
                value={[settings.threshold]}
                onValueChange={([value]) => setSettings({ ...settings, threshold: value })}
                min={-60}
                max={0}
              />
            </div>

            <div className="space-y-2">
              <Label>Reduction ({settings.reduction} dB)</Label>
              <Slider
                value={[settings.reduction]}
                onValueChange={([value]) => setSettings({ ...settings, reduction: value })}
                max={30}
              />
            </div>

            <div className="space-y-2">
              <Label>Attack ({settings.attack} ms)</Label>
              <Slider
                value={[settings.attack]}
                onValueChange={([value]) => setSettings({ ...settings, attack: value })}
                min={10}
                max={200}
              />
            </div>

            <div className="space-y-2">
              <Label>Release ({settings.release} ms)</Label>
              <Slider
                value={[settings.release]}
                onValueChange={([value]) => setSettings({ ...settings, release: value })}
                min={50}
                max={1000}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
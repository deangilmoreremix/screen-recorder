"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Star, Activity, Timer } from "lucide-react";

export const AutoHighlight = () => {
  const [settings, setSettings] = useState({
    enabled: false,
    sensitivity: 0.5,
    minDuration: 3,
    maxClips: 10,
    triggers: {
      motion: true,
      sound: true,
      faces: true
    }
  });

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Auto-Highlight Detection
          </Label>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(enabled) => setSettings({ ...settings, enabled })}
          />
        </div>

        {settings.enabled && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Detection Sensitivity
              </Label>
              <Slider
                value={[settings.sensitivity * 100]}
                onValueChange={([value]) => setSettings({ ...settings, sensitivity: value / 100 })}
                max={100}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Minimum Clip Duration (seconds)
              </Label>
              <Slider
                value={[settings.minDuration]}
                onValueChange={([value]) => setSettings({ ...settings, minDuration: value })}
                min={1}
                max={10}
              />
            </div>

            <div className="space-y-2">
              <Label>Detection Triggers</Label>
              <div className="space-y-2">
                {Object.entries(settings.triggers).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="capitalize">{key}</Label>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          triggers: { ...settings.triggers, [key]: checked }
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
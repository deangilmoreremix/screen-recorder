"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Motion,
  Mic,
  Brain,
  Timer,
  Camera,
  Subtitles,
  Scissors
} from "lucide-react";
import { useState } from "react";

export const SmartRecording = () => {
  const [settings, setSettings] = useState({
    motionDetection: {
      enabled: false,
      sensitivity: 0.5,
      region: { x: 0, y: 0, width: 100, height: 100 }
    },
    voiceActivation: {
      enabled: false,
      threshold: -50,
      delay: 1
    },
    autoCaptions: {
      enabled: false,
      language: "en",
      style: {
        position: "bottom",
        fontSize: 16
      }
    },
    sceneDetection: {
      enabled: false,
      threshold: 0.5,
      minDuration: 2
    },
    smartPause: {
      enabled: false,
      idleTimeout: 30,
      noiseThreshold: -60
    }
  });

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-6">
        {/* Motion Detection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Motion className="w-4 h-4" />
              Motion Detection Recording
            </Label>
            <Switch
              checked={settings.motionDetection.enabled}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  motionDetection: { ...settings.motionDetection, enabled: checked }
                })
              }
            />
          </div>

          {settings.motionDetection.enabled && (
            <div className="space-y-4 pl-6">
              <div className="space-y-2">
                <Label>Sensitivity ({Math.round(settings.motionDetection.sensitivity * 100)}%)</Label>
                <Slider
                  value={[settings.motionDetection.sensitivity * 100]}
                  onValueChange={([value]) =>
                    setSettings({
                      ...settings,
                      motionDetection: {
                        ...settings.motionDetection,
                        sensitivity: value / 100
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

        {/* Voice Activation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              Voice Activated Recording
            </Label>
            <Switch
              checked={settings.voiceActivation.enabled}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  voiceActivation: { ...settings.voiceActivation, enabled: checked }
                })
              }
            />
          </div>

          {settings.voiceActivation.enabled && (
            <div className="space-y-4 pl-6">
              <div className="space-y-2">
                <Label>Threshold ({settings.voiceActivation.threshold} dB)</Label>
                <Slider
                  value={[settings.voiceActivation.threshold]}
                  onValueChange={([value]) =>
                    setSettings({
                      ...settings,
                      voiceActivation: {
                        ...settings.voiceActivation,
                        threshold: value
                      }
                    })
                  }
                  min={-60}
                  max={-20}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <Label>Delay (seconds)</Label>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={settings.voiceActivation.delay}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      voiceActivation: {
                        ...settings.voiceActivation,
                        delay: parseFloat(e.target.value) || 0
                      }
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* Auto Captions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Subtitles className="w-4 h-4" />
              Auto-Generated Captions
            </Label>
            <Switch
              checked={settings.autoCaptions.enabled}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  autoCaptions: { ...settings.autoCaptions, enabled: checked }
                })
              }
            />
          </div>

          {settings.autoCaptions.enabled && (
            <div className="space-y-4 pl-6">
              <div className="space-y-2">
                <Label>Font Size ({settings.autoCaptions.style.fontSize}px)</Label>
                <Slider
                  value={[settings.autoCaptions.style.fontSize]}
                  onValueChange={([value]) =>
                    setSettings({
                      ...settings,
                      autoCaptions: {
                        ...settings.autoCaptions,
                        style: {
                          ...settings.autoCaptions.style,
                          fontSize: value
                        }
                      }
                    })
                  }
                  min={12}
                  max={32}
                  step={1}
                />
              </div>
            </div>
          )}
        </div>

        {/* Scene Detection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Scissors className="w-4 h-4" />
              Auto Scene Detection
            </Label>
            <Switch
              checked={settings.sceneDetection.enabled}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  sceneDetection: { ...settings.sceneDetection, enabled: checked }
                })
              }
            />
          </div>

          {settings.sceneDetection.enabled && (
            <div className="space-y-4 pl-6">
              <div className="space-y-2">
                <Label>Threshold ({Math.round(settings.sceneDetection.threshold * 100)}%)</Label>
                <Slider
                  value={[settings.sceneDetection.threshold * 100]}
                  onValueChange={([value]) =>
                    setSettings({
                      ...settings,
                      sceneDetection: {
                        ...settings.sceneDetection,
                        threshold: value / 100
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

        {/* Smart Pause */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Smart Pause
            </Label>
            <Switch
              checked={settings.smartPause.enabled}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  smartPause: { ...settings.smartPause, enabled: checked }
                })
              }
            />
          </div>

          {settings.smartPause.enabled && (
            <div className="space-y-4 pl-6">
              <div className="space-y-2">
                <Label>Idle Timeout (seconds)</Label>
                <Input
                  type="number"
                  min={1}
                  value={settings.smartPause.idleTimeout}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      smartPause: {
                        ...settings.smartPause,
                        idleTimeout: parseInt(e.target.value) || 30
                      }
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "../color-picker";
import {
  FastForward,
  Wand2,
  Layers,
  Image,
  Type,
  Palette,
  Scissors,
  Maximize2
} from "lucide-react";

interface VideoProcessingProps {
  onProcessingChange: (settings: any) => void;
}

export const VideoProcessing = ({ onProcessingChange }: VideoProcessingProps) => {
  const [settings, setSettings] = useState({
    speed: 1,
    quality: {
      bitrate: 2500,
      resolution: "1080p",
      fps: 60
    },
    effects: {
      blur: 0,
      brightness: 1,
      contrast: 1,
      saturation: 1
    },
    watermark: {
      enabled: false,
      text: "",
      position: "bottom-right",
      opacity: 0.8,
      size: 24
    },
    chromaKey: {
      enabled: false,
      color: "#00FF00",
      similarity: 0.4,
      blur: 4
    },
    stabilization: false,
    denoising: false,
    autoEnhance: false
  });

  const updateSettings = (updates: Partial<typeof settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    onProcessingChange(newSettings);
  };

  return (
    <Card className="p-6 space-y-6">
      {/* Playback Speed */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <FastForward className="w-4 h-4" />
          Playback Speed ({settings.speed}x)
        </Label>
        <Slider
          value={[settings.speed * 100]}
          onValueChange={([value]) =>
            updateSettings({ speed: value / 100 })
          }
          min={25}
          max={200}
          step={25}
        />
      </div>

      {/* Quality Settings */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <Maximize2 className="w-4 h-4" />
          Quality Settings
        </Label>
        <div className="space-y-4 pl-6">
          <div className="space-y-2">
            <Label>Bitrate ({settings.quality.bitrate} Kbps)</Label>
            <Slider
              value={[settings.quality.bitrate]}
              onValueChange={([value]) =>
                updateSettings({
                  quality: { ...settings.quality, bitrate: value }
                })
              }
              min={1000}
              max={8000}
              step={500}
            />
          </div>
          <div className="space-y-2">
            <Label>Frame Rate ({settings.quality.fps} FPS)</Label>
            <Slider
              value={[settings.quality.fps]}
              onValueChange={([value]) =>
                updateSettings({
                  quality: { ...settings.quality, fps: value }
                })
              }
              min={24}
              max={60}
              step={1}
            />
          </div>
        </div>
      </div>

      {/* Video Effects */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <Wand2 className="w-4 h-4" />
          Video Effects
        </Label>
        <div className="space-y-4 pl-6">
          <div className="space-y-2">
            <Label>Blur ({settings.effects.blur}px)</Label>
            <Slider
              value={[settings.effects.blur]}
              onValueChange={([value]) =>
                updateSettings({
                  effects: { ...settings.effects, blur: value }
                })
              }
              max={20}
              step={1}
            />
          </div>
          <div className="space-y-2">
            <Label>Brightness ({Math.round(settings.effects.brightness * 100)}%)</Label>
            <Slider
              value={[settings.effects.brightness * 100]}
              onValueChange={([value]) =>
                updateSettings({
                  effects: { ...settings.effects, brightness: value / 100 }
                })
              }
              min={50}
              max={150}
              step={1}
            />
          </div>
          <div className="space-y-2">
            <Label>Contrast ({Math.round(settings.effects.contrast * 100)}%)</Label>
            <Slider
              value={[settings.effects.contrast * 100]}
              onValueChange={([value]) =>
                updateSettings({
                  effects: { ...settings.effects, contrast: value / 100 }
                })
              }
              min={50}
              max={150}
              step={1}
            />
          </div>
          <div className="space-y-2">
            <Label>Saturation ({Math.round(settings.effects.saturation * 100)}%)</Label>
            <Slider
              value={[settings.effects.saturation * 100]}
              onValueChange={([value]) =>
                updateSettings({
                  effects: { ...settings.effects, saturation: value / 100 }
                })
              }
              min={0}
              max={200}
              step={1}
            />
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            Watermark
          </Label>
          <Switch
            checked={settings.watermark.enabled}
            onCheckedChange={(enabled) =>
              updateSettings({
                watermark: { ...settings.watermark, enabled }
              })
            }
          />
        </div>
        {settings.watermark.enabled && (
          <div className="space-y-4 pl-6">
            <Input
              placeholder="Watermark text"
              value={settings.watermark.text}
              onChange={(e) =>
                updateSettings({
                  watermark: { ...settings.watermark, text: e.target.value }
                })
              }
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Size ({settings.watermark.size}px)</Label>
                <Slider
                  value={[settings.watermark.size]}
                  onValueChange={([value]) =>
                    updateSettings({
                      watermark: { ...settings.watermark, size: value }
                    })
                  }
                  min={12}
                  max={48}
                  step={1}
                />
              </div>
              <div className="space-y-2">
                <Label>Opacity ({Math.round(settings.watermark.opacity * 100)}%)</Label>
                <Slider
                  value={[settings.watermark.opacity * 100]}
                  onValueChange={([value]) =>
                    updateSettings({
                      watermark: { ...settings.watermark, opacity: value / 100 }
                    })
                  }
                  max={100}
                  step={1}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chroma Key */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Chroma Key
          </Label>
          <Switch
            checked={settings.chromaKey.enabled}
            onCheckedChange={(enabled) =>
              updateSettings({
                chromaKey: { ...settings.chromaKey, enabled }
              })
            }
          />
        </div>
        {settings.chromaKey.enabled && (
          <div className="space-y-4 pl-6">
            <div className="space-y-2">
              <Label>Key Color</Label>
              <ColorPicker
                color={settings.chromaKey.color}
                onChange={(color) =>
                  updateSettings({
                    chromaKey: { ...settings.chromaKey, color }
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Similarity ({Math.round(settings.chromaKey.similarity * 100)}%)</Label>
              <Slider
                value={[settings.chromaKey.similarity * 100]}
                onValueChange={([value]) =>
                  updateSettings({
                    chromaKey: { ...settings.chromaKey, similarity: value / 100 }
                  })
                }
                max={100}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <Label>Edge Blur ({settings.chromaKey.blur}px)</Label>
              <Slider
                value={[settings.chromaKey.blur]}
                onValueChange={([value]) =>
                  updateSettings({
                    chromaKey: { ...settings.chromaKey, blur: value }
                  })
                }
                max={20}
                step={1}
              />
            </div>
          </div>
        )}
      </div>

      {/* Additional Features */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Video Stabilization
          </Label>
          <Switch
            checked={settings.stabilization}
            onCheckedChange={(stabilization) => updateSettings({ stabilization })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Scissors className="w-4 h-4" />
            Noise Reduction
          </Label>
          <Switch
            checked={settings.denoising}
            onCheckedChange={(denoising) => updateSettings({ denoising })}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            Auto Enhancement
          </Label>
          <Switch
            checked={settings.autoEnhance}
            onCheckedChange={(autoEnhance) => updateSettings({ autoEnhance })}
          />
        </div>
      </div>

      <Button 
        className="w-full"
        onClick={() => onProcessingChange(settings)}
      >
        Apply Processing Settings
      </Button>
    </Card>
  );
};
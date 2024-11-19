"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { FileVideo, Settings, Download } from "lucide-react";

export const ExportFormats = () => {
  const [settings, setSettings] = useState({
    format: "mp4",
    quality: {
      resolution: "1080p",
      bitrate: 2500,
      fps: 60
    },
    compression: {
      enabled: true,
      level: 23
    }
  });

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <FileVideo className="w-4 h-4" />
          Export Format
        </Label>
        <Select
          value={settings.format}
          onValueChange={(value) =>
            setSettings({ ...settings, format: value })
          }
        >
          <option value="mp4">MP4</option>
          <option value="webm">WebM</option>
          <option value="gif">GIF</option>
        </Select>

        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Quality Settings
          </Label>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Resolution</Label>
              <Select
                value={settings.quality.resolution}
                onValueChange={(value) =>
                  setSettings({
                    ...settings,
                    quality: { ...settings.quality, resolution: value }
                  })
                }
              >
                <option value="2160p">4K (2160p)</option>
                <option value="1440p">2K (1440p)</option>
                <option value="1080p">Full HD (1080p)</option>
                <option value="720p">HD (720p)</option>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Bitrate ({settings.quality.bitrate} Kbps)</Label>
              <Slider
                value={[settings.quality.bitrate]}
                onValueChange={([value]) =>
                  setSettings({
                    ...settings,
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
                  setSettings({
                    ...settings,
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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Compression
            </Label>
            <Switch
              checked={settings.compression.enabled}
              onCheckedChange={(enabled) =>
                setSettings({
                  ...settings,
                  compression: { ...settings.compression, enabled }
                })
              }
            />
          </div>

          {settings.compression.enabled && (
            <div className="space-y-2">
              <Label>Compression Level ({settings.compression.level})</Label>
              <Slider
                value={[settings.compression.level]}
                onValueChange={([value]) =>
                  setSettings({
                    ...settings,
                    compression: { ...settings.compression, level: value }
                  })
                }
                min={18}
                max={28}
                step={1}
              />
            </div>
          )}
        </div>

        <Button className="w-full">
          Apply Export Settings
        </Button>
      </div>
    </Card>
  );
};
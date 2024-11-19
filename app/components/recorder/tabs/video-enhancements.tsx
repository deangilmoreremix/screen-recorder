"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Sun,
  Contrast,
  Palette,
  Image,
  Move3D,
  Layers,
  FastForward,
  Transition
} from "lucide-react";
import { useState } from "react";
import { ColorPicker } from "../color-picker";

export const VideoEnhancements = () => {
  const [settings, setSettings] = useState({
    brightness: 1,
    contrast: 1,
    saturation: 1,
    stabilization: false,
    greenScreen: {
      enabled: false,
      color: "#00FF00",
      tolerance: 0.4
    },
    pip: {
      enabled: false,
      position: { x: 0.8, y: 0.8 },
      size: 0.3
    },
    speed: 1,
    transition: {
      type: "none" as "none" | "fade" | "slide" | "zoom",
      duration: 500
    }
  });

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <FastForward className="w-4 h-4" />
            Playback Speed ({settings.speed}x)
          </Label>
          <Slider
            value={[settings.speed * 100]}
            onValueChange={([value]) =>
              setSettings({ ...settings, speed: value / 100 })
            }
            min={25}
            max={200}
            step={25}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Transition className="w-4 h-4" />
            Transitions
          </Label>
          <div className="grid grid-cols-4 gap-2">
            {["none", "fade", "slide", "zoom"].map((type) => (
              <Button
                key={type}
                variant={settings.transition.type === type ? "default" : "outline"}
                onClick={() =>
                  setSettings({
                    ...settings,
                    transition: { ...settings.transition, type: type as any }
                  })
                }
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
          {settings.transition.type !== "none" && (
            <div className="space-y-2 mt-2">
              <Label>Duration ({settings.transition.duration}ms)</Label>
              <Slider
                value={[settings.transition.duration]}
                onValueChange={([value]) =>
                  setSettings({
                    ...settings,
                    transition: { ...settings.transition, duration: value }
                  })
                }
                min={100}
                max={2000}
                step={100}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Sun className="w-4 h-4" />
            Brightness ({Math.round(settings.brightness * 100)}%)
          </Label>
          <Slider
            value={[settings.brightness * 100]}
            onValueChange={([value]) =>
              setSettings({ ...settings, brightness: value / 100 })
            }
            min={50}
            max={150}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Contrast className="w-4 h-4" />
            Contrast ({Math.round(settings.contrast * 100)}%)
          </Label>
          <Slider
            value={[settings.contrast * 100]}
            onValueChange={([value]) =>
              setSettings({ ...settings, contrast: value / 100 })
            }
            min={50}
            max={150}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Saturation ({Math.round(settings.saturation * 100)}%)
          </Label>
          <Slider
            value={[settings.saturation * 100]}
            onValueChange={([value]) =>
              setSettings({ ...settings, saturation: value / 100 })
            }
            min={0}
            max={200}
            step={1}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Move3D className="w-4 h-4" />
            Video Stabilization
          </Label>
          <Switch
            checked={settings.stabilization}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, stabilization: checked })
            }
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Green Screen Effect
            </Label>
            <Switch
              checked={settings.greenScreen.enabled}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  greenScreen: { ...settings.greenScreen, enabled: checked }
                })
              }
            />
          </div>

          {settings.greenScreen.enabled && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Key Color</Label>
                <ColorPicker
                  color={settings.greenScreen.color}
                  onChange={(color) =>
                    setSettings({
                      ...settings,
                      greenScreen: { ...settings.greenScreen, color }
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Color Tolerance ({Math.round(settings.greenScreen.tolerance * 100)}%)
                </Label>
                <Slider
                  value={[settings.greenScreen.tolerance * 100]}
                  onValueChange={([value]) =>
                    setSettings({
                      ...settings,
                      greenScreen: {
                        ...settings.greenScreen,
                        tolerance: value / 100
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
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Picture in Picture
            </Label>
            <Switch
              checked={settings.pip.enabled}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  pip: { ...settings.pip, enabled: checked }
                })
              }
            />
          </div>

          {settings.pip.enabled && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Size ({Math.round(settings.pip.size * 100)}%)</Label>
                <Slider
                  value={[settings.pip.size * 100]}
                  onValueChange={([value]) =>
                    setSettings({
                      ...settings,
                      pip: { ...settings.pip, size: value / 100 }
                    })
                  }
                  min={10}
                  max={50}
                  step={1}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>X Position</Label>
                  <Slider
                    value={[settings.pip.position.x * 100]}
                    onValueChange={([value]) =>
                      setSettings({
                        ...settings,
                        pip: {
                          ...settings.pip,
                          position: {
                            ...settings.pip.position,
                            x: value / 100
                          }
                        }
                      })
                    }
                    max={100}
                    step={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Y Position</Label>
                  <Slider
                    value={[settings.pip.position.y * 100]}
                    onValueChange={([value]) =>
                      setSettings({
                        ...settings,
                        pip: {
                          ...settings.pip,
                          position: {
                            ...settings.pip.position,
                            y: value / 100
                          }
                        }
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
      </div>
    </Card>
  );
};
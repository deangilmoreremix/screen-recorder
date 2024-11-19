"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MotionDetectionConfig } from "../types";
import { Motion, Plus, Trash2 } from "lucide-react";

interface MotionDetectorProps {
  config: MotionDetectionConfig;
  onChange: (config: MotionDetectionConfig) => void;
}

export const MotionDetector = ({ config, onChange }: MotionDetectorProps) => {
  const [selectedZone, setSelectedZone] = useState<number | null>(null);

  const addZone = () => {
    onChange({
      ...config,
      zones: [
        ...config.zones,
        { x: 0, y: 0, width: 100, height: 100 }
      ]
    });
  };

  const removeZone = (index: number) => {
    onChange({
      ...config,
      zones: config.zones.filter((_, i) => i !== index)
    });
  };

  const updateZone = (index: number, updates: Partial<typeof config.zones[0]>) => {
    onChange({
      ...config,
      zones: config.zones.map((zone, i) =>
        i === index ? { ...zone, ...updates } : zone
      )
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <Motion className="w-4 h-4" />
            Motion Detection
          </Label>
          <Switch
            checked={config.enabled}
            onCheckedChange={(enabled) => onChange({ ...config, enabled })}
          />
        </div>

        {config.enabled && (
          <>
            <div className="space-y-2">
              <Label>Sensitivity ({Math.round(config.sensitivity * 100)}%)</Label>
              <Slider
                value={[config.sensitivity * 100]}
                onValueChange={([value]) =>
                  onChange({ ...config, sensitivity: value / 100 })
                }
                max={100}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Threshold ({Math.round(config.threshold * 100)}%)</Label>
              <Slider
                value={[config.threshold * 100]}
                onValueChange={([value]) =>
                  onChange({ ...config, threshold: value / 100 })
                }
                max={100}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <Label>Detection Zones</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addZone}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Zone
                </Button>
              </div>

              <div className="space-y-4">
                {config.zones.map((zone, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      selectedZone === index ? "border-primary" : "border-input"
                    }`}
                    onClick={() => setSelectedZone(index)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Label>Zone {index + 1}</Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeZone(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>X Position</Label>
                        <Input
                          type="number"
                          value={zone.x}
                          onChange={(e) =>
                            updateZone(index, { x: parseInt(e.target.value) || 0 })
                          }
                          min={0}
                          max={100}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Y Position</Label>
                        <Input
                          type="number"
                          value={zone.y}
                          onChange={(e) =>
                            updateZone(index, { y: parseInt(e.target.value) || 0 })
                          }
                          min={0}
                          max={100}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Width</Label>
                        <Input
                          type="number"
                          value={zone.width}
                          onChange={(e) =>
                            updateZone(index, {
                              width: parseInt(e.target.value) || 0
                            })
                          }
                          min={0}
                          max={100}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Height</Label>
                        <Input
                          type="number"
                          value={zone.height}
                          onChange={(e) =>
                            updateZone(index, {
                              height: parseInt(e.target.value) || 0
                            })
                          }
                          min={0}
                          max={100}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
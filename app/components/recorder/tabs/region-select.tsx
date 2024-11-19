"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crop, Move, Copy, Save } from "lucide-react";

export const RegionSelect = () => {
  const [region, setRegion] = useState({
    x: 0,
    y: 0,
    width: 100,
    height: 100
  });

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <Crop className="w-4 h-4" />
          Select Region
        </Label>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>X Position (%)</Label>
            <Input
              type="number"
              value={region.x}
              onChange={(e) =>
                setRegion({ ...region, x: parseInt(e.target.value) || 0 })
              }
              min={0}
              max={100}
            />
          </div>
          <div className="space-y-2">
            <Label>Y Position (%)</Label>
            <Input
              type="number"
              value={region.y}
              onChange={(e) =>
                setRegion({ ...region, y: parseInt(e.target.value) || 0 })
              }
              min={0}
              max={100}
            />
          </div>
          <div className="space-y-2">
            <Label>Width (%)</Label>
            <Input
              type="number"
              value={region.width}
              onChange={(e) =>
                setRegion({ ...region, width: parseInt(e.target.value) || 0 })
              }
              min={0}
              max={100}
            />
          </div>
          <div className="space-y-2">
            <Label>Height (%)</Label>
            <Input
              type="number"
              value={region.height}
              onChange={(e) =>
                setRegion({ ...region, height: parseInt(e.target.value) || 0 })
              }
              min={0}
              max={100}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Apply Region
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Copy className="w-4 h-4" />
            Copy Values
          </Button>
        </div>
      </div>
    </Card>
  );
};
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Mic, Music, Waveform } from "lucide-react";

export const VoiceFilters = () => {
  const [filters, setFilters] = useState({
    pitch: 1,
    robotize: 0,
    reverb: 0,
    echo: 0
  });

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Pitch Shift ({Math.round((filters.pitch - 1) * 100)}%)</Label>
          <Slider
            value={[(filters.pitch - 1) * 100]}
            onValueChange={([value]) => setFilters({ ...filters, pitch: (value / 100) + 1 })}
            min={-50}
            max={50}
          />
        </div>

        <div className="space-y-2">
          <Label>Robot Effect ({Math.round(filters.robotize * 100)}%)</Label>
          <Slider
            value={[filters.robotize * 100]}
            onValueChange={([value]) => setFilters({ ...filters, robotize: value / 100 })}
            max={100}
          />
        </div>

        <div className="space-y-2">
          <Label>Reverb ({Math.round(filters.reverb * 100)}%)</Label>
          <Slider
            value={[filters.reverb * 100]}
            onValueChange={([value]) => setFilters({ ...filters, reverb: value / 100 })}
            max={100}
          />
        </div>

        <div className="space-y-2">
          <Label>Echo ({Math.round(filters.echo * 100)}%)</Label>
          <Slider
            value={[filters.echo * 100]}
            onValueChange={([value]) => setFilters({ ...filters, echo: value / 100 })}
            max={100}
          />
        </div>

        <Button className="w-full">Apply Voice Effects</Button>
      </div>
    </Card>
  );
};
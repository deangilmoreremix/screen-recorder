"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Layout,
  SplitSquareVertical,
  LayoutPanelTop,
  Grid2x2,
  MonitorSmartphone,
  Square,
  Smartphone
} from "lucide-react";

interface LayoutControlsProps {
  onLayoutChange: (layout: string) => void;
  onFormatChange: (format: string) => void;
}

export const LayoutControls = ({
  onLayoutChange,
  onFormatChange
}: LayoutControlsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Layout Template</Label>
        <div className="grid grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => onLayoutChange('pip')}
            className="flex flex-col gap-2 h-auto p-4"
          >
            <Layout className="w-5 h-5" />
            <span>Picture in Picture</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => onLayoutChange('side-by-side')}
            className="flex flex-col gap-2 h-auto p-4"
          >
            <SplitSquareVertical className="w-5 h-5" />
            <span>Side by Side</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => onLayoutChange('stacked')}
            className="flex flex-col gap-2 h-auto p-4"
          >
            <LayoutPanelTop className="w-5 h-5" />
            <span>Stacked</span>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Output Format</Label>
        <div className="grid grid-cols-4 gap-4">
          <Button
            variant="outline"
            onClick={() => onFormatChange('16:9')}
            className="flex flex-col gap-2 h-auto p-4"
          >
            <MonitorSmartphone className="w-5 h-5" />
            <span>16:9</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => onFormatChange('1:1')}
            className="flex flex-col gap-2 h-auto p-4"
          >
            <Square className="w-5 h-5" />
            <span>1:1</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => onFormatChange('9:16')}
            className="flex flex-col gap-2 h-auto p-4"
          >
            <Smartphone className="w-5 h-5" />
            <span>9:16</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => onFormatChange('4:3')}
            className="flex flex-col gap-2 h-auto p-4"
          >
            <Grid2x2 className="w-5 h-5" />
            <span>4:3</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ColorPicker } from "./color-picker";
import { CaptionStyle } from "./types";
import { Card } from "@/components/ui/card";
import { AlignCenter, AlignLeft, AlignRight, Type } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface CaptionStylesProps {
  style: CaptionStyle;
  onChange: (style: CaptionStyle) => void;
}

export const CaptionStyles = ({ style, onChange }: CaptionStylesProps) => {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Caption Styles</h3>
        <p className="text-sm text-muted-foreground">
          Customize how your captions look
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Font Size</Label>
          <Slider
            value={[style.fontSize]}
            onValueChange={([fontSize]) =>
              onChange({ ...style, fontSize })
            }
            min={12}
            max={72}
            step={1}
          />
          <div className="text-sm text-muted-foreground text-center">
            {style.fontSize}px
          </div>
        </div>

        <div className="space-y-2">
          <Label>Background Opacity</Label>
          <Slider
            value={[style.backgroundOpacity]}
            onValueChange={([backgroundOpacity]) =>
              onChange({ ...style, backgroundOpacity })
            }
            min={0}
            max={100}
            step={1}
          />
          <div className="text-sm text-muted-foreground text-center">
            {style.backgroundOpacity}%
          </div>
        </div>

        <div className="space-y-2">
          <Label>Position</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Vertical</Label>
              <Input
                type="number"
                value={style.position.y}
                onChange={(e) =>
                  onChange({
                    ...style,
                    position: {
                      ...style.position,
                      y: Number(e.target.value),
                    },
                  })
                }
                min={0}
                max={100}
              />
            </div>
            <div>
              <Label className="text-sm">Horizontal</Label>
              <Input
                type="number"
                value={style.position.x}
                onChange={(e) =>
                  onChange({
                    ...style,
                    position: {
                      ...style.position,
                      x: Number(e.target.value),
                    },
                  })
                }
                min={0}
                max={100}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Alignment</Label>
          <ToggleGroup
            type="single"
            value={style.alignment}
            onValueChange={(alignment) =>
              alignment && onChange({ ...style, alignment })
            }
          >
            <ToggleGroupItem value="left">
              <AlignLeft className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="center">
              <AlignCenter className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="right">
              <AlignRight className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="space-y-2">
          <Label>Colors</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Text</Label>
              <ColorPicker
                color={style.color}
                onChange={(color) => onChange({ ...style, color })}
              />
            </div>
            <div>
              <Label className="text-sm">Background</Label>
              <ColorPicker
                color={style.backgroundColor}
                onChange={(backgroundColor) =>
                  onChange({ ...style, backgroundColor })
                }
              />
            </div>
          </div>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground mb-2">Preview</div>
          <div
            className="p-4 rounded"
            style={{
              fontSize: `${style.fontSize}px`,
              color: style.color,
              backgroundColor: `${style.backgroundColor}${Math.round(
                (style.backgroundOpacity / 100) * 255
              ).toString(16)}`,
              textAlign: style.alignment,
            }}
          >
            Sample Caption Text
          </div>
        </div>
      </div>
    </Card>
  );
};
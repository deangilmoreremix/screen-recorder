"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "../color-picker";
import { Layout, Type, Image as ImageIcon } from "lucide-react";

export const OverlayTemplates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customization, setCustomization] = useState({
    text: "",
    color: "#ffffff",
    backgroundColor: "#000000",
    opacity: 0.8,
    position: "bottom-right"
  });

  const templates = [
    { id: "minimal", name: "Minimal", preview: "/templates/minimal.png" },
    { id: "professional", name: "Professional", preview: "/templates/professional.png" },
    { id: "social", name: "Social Media", preview: "/templates/social.png" },
    { id: "gaming", name: "Gaming", preview: "/templates/gaming.png" }
  ];

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <Layout className="w-4 h-4" />
          Overlay Templates
        </Label>

        <div className="grid grid-cols-2 gap-4">
          {templates.map(template => (
            <Button
              key={template.id}
              variant={selectedTemplate === template.id ? "default" : "outline"}
              onClick={() => setSelectedTemplate(template.id)}
              className="h-auto aspect-video p-2"
            >
              <div className="space-y-2">
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full rounded"
                />
                <span>{template.name}</span>
              </div>
            </Button>
          ))}
        </div>

        {selectedTemplate && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Custom Text</Label>
              <Input
                value={customization.text}
                onChange={(e) => setCustomization({ ...customization, text: e.target.value })}
                placeholder="Enter overlay text..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Text Color</Label>
                <ColorPicker
                  color={customization.color}
                  onChange={(color) => setCustomization({ ...customization, color })}
                />
              </div>
              <div className="space-y-2">
                <Label>Background Color</Label>
                <ColorPicker
                  color={customization.backgroundColor}
                  onChange={(color) => setCustomization({ ...customization, backgroundColor })}
                />
              </div>
            </div>

            <Button className="w-full">Apply Template</Button>
          </div>
        )}
      </div>
    </Card>
  );
};
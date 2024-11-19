"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Caption } from "./types";
import { Download, Edit2, Save } from "lucide-react";

interface CaptionEditorProps {
  captions: Caption[];
  onEdit: (id: string, text: string) => void;
  onExport: () => void;
}

export const CaptionEditor = ({
  captions,
  onEdit,
  onExport,
}: CaptionEditorProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleEdit = (caption: Caption) => {
    setEditingId(caption.id);
    setEditText(caption.text);
  };

  const handleSave = (id: string) => {
    onEdit(id, editText);
    setEditingId(null);
    setEditText("");
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Captions</h3>
          <p className="text-sm text-muted-foreground">
            Edit and export your captions
          </p>
        </div>
        <Button onClick={onExport} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export SRT
        </Button>
      </div>

      <div className="space-y-4">
        {captions.map((caption) => (
          <div
            key={caption.id}
            className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg"
          >
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {formatTime(caption.start)} - {formatTime(caption.end)}
            </div>
            {editingId === caption.id ? (
              <div className="flex-1 flex gap-2">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={() => handleSave(caption.id)}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex justify-between items-start gap-2">
                <p className="text-sm flex-1">{caption.text}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(caption)}
                  className="flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
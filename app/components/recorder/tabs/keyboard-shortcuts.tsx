"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Keyboard, Plus } from "lucide-react";
import { useState } from "react";

interface Shortcut {
  id: string;
  action: string;
  key: string;
}

export const KeyboardShortcuts = () => {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([
    { id: "1", action: "Start Recording", key: "Alt+R" },
    { id: "2", action: "Stop Recording", key: "Alt+S" },
    { id: "3", action: "Pause Recording", key: "Alt+P" },
    { id: "4", action: "Toggle Fullscreen", key: "Alt+F" },
    { id: "5", action: "Toggle Mute", key: "Alt+M" }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleKeyPress = (e: React.KeyboardEvent, shortcut: Shortcut) => {
    e.preventDefault();
    
    const keys: string[] = [];
    if (e.altKey) keys.push("Alt");
    if (e.ctrlKey) keys.push("Ctrl");
    if (e.shiftKey) keys.push("Shift");
    if (e.key !== "Alt" && e.key !== "Control" && e.key !== "Shift") {
      keys.push(e.key.toUpperCase());
    }

    const newKey = keys.join("+");
    
    setShortcuts(shortcuts.map(s => 
      s.id === shortcut.id ? { ...s, key: newKey } : s
    ));
    setEditingId(null);
  };

  const addShortcut = () => {
    const newId = String(shortcuts.length + 1);
    setShortcuts([...shortcuts, { id: newId, action: "New Action", key: "..." }]);
    setEditingId(newId);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <Keyboard className="w-4 h-4" />
          Keyboard Shortcuts
        </Label>

        <div className="space-y-2">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.id}
              className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent"
            >
              <div className="flex-1">
                {editingId === shortcut.id ? (
                  <Input
                    value={shortcut.action}
                    onChange={(e) =>
                      setShortcuts(shortcuts.map(s =>
                        s.id === shortcut.id ? { ...s, action: e.target.value } : s
                      ))
                    }
                    onBlur={() => setEditingId(null)}
                    autoFocus
                  />
                ) : (
                  <span
                    className="cursor-pointer"
                    onClick={() => setEditingId(shortcut.id)}
                  >
                    {shortcut.action}
                  </span>
                )}
              </div>
              <Button
                variant="outline"
                className="w-32 font-mono"
                onClick={() => setEditingId(shortcut.id)}
                onKeyDown={(e) => editingId === shortcut.id && handleKeyPress(e, shortcut)}
              >
                {shortcut.key}
              </Button>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={addShortcut}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Shortcut
        </Button>
      </div>
    </Card>
  );
};
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Source {
  id: string;
  type: string;
  active: boolean;
  stream: MediaStream;
}

interface SourceListProps {
  sources: Source[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export const SourceList = ({ sources, onToggle, onRemove }: SourceListProps) => {
  if (sources.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground">Active Sources</h3>
      <div className="grid gap-2">
        <AnimatePresence>
          {sources.map((source) => (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-16 bg-black rounded overflow-hidden">
                      <video
                        ref={(el) => {
                          if (el) el.srcObject = source.stream;
                        }}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium capitalize">{source.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {source.active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggle(source.id)}
                    >
                      {source.active ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(source.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
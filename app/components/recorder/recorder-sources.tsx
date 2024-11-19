"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { StreamSource } from "./types";
import { Eye, EyeOff, Mic, MicOff, Trash2, GripVertical } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RecorderSourcesProps {
  sources: StreamSource[];
  onToggle: (sourceId: string) => void;
  onRemove: (sourceId: string) => void;
  onUpdatePosition?: (sourceId: string, position: { x: number; y: number }) => void;
  onUpdateSize?: (sourceId: string, size: { width: number; height: number }) => void;
}

export const RecorderSources = ({
  sources,
  onToggle,
  onRemove,
  onUpdatePosition,
  onUpdateSize
}: RecorderSourcesProps) => {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  if (sources.length === 0) return null;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      <AnimatePresence>
        {sources.map((source, index) => {
          const audioEnabled = source.stream.getAudioTracks().some(track => track.enabled);
          const isSelected = selectedSource === source.id;
          
          return (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`group relative overflow-hidden transition-all ${
                  isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedSource(source.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="p-4 space-y-4">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                    <video
                      autoPlay
                      muted
                      playsInline
                      ref={el => {
                        if (el) el.srcObject = source.stream;
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {source.type === "screen" ? "Screen" : "Camera"}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            source.stream.getAudioTracks().forEach(track => {
                              track.enabled = !track.enabled;
                            });
                          }}
                          className="hover:bg-primary/10"
                        >
                          {audioEnabled ? (
                            <Mic className="h-4 w-4" />
                          ) : (
                            <MicOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggle(source.id);
                          }}
                          className="hover:bg-primary/10"
                        >
                          {source.active ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove(source.id);
                          }}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="space-y-4 overflow-hidden"
                        >
                          {onUpdatePosition && (
                            <div className="space-y-2">
                              <label className="text-sm text-muted-foreground">Position</label>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <span className="text-xs text-muted-foreground">X Position</span>
                                  <Slider
                                    value={[source.position?.x || 0]}
                                    onValueChange={([x]) => {
                                      onUpdatePosition(source.id, { 
                                        x, 
                                        y: source.position?.y || 0 
                                      });
                                    }}
                                    min={0}
                                    max={100}
                                    step={1}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <span className="text-xs text-muted-foreground">Y Position</span>
                                  <Slider
                                    value={[source.position?.y || 0]}
                                    onValueChange={([y]) => {
                                      onUpdatePosition(source.id, { 
                                        x: source.position?.x || 0, 
                                        y 
                                      });
                                    }}
                                    min={0}
                                    max={100}
                                    step={1}
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {onUpdateSize && (
                            <div className="space-y-2">
                              <label className="text-sm text-muted-foreground">Size</label>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <span className="text-xs text-muted-foreground">Width</span>
                                  <Slider
                                    value={[source.size?.width || 100]}
                                    onValueChange={([width]) => {
                                      onUpdateSize(source.id, { 
                                        width, 
                                        height: source.size?.height || 100 
                                      });
                                    }}
                                    min={10}
                                    max={100}
                                    step={1}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <span className="text-xs text-muted-foreground">Height</span>
                                  <Slider
                                    value={[source.size?.height || 100]}
                                    onValueChange={([height]) => {
                                      onUpdateSize(source.id, { 
                                        width: source.size?.width || 100, 
                                        height 
                                      });
                                    }}
                                    min={10}
                                    max={100}
                                    step={1}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
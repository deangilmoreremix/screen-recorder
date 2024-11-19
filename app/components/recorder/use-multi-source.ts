"use client";

import { useCallback, useRef, useState } from "react";
import { StreamSource } from "./types";

export const useMultiSource = () => {
  const [sources, setSources] = useState<StreamSource[]>([]);
  const nextIdRef = useRef(1);

  const addSource = useCallback(async (type: "screen" | "camera") => {
    try {
      const stream = await (type === "screen" 
        ? navigator.mediaDevices.getDisplayMedia({ 
            video: { displaySurface: "monitor" },
            audio: true 
          })
        : navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "user" }, 
            audio: true 
          }));

      const newSource: StreamSource = {
        id: `source-${nextIdRef.current++}`,
        type,
        stream,
        active: true,
        position: { x: 0, y: 0, z: 0 },
        size: { width: 100, height: 100 }
      };

      setSources(prev => [...prev, newSource]);
      return newSource;
    } catch (error) {
      console.error("Failed to add source:", error);
      throw error;
    }
  }, []);

  const removeSource = useCallback((sourceId: string) => {
    setSources(prev => {
      const source = prev.find(s => s.id === sourceId);
      if (source) {
        source.stream.getTracks().forEach(track => track.stop());
      }
      return prev.filter(s => s.id !== sourceId);
    });
  }, []);

  const updateSourcePosition = useCallback((sourceId: string, position: Partial<Position>) => {
    setSources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, position: { ...source.position!, ...position } }
        : source
    ));
  }, []);

  const updateSourceSize = useCallback((sourceId: string, size: Partial<Size>) => {
    setSources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, size: { ...source.size!, ...size } }
        : source
    ));
  }, []);

  const toggleSource = useCallback((sourceId: string) => {
    setSources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, active: !source.active }
        : source
    ));
  }, []);

  return {
    sources,
    addSource,
    removeSource,
    updateSourcePosition,
    updateSourceSize,
    toggleSource
  };
};
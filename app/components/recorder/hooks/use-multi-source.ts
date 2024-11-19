"use client";

import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { StreamSource } from '../types';

interface MultiSourceOptions {
  maxSources?: number;
  onSourceAdded?: (source: StreamSource) => void;
  onSourceRemoved?: (sourceId: string) => void;
}

interface SourceOptions {
  monitorId?: string;
  region?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const useMultiSource = (options: MultiSourceOptions = {}) => {
  const [sources, setSources] = useState<StreamSource[]>([]);
  const nextIdRef = useRef(1);

  const addSource = useCallback(async (type: 'screen' | 'camera', sourceOptions?: SourceOptions) => {
    try {
      if (options.maxSources && sources.length >= options.maxSources) {
        toast.error(`Maximum of ${options.maxSources} sources allowed`);
        return null;
      }

      let stream: MediaStream;
      if (type === 'screen') {
        const displayMediaOptions: any = {
          video: {
            displaySurface: 'monitor',
            logicalSurface: true,
            cursor: 'always'
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100
          }
        };

        if (sourceOptions?.monitorId) {
          displayMediaOptions.video.deviceId = sourceOptions.monitorId;
        }

        stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

        if (sourceOptions?.region) {
          const { x, y, width, height } = sourceOptions.region;
          const videoTrack = stream.getVideoTracks()[0];
          await videoTrack.applyConstraints({
            advanced: [{ cropTo: { x, y, width, height } }]
          });
        }
      } else {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 60 }
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 48000
          }
        });
      }

      const settings = stream.getTracks()[0].getSettings();
      const newSource: StreamSource = {
        id: `source-${nextIdRef.current++}`,
        type,
        stream,
        active: true,
        settings,
        position: { x: 0, y: 0, z: 0 },
        size: { width: settings.width || 1920, height: settings.height || 1080 }
      };

      setSources(prev => [...prev, newSource]);
      options.onSourceAdded?.(newSource);
      return newSource;
    } catch (error) {
      console.error(`Error adding ${type} source:`, error);
      toast.error(`Failed to add ${type} source`);
      return null;
    }
  }, [sources, options]);

  const removeSource = useCallback((sourceId: string) => {
    setSources(prev => {
      const source = prev.find(s => s.id === sourceId);
      if (source) {
        source.stream.getTracks().forEach(track => track.stop());
        options.onSourceRemoved?.(sourceId);
      }
      return prev.filter(s => s.id !== sourceId);
    });
  }, [options]);

  const toggleSource = useCallback((sourceId: string) => {
    setSources(prev => prev.map(source => {
      if (source.id === sourceId) {
        source.stream.getTracks().forEach(track => {
          track.enabled = !source.active;
        });
        return { ...source, active: !source.active };
      }
      return source;
    }));
  }, []);

  const updateSourcePosition = useCallback((sourceId: string, position: Partial<{ x: number; y: number; z: number }>) => {
    setSources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, position: { ...source.position!, ...position } }
        : source
    ));
  }, []);

  const updateSourceSize = useCallback((sourceId: string, size: Partial<{ width: number; height: number }>) => {
    setSources(prev => prev.map(source => 
      source.id === sourceId 
        ? { ...source, size: { ...source.size!, ...size } }
        : source
    ));
  }, []);

  return {
    sources,
    addSource,
    removeSource,
    toggleSource,
    updateSourcePosition,
    updateSourceSize
  };
};
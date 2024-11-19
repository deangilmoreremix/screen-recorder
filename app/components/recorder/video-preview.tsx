"use client";

import { useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VideoPreviewProps {
  stream: MediaStream | null;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const VideoPreview = ({
  stream,
  isFullscreen,
  onToggleFullscreen
}: VideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!stream) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      >
        <Card className={`
          overflow-hidden bg-black/5 dark:bg-black/20
          ${isFullscreen ? 'w-full h-full rounded-none' : 'aspect-video'}
        `}>
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-contain"
            />
            
            <div className="absolute top-4 right-4">
              <Button
                variant="secondary"
                size="icon"
                onClick={onToggleFullscreen}
                className="bg-black/50 hover:bg-black/70 text-white"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
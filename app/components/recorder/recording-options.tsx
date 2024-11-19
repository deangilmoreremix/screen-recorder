"use client";

import { Button } from "@/components/ui/button";
import { Camera, Monitor, Layers } from "lucide-react";
import { motion } from "framer-motion";

interface RecordingOptionsProps {
  onStartRecording: (type: 'screen' | 'camera' | 'multi') => void;
  isRecording: boolean;
  sourcesCount: number;
}

export const RecordingOptions = ({
  onStartRecording,
  isRecording,
  sourcesCount
}: RecordingOptionsProps) => {
  if (isRecording) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Button
        onClick={() => onStartRecording('screen')}
        className="flex items-center gap-2"
        size="lg"
        asChild
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Monitor className="w-5 h-5" />
          Record Screen
        </motion.button>
      </Button>

      <Button
        onClick={() => onStartRecording('camera')}
        className="flex items-center gap-2"
        size="lg"
        asChild
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Camera className="w-5 h-5" />
          Record Camera
        </motion.button>
      </Button>

      <Button
        onClick={() => onStartRecording('multi')}
        className="flex items-center gap-2"
        size="lg"
        disabled={sourcesCount < 2}
        asChild
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Layers className="w-5 h-5" />
          Multi-Source
        </motion.button>
      </Button>
    </div>
  );
};
"use client";

import { Button } from "@/components/ui/button";
import { Camera, Pause, Play, StopCircle, Video, Layers } from "lucide-react";
import { RecordingType } from "./types";
import { motion } from "framer-motion";

interface RecorderButtonProps {
  type: RecordingType;
  onClick: () => void;
  onPause?: () => void;
  onResume?: () => void;
  isRecording: boolean;
  isPaused?: boolean;
}

export const RecorderButton = ({ 
  type, 
  onClick, 
  onPause, 
  onResume,
  isRecording, 
  isPaused 
}: RecorderButtonProps) => {
  if (isRecording) {
    return (
      <div className="flex gap-2">
        <Button
          variant="destructive"
          className="flex items-center gap-2 flex-1 h-12"
          onClick={onClick}
          asChild
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <StopCircle className="w-5 h-5" />
            Stop Recording
          </motion.button>
        </Button>
        {(onPause || onResume) && (
          <Button
            variant="outline"
            className="flex items-center gap-2 h-12 w-12"
            onClick={isPaused ? onResume : onPause}
            asChild
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </motion.button>
          </Button>
        )}
      </div>
    );
  }

  const getIcon = () => {
    switch (type) {
      case "screen":
        return <Video className="w-5 h-5" />;
      case "camera":
        return <Camera className="w-5 h-5" />;
      case "multi":
        return <Layers className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getText = () => {
    switch (type) {
      case "screen":
        return "Record Screen";
      case "camera":
        return "Record Camera";
      case "multi":
        return "Record Screen & Camera";
      default:
        return "Record";
    }
  };

  return (
    <Button
      className="w-full h-12 relative overflow-hidden group"
      onClick={onClick}
      asChild
    >
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="flex items-center gap-2 relative z-10">
          {getIcon()}
          {getText()}
        </span>
      </motion.button>
    </Button>
  );
};
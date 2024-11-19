"use client";

import { motion } from "framer-motion";
import { Clock, Mic, Video } from "lucide-react";

interface RecordingIndicatorProps {
  duration: number;
  isAudioActive: boolean;
  isVideoActive: boolean;
}

export const RecordingIndicator = ({
  duration,
  isAudioActive,
  isVideoActive
}: RecordingIndicatorProps) => {
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="absolute top-4 left-4 bg-black/75 backdrop-blur-sm rounded-lg p-3 text-white flex items-center gap-4"
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-3 h-3 rounded-full bg-red-500"
        />
        <span className="font-medium">{formatDuration(duration)}</span>
      </div>
      
      <div className="flex items-center gap-3 border-l border-white/20 pl-3">
        <div className={`${isAudioActive ? "text-green-400" : "text-red-400"}`}>
          <Mic className="w-4 h-4" />
        </div>
        <div className={`${isVideoActive ? "text-green-400" : "text-red-400"}`}>
          <Video className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
}
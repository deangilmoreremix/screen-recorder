"use client";

import { Button } from "@/components/ui/button";
import { StopCircle, Pause, Play } from "lucide-react";
import { motion } from "framer-motion";

interface RecordingControlsProps {
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  isPaused: boolean;
}

export const RecordingControls = ({
  onStop,
  onPause,
  onResume,
  isPaused
}: RecordingControlsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="destructive"
        onClick={onStop}
        className="flex-1 flex items-center gap-2"
        size="lg"
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
      
      <Button
        variant="outline"
        onClick={isPaused ? onResume : onPause}
        size="lg"
        asChild
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isPaused ? (
            <Play className="w-5 h-5" />
          ) : (
            <Pause className="w-5 h-5" />
          )}
        </motion.button>
      </Button>
    </div>
  );
};
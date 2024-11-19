"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface CountdownTimerProps {
  duration?: number;
  onComplete: () => void;
  onCancel: () => void;
}

export const CountdownTimer = ({
  duration = 5,
  onComplete,
  onCancel
}: CountdownTimerProps) => {
  const [count, setCount] = useState(duration);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [count, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-card rounded-lg shadow-lg p-8 w-80 h-80 flex flex-col items-center justify-center"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="absolute top-4 right-4"
        >
          Cancel
        </Button>

        <div className="text-center relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={count}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-8xl font-bold bg-gradient-to-r from-primary to-primary/50 text-transparent bg-clip-text">
                {count}
              </span>
            </motion.div>
          </AnimatePresence>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-muted-foreground mt-4"
          >
            Recording will start in {count} seconds
          </motion.div>
        </div>

        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            className="text-muted/20"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="36%"
            cx="50%"
            cy="50%"
          />
          <motion.circle
            className="text-primary"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r="36%"
            cx="50%"
            cy="50%"
            initial={{ pathLength: 1 }}
            animate={{ pathLength: count / duration }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
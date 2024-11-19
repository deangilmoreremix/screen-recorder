"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileVideo, Settings, Play, Pause } from "lucide-react";
import { toast } from "sonner";

interface ExportJob {
  id: string;
  format: string;
  quality: string;
  progress: number;
  status: "queued" | "processing" | "completed" | "failed";
}

export const BatchExport = () => {
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const addExportJob = () => {
    const newJob: ExportJob = {
      id: Date.now().toString(),
      format: "mp4",
      quality: "high",
      progress: 0,
      status: "queued"
    };
    setJobs([...jobs, newJob]);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    toast.info(isPaused ? "Batch export resumed" : "Batch export paused");
  };

  const updateJobProgress = (id: string, progress: number) => {
    setJobs(jobs.map(job =>
      job.id === id ? { ...job, progress } : job
    ));
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <FileVideo className="w-4 h-4" />
          Batch Export
        </Label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={togglePause}
          >
            {isPaused ? (
              <Play className="w-4 h-4" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={addExportJob}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {jobs.map(job => (
          <div
            key={job.id}
            className="p-4 rounded-lg border space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">
                  Export Job #{job.id.slice(-4)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {job.format.toUpperCase()} - {job.quality} quality
                </div>
              </div>
              <div className="text-sm font-medium">
                {job.status === "completed" ? "100%" : `${job.progress}%`}
              </div>
            </div>
            <Progress value={job.progress} />
          </div>
        ))}

        {jobs.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No export jobs in queue
          </div>
        )}
      </div>

      <Button
        className="w-full"
        disabled={jobs.length === 0}
        onClick={() => {
          toast.success("Starting batch export...");
          // Implement batch export logic
        }}
      >
        Start Batch Export
      </Button>
    </Card>
  );
};
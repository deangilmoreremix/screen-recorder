"use client";

import { RecordingStats } from "./types";
import { Card } from "@/components/ui/card";
import { 
  Clock, 
  HardDrive, 
  MonitorPlay, 
  Waves 
} from "lucide-react";

interface RecorderStatsProps {
  stats: RecordingStats;
}

export const RecorderStats = ({ stats }: RecorderStatsProps) => {
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">{formatDuration(stats.duration)}</div>
            <div className="text-xs text-muted-foreground">Duration</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="text-sm font-medium">{formatFileSize(stats.fileSize)}</div>
            <div className="text-xs text-muted-foreground">File Size</div>
          </div>
        </div>

        {stats.frameRate && (
          <div className="flex items-center gap-2">
            <MonitorPlay className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">{stats.frameRate} fps</div>
              <div className="text-xs text-muted-foreground">Frame Rate</div>
            </div>
          </div>
        )}

        {stats.bitrate && (
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">
                {(stats.bitrate / 1000000).toFixed(1)} Mbps
              </div>
              <div className="text-xs text-muted-foreground">Bitrate</div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
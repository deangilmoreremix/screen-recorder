"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScheduledRecording, RecordingType } from "./types";
import { Calendar, Clock, Timer } from "lucide-react";
import { format } from "date-fns";

interface ScheduledRecordingProps {
  onSchedule: (schedule: ScheduledRecording) => void;
  onCancel: () => void;
}

export const ScheduledRecordingDialog = ({
  onSchedule,
  onCancel
}: ScheduledRecordingProps) => {
  const [schedule, setSchedule] = useState<ScheduledRecording>({
    startTime: new Date(),
    type: "screen",
    duration: 60
  });

  const handleTimeChange = (time: string) => {
    const [hours, minutes] = time.split(":");
    const newDate = new Date(schedule.startTime);
    newDate.setHours(parseInt(hours), parseInt(minutes));
    setSchedule({ ...schedule, startTime: newDate });
  };

  const handleDateChange = (date: string) => {
    const newDate = new Date(date);
    newDate.setHours(schedule.startTime.getHours());
    newDate.setMinutes(schedule.startTime.getMinutes());
    setSchedule({ ...schedule, startTime: newDate });
  };

  const handleTypeChange = (type: RecordingType) => {
    if (type) {
      setSchedule({ ...schedule, type });
    }
  };

  const handleDurationChange = (duration: string) => {
    setSchedule({ ...schedule, duration: parseInt(duration) || undefined });
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Date
          </Label>
          <Input
            type="date"
            value={format(schedule.startTime, "yyyy-MM-dd")}
            onChange={(e) => handleDateChange(e.target.value)}
            min={format(new Date(), "yyyy-MM-dd")}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Time
          </Label>
          <Input
            type="time"
            value={format(schedule.startTime, "HH:mm")}
            onChange={(e) => handleTimeChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Timer className="w-4 h-4" />
            Duration (minutes)
          </Label>
          <Input
            type="number"
            value={schedule.duration || ""}
            onChange={(e) => handleDurationChange(e.target.value)}
            min="1"
            placeholder="Optional"
          />
        </div>

        <div className="space-y-2">
          <Label>Recording Type</Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={schedule.type === "screen" ? "default" : "outline"}
              onClick={() => handleTypeChange("screen")}
            >
              Screen
            </Button>
            <Button
              variant={schedule.type === "camera" ? "default" : "outline"}
              onClick={() => handleTypeChange("camera")}
            >
              Camera
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={() => onSchedule(schedule)}
          >
            Schedule Recording
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
};
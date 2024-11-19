"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Timer, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface ScheduledRecording {
  id: string;
  date: Date;
  duration: number;
  type: "screen" | "camera" | "both";
}

export const RecordingSchedule = () => {
  const [schedules, setSchedules] = useState<ScheduledRecording[]>([]);
  const [newSchedule, setNewSchedule] = useState<Partial<ScheduledRecording>>({
    date: new Date(),
    duration: 60,
    type: "screen"
  });

  const addSchedule = () => {
    if (!newSchedule.date || !newSchedule.duration || !newSchedule.type) return;

    const schedule: ScheduledRecording = {
      id: Date.now().toString(),
      date: newSchedule.date,
      duration: newSchedule.duration,
      type: newSchedule.type
    };

    setSchedules([...schedules, schedule]);
    setNewSchedule({
      date: new Date(),
      duration: 60,
      type: "screen"
    });
  };

  const removeSchedule = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Schedule Recording
          </Label>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={format(newSchedule.date || new Date(), "yyyy-MM-dd")}
                onChange={(e) =>
                  setNewSchedule({
                    ...newSchedule,
                    date: new Date(e.target.value)
                  })
                }
                min={format(new Date(), "yyyy-MM-dd")}
              />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input
                type="time"
                value={format(newSchedule.date || new Date(), "HH:mm")}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(":");
                  const newDate = new Date(newSchedule.date || new Date());
                  newDate.setHours(parseInt(hours), parseInt(minutes));
                  setNewSchedule({ ...newSchedule, date: newDate });
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Duration (minutes)
            </Label>
            <Input
              type="number"
              value={newSchedule.duration}
              onChange={(e) =>
                setNewSchedule({
                  ...newSchedule,
                  duration: parseInt(e.target.value) || 60
                })
              }
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label>Recording Type</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={newSchedule.type === "screen" ? "default" : "outline"}
                onClick={() => setNewSchedule({ ...newSchedule, type: "screen" })}
              >
                Screen
              </Button>
              <Button
                variant={newSchedule.type === "camera" ? "default" : "outline"}
                onClick={() => setNewSchedule({ ...newSchedule, type: "camera" })}
              >
                Camera
              </Button>
              <Button
                variant={newSchedule.type === "both" ? "default" : "outline"}
                onClick={() => setNewSchedule({ ...newSchedule, type: "both" })}
              >
                Both
              </Button>
            </div>
          </div>

          <Button className="w-full" onClick={addSchedule}>
            Add Schedule
          </Button>
        </div>

        {schedules.length > 0 && (
          <div className="space-y-4">
            <Label>Scheduled Recordings</Label>
            <div className="space-y-2">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="space-y-1">
                    <div className="font-medium">
                      {format(schedule.date, "PPP")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(schedule.date, "p")} - {schedule.duration} minutes
                    </div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {schedule.type} recording
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSchedule(schedule.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
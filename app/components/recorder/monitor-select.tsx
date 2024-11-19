"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Monitor } from "lucide-react";

interface MonitorSelectProps {
  onSelect: (monitorId: string) => void;
  selectedMonitor?: string;
}

export const MonitorSelect = ({ onSelect, selectedMonitor }: MonitorSelectProps) => {
  const [monitors, setMonitors] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const getMonitors = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setMonitors(videoDevices);
      } catch (error) {
        console.error("Error getting monitors:", error);
      }
    };

    getMonitors();
  }, []);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <Monitor className="w-4 h-4" />
          Select Monitor
        </Label>
        <RadioGroup
          value={selectedMonitor}
          onValueChange={onSelect}
          className="grid gap-2"
        >
          {monitors.map((monitor) => (
            <div
              key={monitor.deviceId}
              className="flex items-center space-x-2 rounded-lg border p-4"
            >
              <RadioGroupItem value={monitor.deviceId} id={monitor.deviceId} />
              <Label htmlFor={monitor.deviceId} className="flex-1">
                {monitor.label || `Monitor ${monitor.deviceId.slice(0, 4)}`}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </Card>
  );
};
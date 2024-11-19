"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  Share2, 
  Settings, 
  FileVideo,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  Copy
} from "lucide-react";
import { toast } from "sonner";

interface ExportDialogProps {
  recordingBlob: Blob;
  onClose: () => void;
}

export const ExportDialog = ({ recordingBlob, onClose }: ExportDialogProps) => {
  const [settings, setSettings] = useState({
    format: "mp4",
    quality: "high",
    resolution: "1080p",
    fps: 60,
    bitrate: 2500,
    compression: {
      enabled: true,
      level: 23
    },
    metadata: {
      title: "",
      description: "",
      tags: []
    }
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      // Simulate export progress
      for (let i = 0; i <= 100; i += 10) {
        setExportProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      const url = URL.createObjectURL(recordingBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `recording-${Date.now()}.${settings.format}`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success("Export completed successfully!");
      onClose();
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export recording");
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const handleShare = async (platform: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: settings.metadata.title || "My Recording",
          text: settings.metadata.description,
          files: [
            new File([recordingBlob], "recording.webm", {
              type: "video/webm"
            })
          ]
        });
        toast.success("Shared successfully!");
      } else {
        toast.error("Sharing not supported on this device");
      }
    } catch (error) {
      console.error("Share failed:", error);
      toast.error("Failed to share recording");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Recording</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="format">
          <TabsList className="grid grid-cols-3 gap-4 mb-4">
            <TabsTrigger value="format">Format</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
          </TabsList>

          <TabsContent value="format" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select
                  value={settings.format}
                  onValueChange={(format) => setSettings({ ...settings, format })}
                >
                  <option value="mp4">MP4</option>
                  <option value="webm">WebM</option>
                  <option value="gif">GIF</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quality Preset</Label>
                <Select
                  value={settings.quality}
                  onValueChange={(quality) => setSettings({ ...settings, quality })}
                >
                  <option value="high">High Quality</option>
                  <option value="medium">Medium Quality</option>
                  <option value="low">Low Quality</option>
                  <option value="custom">Custom</option>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Enable Compression</Label>
                  <Switch
                    checked={settings.compression.enabled}
                    onCheckedChange={(enabled) =>
                      setSettings({
                        ...settings,
                        compression: { ...settings.compression, enabled }
                      })
                    }
                  />
                </div>
                {settings.compression.enabled && (
                  <Slider
                    value={[settings.compression.level]}
                    onValueChange={([level]) =>
                      setSettings({
                        ...settings,
                        compression: { ...settings.compression, level }
                      })
                    }
                    min={18}
                    max={28}
                    step={1}
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quality" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Resolution</Label>
                <Select
                  value={settings.resolution}
                  onValueChange={(resolution) =>
                    setSettings({ ...settings, resolution })
                  }
                >
                  <option value="2160p">4K (2160p)</option>
                  <option value="1440p">2K (1440p)</option>
                  <option value="1080p">Full HD (1080p)</option>
                  <option value="720p">HD (720p)</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Frame Rate ({settings.fps} FPS)</Label>
                <Slider
                  value={[settings.fps]}
                  onValueChange={([fps]) => setSettings({ ...settings, fps })}
                  min={24}
                  max={60}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Bitrate ({settings.bitrate} Kbps)</Label>
                <Slider
                  value={[settings.bitrate]}
                  onValueChange={([bitrate]) => setSettings({ ...settings, bitrate })}
                  min={1000}
                  max={8000}
                  step={500}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="share" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={settings.metadata.title}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      metadata: { ...settings.metadata, title: e.target.value }
                    })
                  }
                  placeholder="Enter video title"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={settings.metadata.description}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      metadata: {
                        ...settings.metadata,
                        description: e.target.value
                      }
                    })
                  }
                  placeholder="Enter video description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleShare("youtube")}
                >
                  <Youtube className="w-4 h-4" />
                  YouTube
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleShare("twitter")}
                >
                  <Twitter className="w-4 h-4" />
                  Twitter
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleShare("facebook")}
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => handleShare("linkedin")}
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                }}
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 mt-4">
          <Button
            className="flex-1 flex items-center gap-2"
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download className="w-4 h-4" />
            {isExporting ? `Exporting (${exportProgress}%)` : "Export"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { toast } from "sonner";

interface PreviewProps {
  blob: Blob;
  type: 'screen' | 'camera' | null;
  onClose: () => void;
}

export const Preview = ({ blob, type, onClose }: PreviewProps) => {
  const handleDownload = () => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recording-${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Recording downloaded successfully');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        const file = new File([blob], 'recording.webm', { type: 'video/webm' });
        await navigator.share({
          files: [file],
          title: 'Screen Recording',
          text: 'Check out my screen recording!'
        });
        toast.success('Recording shared successfully');
      } else {
        toast.error('Sharing is not supported on this device');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share recording');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {type === 'screen' ? 'Screen Recording' : 'Camera Recording'} Preview
          </DialogTitle>
          <DialogDescription>
            Review your recording before downloading or sharing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video
              src={URL.createObjectURL(blob)}
              controls
              className="w-full h-full"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Recording
            </Button>
            <Button onClick={handleShare} className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Recording
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, Repeat2, Type } from "lucide-react";
import { AudioProcessor } from "./audio-processor";
import { useState } from "react";
import { useCaptions } from "./use-captions";
import { CaptionEditor } from "./caption-editor";

interface PreviewModalProps {
  recordingBlob: Blob;
  recordingType: "screen" | "camera" | null;
  onClose: () => void;
  onReRecord: () => void;
}

export const PreviewModal = ({
  recordingBlob,
  recordingType,
  onClose,
  onReRecord,
}: PreviewModalProps) => {
  const [showAudioProcessor, setShowAudioProcessor] = useState(false);
  const [showCaptionEditor, setShowCaptionEditor] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    captions,
    isGenerating,
    generateCaptions,
    editCaption,
    exportSRT
  } = useCaptions();

  const handleDownload = () => {
    const url = URL.createObjectURL(recordingBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recording-${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    try {
      const file = new File([recordingBlob], "recording.webm", {
        type: "video/webm",
      });
      await navigator.share({
        files: [file],
        title: "My Recording",
        text: "Check out my recording!",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleProcessingComplete = (processedBlob: Blob) => {
    const url = URL.createObjectURL(processedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `processed-recording-${Date.now()}.webm`;
    a.click();
    URL.revokeObjectURL(url);
    setIsProcessing(false);
    onClose();
  };

  const handleGenerateCaptions = async () => {
    try {
      await generateCaptions(recordingBlob);
      setShowCaptionEditor(true);
    } catch (error) {
      console.error("Failed to generate captions:", error);
    }
  };

  const handleExportSRT = () => {
    const srtContent = exportSRT();
    const blob = new Blob([srtContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `captions-${Date.now()}.srt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Preview Recording</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <video
              src={URL.createObjectURL(recordingBlob)}
              controls
              className="w-full h-full"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <Button onClick={() => setShowAudioProcessor(true)} disabled={isProcessing}>
              Process Audio
            </Button>
            <Button 
              onClick={handleGenerateCaptions} 
              disabled={isProcessing || isGenerating}
              className="flex items-center gap-2"
            >
              <Type className="w-4 h-4" />
              {isGenerating ? "Generating Captions..." : "Generate Captions"}
            </Button>
            <Button onClick={handleDownload} disabled={isProcessing}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={handleShare} disabled={isProcessing}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={onReRecord} disabled={isProcessing}>
              <Repeat2 className="w-4 h-4 mr-2" />
              Record Again
            </Button>
          </div>

          {showAudioProcessor && (
            <AudioProcessor
              recordingBlob={recordingBlob}
              onProcessingComplete={handleProcessingComplete}
            />
          )}

          {showCaptionEditor && captions.length > 0 && (
            <CaptionEditor
              captions={captions}
              onEdit={editCaption}
              onExport={handleExportSRT}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
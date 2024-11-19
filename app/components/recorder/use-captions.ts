"use client";

import { useCallback, useState } from "react";
import { Caption, CaptionStyle } from "./types";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

const DEFAULT_STYLE: CaptionStyle = {
  fontSize: 24,
  color: "#FFFFFF",
  backgroundColor: "#000000",
  backgroundOpacity: 60,
  position: { x: 50, y: 90 },
  alignment: "center",
};

export const useCaptions = () => {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [style, setStyle] = useState<CaptionStyle>(DEFAULT_STYLE);
  const [ffmpeg] = useState(() => new FFmpeg());
  const [isLoaded, setIsLoaded] = useState(false);

  const loadFFmpeg = useCallback(async () => {
    if (!isLoaded) {
      await ffmpeg.load({
        coreURL: await toBlobURL("/ffmpeg-core.js", "text/javascript"),
        wasmURL: await toBlobURL("/ffmpeg-core.wasm", "application/wasm"),
      });
      setIsLoaded(true);
    }
  }, [ffmpeg, isLoaded]);

  const generateCaptions = useCallback(async (audioBlob: Blob) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: audioBlob,
      });
      
      if (!response.ok) throw new Error("Transcription failed");
      
      const result = await response.json();
      const generatedCaptions: Caption[] = result.segments.map((segment: any, index: number) => ({
        id: `caption-${index}`,
        start: segment.start * 1000,
        end: segment.end * 1000,
        text: segment.text.trim(),
        confidence: segment.confidence,
      }));
      
      setCaptions(generatedCaptions);
      return generatedCaptions;
    } catch (error) {
      console.error("Failed to generate captions:", error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const burnCaptions = useCallback(async (videoBlob: Blob) => {
    try {
      await loadFFmpeg();
      
      // Write video file
      ffmpeg.writeFile("input.webm", await fetchFile(videoBlob));
      
      // Generate filter complex command for captions
      const filterComplex = captions
        .map((caption, i) => {
          const escapedText = caption.text.replace(/'/g, "'\\''");
          const start = caption.start / 1000;
          const duration = (caption.end - caption.start) / 1000;
          
          return `[0:v]drawtext=text='${escapedText}':
            fontsize=${style.fontSize}:
            fontcolor=${style.color}:
            box=1:
            boxcolor=${style.backgroundColor}@${style.backgroundOpacity / 100}:
            boxborderw=5:
            x=(w-text_w)*${style.position.x / 100}:
            y=(h-text_h)*${style.position.y / 100}:
            enable='between(t,${start},${start + duration})'[v${i}]`;
        })
        .join(";");
      
      // Run FFmpeg command
      await ffmpeg.exec([
        "-i", "input.webm",
        "-vf", filterComplex,
        "-c:a", "copy",
        "output.webm"
      ]);
      
      // Read the output file
      const data = await ffmpeg.readFile("output.webm");
      return new Blob([data], { type: "video/webm" });
    } catch (error) {
      console.error("Failed to burn captions:", error);
      throw error;
    }
  }, [ffmpeg, captions, style, loadFFmpeg]);

  const editCaption = useCallback((id: string, text: string) => {
    setCaptions(prev => prev.map(caption =>
      caption.id === id ? { ...caption, text } : caption
    ));
  }, []);

  const exportSRT = useCallback(() => {
    return captions
      .sort((a, b) => a.start - b.start)
      .map((caption, index) => {
        const formatTimestamp = (ms: number) => {
          const date = new Date(ms);
          const hours = date.getUTCHours().toString().padStart(2, "0");
          const minutes = date.getUTCMinutes().toString().padStart(2, "0");
          const seconds = date.getUTCSeconds().toString().padStart(2, "0");
          const milliseconds = date.getUTCMilliseconds().toString().padStart(3, "0");
          return `${hours}:${minutes}:${seconds},${milliseconds}`;
        };

        return `${index + 1}\n${formatTimestamp(caption.start)} --> ${formatTimestamp(caption.end)}\n${caption.text}\n\n`;
      })
      .join("");
  }, [captions]);

  return {
    captions,
    isGenerating,
    style,
    setStyle,
    generateCaptions,
    editCaption,
    exportSRT,
    burnCaptions,
  };
};
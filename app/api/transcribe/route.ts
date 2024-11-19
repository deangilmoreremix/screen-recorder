import { NextRequest, NextResponse } from "next/server";
import { Whisper } from "whisper-node";

const whisper = new Whisper({
  modelName: "base",
  whisperOptions: {
    language: "en",
    task: "transcribe",
  },
});

export async function POST(request: NextRequest) {
  try {
    const data = await request.arrayBuffer();
    const buffer = Buffer.from(data);
    
    const result = await whisper.transcribe(buffer);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
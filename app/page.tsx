import { Recorder } from "./components/recorder/recorder";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Screen & Camera Recorder</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Record your screen or camera with advanced features
          </p>
        </div>
        <Recorder />
      </div>
    </div>
  );
}
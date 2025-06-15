
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, StopCircle, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CameraRecordingProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  timerPhase: 'ready' | 'countdown' | 'active' | 'finished';
}

export const CameraRecording = ({ 
  isRecording, 
  onStartRecording, 
  onStopRecording,
  timerPhase 
}: CameraRecordingProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user', // front camera by default
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      const recorder = new MediaRecorder(mediaStream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedBlob(blob);
        chunks.length = 0;
      };

      setMediaRecorder(recorder);
      onStartRecording();
      
      toast({
        title: "Camera Ready!",
        description: "Camera is now active. Start the timer when you're ready to record.",
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const startRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'inactive') {
      mediaRecorder.start();
      toast({
        title: "Recording Started!",
        description: "Your exercise is now being recorded.",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      onStopRecording();
      toast({
        title: "Recording Stopped!",
        description: "Your exercise recording is ready for download.",
      });
    }
  };

  const downloadRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `exercise-recording-${new Date().toISOString().slice(0, 19)}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Auto start/stop recording based on timer phase
  useEffect(() => {
    if (timerPhase === 'active' && stream && !isRecording) {
      startRecording();
    } else if (timerPhase === 'finished' && isRecording) {
      stopRecording();
    }
  }, [timerPhase, stream, isRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-3">
      {!stream ? (
        <Button 
          onClick={startCamera}
          variant="outline"
          className="w-full"
        >
          <Camera className="w-4 h-4 mr-2" />
          Enable Camera Recording
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-32 object-cover rounded-lg bg-black"
            />
            {isRecording && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                REC
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={stopCamera}
              variant="outline"
              className="flex-1"
            >
              <StopCircle className="w-4 h-4 mr-2" />
              Stop Camera
            </Button>
            
            {recordedBlob && (
              <Button 
                onClick={downloadRecording}
                variant="default"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Video
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

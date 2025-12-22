import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Gauge, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSettings, saveSettings } from '@/utils/progressUtils';

// YouTube Player types
interface YouTubePlayer {
  destroy: () => void;
  setPlaybackRate: (rate: number) => void;
  playVideo: () => void;
  pauseVideo: () => void;
}

interface YouTubePlayerEvent {
  target: YouTubePlayer;
  data?: number;
}

interface YouTubePlayerOptions {
  videoId: string;
  playerVars?: {
    autoplay?: number;
    loop?: number;
    playlist?: string;
    modestbranding?: number;
    rel?: number;
  };
  events?: {
    onReady?: (event: YouTubePlayerEvent) => void;
    onError?: (event: YouTubePlayerEvent) => void;
    onStateChange?: (event: YouTubePlayerEvent) => void;
  };
}

interface YouTubeAPI {
  Player: new (elementId: string, options: YouTubePlayerOptions) => YouTubePlayer;
  PlayerState: {
    PLAYING: number;
    PAUSED: number;
    ENDED: number;
    BUFFERING: number;
  };
}

// Extend Window interface for YouTube API
declare global {
  interface Window {
    YT: YouTubeAPI;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface ExerciseVideoProps {
  exerciseId: string;
  exerciseVideos: { [key: string]: string };
}

const speedOptions = [
  { value: '0.25', label: '0.25x' },
  { value: '0.5', label: '0.5x' },
  { value: '0.75', label: '0.75x' },
  { value: '1', label: '1x' },
  { value: '1.25', label: '1.25x' },
  { value: '1.5', label: '1.5x' },
  { value: '1.75', label: '1.75x' },
  { value: '2', label: '2x' },
];

// Load YouTube IFrame API script
const loadYouTubeAPI = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }

    const existingScript = document.getElementById('youtube-api');
    if (existingScript) {
      // Script is loading, wait for it
      const checkReady = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(checkReady);
          resolve();
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = 'youtube-api';
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;

    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };

    document.body.appendChild(script);
  });
};

export const ExerciseVideo = ({ exerciseId, exerciseVideos }: ExerciseVideoProps) => {
  const settings = getSettings();
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(settings.videoSpeed.toString());
  const [isApiReady, setIsApiReady] = useState(false);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerContainerId = `youtube-player-${exerciseId}`;

  const videoId = exerciseVideos[exerciseId];
  const isPlaceholder = !videoId || videoId === 'placeholder' || videoId.startsWith('placeholder');

  // Load YouTube API on mount
  useEffect(() => {
    loadYouTubeAPI().then(() => {
      setIsApiReady(true);
    });
  }, []);

  // Initialize player when API is ready and video changes
  const initPlayer = useCallback(() => {
    if (!isApiReady || isPlaceholder || !window.YT || !window.YT.Player) return;

    // Destroy existing player
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    setIsLoading(true);
    setVideoError(false);

    // Small delay to ensure DOM element exists
    setTimeout(() => {
      try {
        playerRef.current = new window.YT.Player(playerContainerId, {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            loop: 1,
            playlist: videoId,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onReady: (event: YouTubePlayerEvent) => {
              setIsLoading(false);
              // Set initial playback speed
              const speed = parseFloat(playbackSpeed);
              event.target.setPlaybackRate(speed);
            },
            onError: () => {
              setVideoError(true);
              setIsLoading(false);
            },
            onStateChange: (event: YouTubePlayerEvent) => {
              // When video starts playing, ensure correct speed (PlayerState.PLAYING = 1)
              if (event.data === 1) {
                const speed = parseFloat(playbackSpeed);
                event.target.setPlaybackRate(speed);
              }
            },
          },
        });
      } catch {
        setVideoError(true);
        setIsLoading(false);
      }
    }, 100);
  }, [isApiReady, isPlaceholder, videoId, playerContainerId, playbackSpeed]);

  useEffect(() => {
    initPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [initPlayer]);

  const handleSpeedChange = (value: string) => {
    setPlaybackSpeed(value);
    const currentSettings = getSettings();
    saveSettings({ ...currentSettings, videoSpeed: parseFloat(value) });

    // Apply speed to current player
    if (playerRef.current && playerRef.current.setPlaybackRate) {
      playerRef.current.setPlaybackRate(parseFloat(value));
    }
  };

  const handleRetry = () => {
    setVideoError(false);
    setIsLoading(true);
    initPlayer();
  };

  // Placeholder video card
  if (isPlaceholder) {
    return (
      <Card className="border-yellow-300 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-700">
            <Play className="w-5 h-5" />
            Video Coming Soon
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-yellow-100 rounded-lg flex items-center justify-center border-2 border-dashed border-yellow-300">
            <div className="text-center">
              <Play className="w-20 h-20 text-yellow-300 mx-auto mb-4" />
              <p className="text-yellow-700 text-lg font-medium">Video Not Available Yet</p>
              <p className="text-sm text-yellow-600 mt-2">Check back soon for the tutorial video</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state card
  if (videoError) {
    return (
      <Card className="border-red-300 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Play className="w-5 h-5" />
            Video Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-red-100 rounded-lg flex items-center justify-center border-2 border-dashed border-red-300">
            <div className="text-center">
              <Play className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <p className="text-red-700 text-lg font-medium">Failed to Load Video</p>
              <p className="text-sm text-red-600 mt-2 mb-4">Please check your connection and try again</p>
              <Button 
                variant="outline" 
                onClick={handleRetry}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Exercise Video
          </CardTitle>
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-muted-foreground" />
            <Select value={playbackSpeed} onValueChange={handleSpeedChange}>
              <SelectTrigger className="w-24 h-8">
                <SelectValue placeholder="Speed" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {speedOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={containerRef}
          className="aspect-video bg-black rounded-lg flex items-center justify-center border-2 border-primary mb-4 relative overflow-hidden"
        >
          {isLoading && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 rounded-lg">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-2" />
                <p className="text-white text-sm">Loading video...</p>
              </div>
            </div>
          )}
          <div 
            id={playerContainerId} 
            className="w-full h-full rounded-lg"
          />
        </div>
      </CardContent>
    </Card>
  );
};

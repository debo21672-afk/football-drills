import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, X, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { TimerControls } from './TimerControls';
import { TimerDisplay } from './TimerDisplay';
import { ScoreInput } from './ScoreInput';
import { playCountdownSound, playStartSound, playWarningSound, playEndSound } from './TimerSounds';
import { getSettings, saveSettings } from '@/utils/progressUtils';

interface TimerComponentProps {
  onComplete: (reps: number) => void;
  onCancel: () => void;
  exerciseName: string;
  initialDuration?: number;
}

export const TimerComponent = ({ onComplete, onCancel, exerciseName, initialDuration }: TimerComponentProps) => {
  const settings = getSettings();
  const duration = initialDuration || settings.defaultTimerDuration;
  
  const [phase, setPhase] = useState<'ready' | 'countdown' | 'active' | 'paused' | 'finished'>('ready');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [manualScore, setManualScore] = useState('');
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const hasCompleted = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // Countdown timer
  useEffect(() => {
    if (phase === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => {
        if (countdown === 1) {
          if (soundEnabled) playStartSound();
          setPhase('active');
          setTimeLeft(duration);
          startTimeRef.current = Date.now();
        } else {
          if (soundEnabled) playCountdownSound();
          setCountdown(countdown - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, countdown, soundEnabled, duration]);

  // Main timer
  useEffect(() => {
    if (phase === 'active' && timeLeft > 0) {
      const timer = setTimeout(() => {
        const newTimeLeft = timeLeft - 1;
        setTimeLeft(newTimeLeft);
        
        // Warning sound for last 10 seconds
        if (newTimeLeft <= 10 && newTimeLeft > 0) {
          if (soundEnabled) playWarningSound();
        }
        
        // End sound when timer finishes
        if (newTimeLeft === 0) {
          if (soundEnabled) playEndSound();
          setPhase('finished');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, timeLeft, soundEnabled]);

  useEffect(() => {
    if (phase === 'finished') {
      hasCompleted.current = false; // user must now submit their score manually
    }
  }, [phase]);

  const startTimer = () => {
    setPhase('countdown');
    setCountdown(3);
    if (soundEnabled) playCountdownSound();
    hasCompleted.current = false; // reset for new challenge
    setTimeLeft(duration);
    setManualScore('');
    setScoreSubmitted(false);
    pausedTimeRef.current = 0;
  };

  const pauseTimer = () => {
    if (phase === 'active') {
      pausedTimeRef.current = Date.now();
      setPhase('paused');
    }
  };

  const resumeTimer = () => {
    if (phase === 'paused' && startTimeRef.current && pausedTimeRef.current) {
      // Adjust start time to account for paused duration
      const pauseDuration = Date.now() - pausedTimeRef.current;
      startTimeRef.current += pauseDuration;
      setPhase('active');
    }
  };

  const toggleSound = () => {
    const newSoundEnabled = !soundEnabled;
    setSoundEnabled(newSoundEnabled);
    const currentSettings = getSettings();
    saveSettings({ ...currentSettings, soundEnabled: newSoundEnabled });
  };

  const handleScoreSubmit = (score: number) => {
    setScoreSubmitted(true);
    setManualScore(score.toString());
    if (!hasCompleted.current) {
      hasCompleted.current = true;
      onComplete(score);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="border-2 border-blue-500">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Timer className="w-5 h-5" />
              {exerciseName} - Timer
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleSound} title={soundEnabled ? "Mute sounds" : "Enable sounds"}>
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={onCancel}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {phase === 'ready' && <TimerControls onStartTimer={startTimer} />}
          
          {(phase === 'countdown' || phase === 'active' || phase === 'paused') && (
            <>
              <TimerDisplay 
                phase={phase === 'paused' ? 'active' : phase} 
                countdown={countdown} 
                timeLeft={timeLeft} 
              />
              
              {phase === 'active' && (
                <div className="flex justify-center">
                  <Button 
                    onClick={pauseTimer} 
                    variant="outline" 
                    size="lg"
                    className="gap-2"
                  >
                    <Pause className="w-5 h-5" />
                    Pause
                  </Button>
                </div>
              )}
              
              {phase === 'paused' && (
                <div className="flex justify-center gap-3">
                  <Button 
                    onClick={resumeTimer} 
                    variant="default" 
                    size="lg"
                    className="gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Resume
                  </Button>
                  <Button 
                    onClick={onCancel} 
                    variant="outline" 
                    size="lg"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </>
          )}

          {phase === 'finished' && (
            <ScoreInput 
              onSubmit={handleScoreSubmit}
              scoreSubmitted={scoreSubmitted}
              submittedScore={manualScore}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

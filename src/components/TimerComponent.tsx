import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, X } from "lucide-react";
import { TimerControls } from './TimerControls';
import { TimerDisplay } from './TimerDisplay';
import { ScoreInput } from './ScoreInput';
import { CameraRecording } from './CameraRecording';
import { playCountdownSound, playStartSound, playWarningSound, playEndSound } from './TimerSounds';

interface TimerComponentProps {
  onComplete: (reps: number) => void;
  onCancel: () => void;
  exerciseName: string;
}

export const TimerComponent = ({ onComplete, onCancel, exerciseName }: TimerComponentProps) => {
  const [phase, setPhase] = useState<'ready' | 'countdown' | 'active' | 'finished'>('ready');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [manualScore, setManualScore] = useState('');
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const hasCompleted = useRef(false);

  // Countdown timer
  useEffect(() => {
    if (phase === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => {
        if (countdown === 1) {
          playStartSound();
          setPhase('active');
          setTimeLeft(60);
        } else {
          playCountdownSound();
          setCountdown(countdown - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, countdown]);

  // Main timer
  useEffect(() => {
    if (phase === 'active' && timeLeft > 0) {
      const timer = setTimeout(() => {
        const newTimeLeft = timeLeft - 1;
        setTimeLeft(newTimeLeft);
        
        // Warning sound for last 10 seconds
        if (newTimeLeft <= 10 && newTimeLeft > 0) {
          playWarningSound();
        }
        
        // End sound when timer finishes
        if (newTimeLeft === 0) {
          playEndSound();
          setPhase('finished');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, timeLeft]);

  useEffect(() => {
    if (phase === 'finished') {
      hasCompleted.current = false; // user must now submit their score manually
    }
  }, [phase]);

  const startTimer = () => {
    setPhase('countdown');
    setCountdown(3);
    playCountdownSound();
    hasCompleted.current = false; // reset for new challenge
    setTimeLeft(60);
    setManualScore('');
    setScoreSubmitted(false);
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
            <Button variant="outline" size="icon" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Camera Recording Section */}
          <CameraRecording
            isRecording={isRecording}
            onStartRecording={() => setIsRecording(true)}
            onStopRecording={() => setIsRecording(false)}
            timerPhase={phase}
          />

          {phase === 'ready' && <TimerControls onStartTimer={startTimer} />}
          
          {(phase === 'countdown' || phase === 'active') && (
            <TimerDisplay 
              phase={phase} 
              countdown={countdown} 
              timeLeft={timeLeft} 
            />
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


import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Timer, Plus, Minus, X } from "lucide-react";

interface TimerComponentProps {
  onComplete: (reps: number) => void;
  onCancel: () => void;
  exerciseName: string;
}

export const TimerComponent = ({ onComplete, onCancel, exerciseName }: TimerComponentProps) => {
  const [phase, setPhase] = useState<'ready' | 'countdown' | 'active' | 'finished'>('ready');
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [reps, setReps] = useState(0);
  const hasCompleted = useRef(false);

  // Create audio context and sounds
  const createBeepSound = (frequency: number, duration: number) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const playCountdownSound = () => createBeepSound(800, 0.2);
  const playStartSound = () => createBeepSound(1000, 0.5);
  const playWarningSound = () => createBeepSound(600, 0.3);
  const playEndSound = () => createBeepSound(400, 1.0);

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

  // Automatically submit score on finish
  useEffect(() => {
    if (phase === 'finished' && !hasCompleted.current) {
      hasCompleted.current = true;
      onComplete(reps);
    }
  }, [phase, reps, onComplete]);

  const startTimer = () => {
    setPhase('countdown');
    setCountdown(3);
    playCountdownSound();
    hasCompleted.current = false; // reset when new challenge starts
    setReps(0);
    setTimeLeft(60);
  };

  const incrementReps = () => {
    setReps(reps + 1);
  };

  const decrementReps = () => {
    if (reps > 0) {
      setReps(reps - 1);
    }
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-500">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-6 h-6" />
              {exerciseName} - Timer Challenge
            </CardTitle>
            <Button variant="outline" size="icon" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {phase === 'ready' && (
            <div className="text-center space-y-4">
              <div className="text-6xl">⚽</div>
              <h2 className="text-2xl font-bold">Ready to start?</h2>
              <p className="text-gray-600">You'll have 1 minute to do as many reps as possible!</p>
              <p className="text-sm text-gray-500">
                There will be a 3-second countdown before the timer starts.
              </p>
              <Button size="lg" onClick={startTimer} className="text-lg px-8 py-3">
                <Timer className="w-5 h-5 mr-2" />
                Start Challenge
              </Button>
            </div>
          )}

          {phase === 'countdown' && (
            <div className="text-center space-y-4">
              <div className="text-8xl font-bold text-blue-600 animate-pulse">
                {countdown}
              </div>
              <h2 className="text-xl font-semibold">Get Ready!</h2>
            </div>
          )}

          {phase === 'active' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className={`text-6xl font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-blue-600'}`}>
                  {formatTime(timeLeft)}
                </div>
                <p className="text-lg text-gray-600">Time Remaining</p>
              </div>

              <div className="text-center space-y-4">
                <Label className="text-lg">Count Your Reps</Label>
                <div className="flex items-center justify-center gap-4">
                  <Button size="icon" onClick={decrementReps} variant="outline">
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="text-4xl font-bold bg-gray-100 px-6 py-2 rounded-lg min-w-[100px]">
                    {reps}
                  </div>
                  <Button size="icon" onClick={incrementReps}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500">Tap + for each rep you complete</p>
              </div>
            </div>
          )}

          {phase === 'finished' && (
            <div className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <h2 className="text-2xl font-bold">Time's Up!</h2>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-lg text-gray-600">You completed</p>
                <div className="text-4xl font-bold text-blue-600">{reps}</div>
                <p className="text-lg text-gray-600">reps!</p>
              </div>
              {/* Action buttons are removed; the score is auto-saved */}
              <p className="text-gray-500 text-sm italic">Your score was automatically saved.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

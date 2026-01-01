
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Timer, Save, Loader2 } from "lucide-react";

interface ExerciseControlsProps {
  onStartTimer: () => void;
  onSaveManualScore: (score: number) => Promise<void>;
  isSaving?: boolean;
}

const MAX_REALISTIC_SCORE = 500;
const MIN_SCORE = 1;

export const ExerciseControls = ({ onStartTimer, onSaveManualScore, isSaving = false }: ExerciseControlsProps) => {
  const [manualReps, setManualReps] = useState('');
  const [error, setError] = useState('');

  const validateScore = (value: string): boolean => {
    const numValue = Number(value);

    if (!value || value === '0') {
      setError('');
      return false;
    }

    if (numValue < MIN_SCORE) {
      setError('Score must be at least 1');
      return false;
    }

    if (numValue > MAX_REALISTIC_SCORE) {
      setError(`Score seems too high. Maximum is ${MAX_REALISTIC_SCORE}`);
      return false;
    }

    setError('');
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/, ''); // Only numbers

    // Limit to 3 digits (max 500)
    if (value.length <= 3) {
      setManualReps(value);
      validateScore(value);
    }
  };

  const handleManualSave = async () => {
    if (validateScore(manualReps)) {
      const score = parseInt(manualReps);
      await onSaveManualScore(score);
      setManualReps('');
      setError('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Test Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            1-Minute Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Test your skills! See how many reps you can do in 1 minute.
          </p>
          <Button 
            onClick={onStartTimer}
            className="w-full"
            size="lg"
          >
            <Timer className="w-4 h-4 mr-2" />
            Start Timer Challenge
          </Button>
        </CardContent>
      </Card>

      {/* Manual Entry */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="w-5 h-5" />
            Record Your Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reps">Number of Reps</Label>
              <Input
                id="reps"
                type="number"
                placeholder="Enter reps..."
                value={manualReps}
                onChange={handleInputChange}
                min={MIN_SCORE}
                max={MAX_REALISTIC_SCORE}
                inputMode="numeric"
                className={`h-12 text-base ${error ? 'border-red-500' : ''}`}
                aria-invalid={!!error}
                aria-describedby={error ? "reps-error" : undefined}
              />
              {error && (
                <p id="reps-error" className="text-red-600 text-xs mt-1" role="alert">
                  {error}
                </p>
              )}
            </div>
            <Button
              onClick={handleManualSave}
              disabled={!manualReps || !!error || isSaving}
              className="w-full h-12 text-base"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Score
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

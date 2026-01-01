
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

export const ExerciseControls = ({ onStartTimer, onSaveManualScore, isSaving = false }: ExerciseControlsProps) => {
  const [manualReps, setManualReps] = useState('');

  const handleManualSave = async () => {
    const score = parseInt(manualReps);
    if (score > 0) {
      await onSaveManualScore(score);
      setManualReps('');
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
                onChange={(e) => setManualReps(e.target.value)}
                min="0"
              />
            </div>
            <Button
              onClick={handleManualSave}
              disabled={!manualReps || parseInt(manualReps) <= 0 || isSaving}
              className="w-full"
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

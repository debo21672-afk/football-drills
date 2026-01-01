
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ScoreInputProps {
  onSubmit: (score: number) => void;
  scoreSubmitted: boolean;
  submittedScore?: string;
}

const MAX_REALISTIC_SCORE = 500;
const MIN_SCORE = 1;

export const ScoreInput = ({ onSubmit, scoreSubmitted, submittedScore }: ScoreInputProps) => {
  const [manualScore, setManualScore] = useState('');
  const [error, setError] = useState('');

  const validateScore = (value: string): boolean => {
    const numValue = Number(value);

    if (!value || value === '0') {
      setError('Please enter a score');
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

  const handleScoreInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/, ''); // Only numbers

    // Limit to 3 digits (max 500)
    if (value.length <= 3) {
      setManualScore(value);
      if (value) {
        validateScore(value);
      } else {
        setError('');
      }
    }
  };

  const handleScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateScore(manualScore)) {
      onSubmit(Number(manualScore));
    }
  };

  return (
    <div className="text-center space-y-3">
      <div className="text-4xl">🎉</div>
      <h2 className="text-xl font-bold">Time's Up!</h2>
      {!scoreSubmitted ? (
        <form onSubmit={handleScoreSubmit} className="max-w-xs mx-auto space-y-3">
          <div className="bg-blue-50 rounded-lg p-4">
            <Label htmlFor="score-input" className="block mb-2 text-sm text-gray-700">Enter your score</Label>
            <Input
              id="score-input"
              type="number"
              min={MIN_SCORE}
              max={MAX_REALISTIC_SCORE}
              inputMode="numeric"
              value={manualScore}
              onChange={handleScoreInput}
              className={`w-full text-center text-lg h-12 ${error ? 'border-red-500' : ''}`}
              placeholder="0"
              autoFocus
              disabled={scoreSubmitted}
              aria-invalid={!!error}
              aria-describedby={error ? "score-error" : undefined}
            />
            {error && (
              <p id="score-error" className="text-red-600 text-xs mt-2 text-center" role="alert">
                {error}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={!manualScore || !!error || scoreSubmitted}
          >
            Save Score
          </Button>
        </form>
      ) : (
        <div>
          <div className="bg-blue-50 rounded-lg p-3 mb-3">
            <p className="text-sm text-gray-600">You entered</p>
            <div className="text-2xl font-bold text-blue-600">{submittedScore}</div>
            <p className="text-sm text-gray-600">reps!</p>
          </div>
          <p className="text-gray-500 text-xs italic">Your score was saved.</p>
        </div>
      )}
    </div>
  );
};


import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ScoreInputProps {
  onSubmit: (score: number) => void;
  scoreSubmitted: boolean;
  submittedScore?: string;
}

export const ScoreInput = ({ onSubmit, scoreSubmitted, submittedScore }: ScoreInputProps) => {
  const [manualScore, setManualScore] = useState('');

  const handleScoreInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/, ''); // Only numbers
    setManualScore(value);
  };

  const handleScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualScore || Number(manualScore) <= 0) return;
    onSubmit(Number(manualScore));
  };

  return (
    <div className="text-center space-y-3">
      <div className="text-4xl">🎉</div>
      <h2 className="text-xl font-bold">Time's Up!</h2>
      {!scoreSubmitted ? (
        <form onSubmit={handleScoreSubmit} className="max-w-xs mx-auto space-y-3">
          <div className="bg-blue-50 rounded-lg p-3">
            <Label htmlFor="score-input" className="block mb-2 text-sm text-gray-700">Enter your score</Label>
            <Input
              id="score-input"
              type="number"
              min={1}
              max={9999}
              inputMode="numeric"
              value={manualScore}
              onChange={handleScoreInput}
              className="w-full text-center text-lg"
              autoFocus
              disabled={scoreSubmitted}
            />
          </div>
          <Button type="submit" className="w-full" disabled={!manualScore || Number(manualScore) <= 0 || scoreSubmitted}>
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

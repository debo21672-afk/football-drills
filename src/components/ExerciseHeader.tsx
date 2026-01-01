
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy } from "lucide-react";

interface ExerciseHeaderProps {
  levelId: string;
  exerciseName: string;
  exerciseDescription: string;
  bestScore: number | null;
}

export const ExerciseHeader = ({ levelId, exerciseName, exerciseDescription, bestScore }: ExerciseHeaderProps) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      <Link to={`/level/${levelId}`}>
        <Button variant="outline" size="icon" aria-label="Back to level">
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </Link>
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{exerciseName}</h1>
        <p className="text-gray-600">{exerciseDescription}</p>
      </div>
      {bestScore && (
        <Badge className="ml-auto bg-yellow-500 text-white text-lg p-2">
          <Trophy className="w-4 h-4 mr-1" />
          Best: {bestScore}
        </Badge>
      )}
    </div>
  );
};

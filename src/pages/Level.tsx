import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Trophy, Target } from "lucide-react";
import { allExercises } from '@/data/exercises';
import { getProgress } from '@/utils/progressUtils';

interface Exercise {
  id: string;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

// Derive difficulty based on exercise position within level
const getExerciseDifficulty = (exerciseNum: number, totalExercises: number): 'Easy' | 'Medium' | 'Hard' => {
  const position = exerciseNum / totalExercises;
  if (position <= 0.33) return 'Easy';
  if (position <= 0.66) return 'Medium';
  return 'Hard';
};

const Level = () => {
  const { levelId } = useParams();
  const [bestScores, setBestScores] = useState<{ [exerciseId: string]: number }>({});
  const levelNum = parseInt(levelId || '1');

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const progress = getProgress();
    const levelProgress = progress[levelNum];
    if (levelProgress) {
      setBestScores(levelProgress.bestScores || {});
    }
  }, [levelNum]);

  // Generate exercises for this level using centralized data
  const exercises = useMemo(() => {
    const exercisesForLevel: Exercise[] = [];
    const exerciseCount = levelNum % 2 === 0 ? 7 : 8;

    for (let i = 1; i <= exerciseCount; i++) {
      const exerciseId = `${levelNum}-${i}`;
      const exerciseData = allExercises[exerciseId];

      if (exerciseData) {
        exercisesForLevel.push({
          id: exerciseId,
          name: exerciseData.name,
          description: exerciseData.description,
          difficulty: getExerciseDifficulty(i, exerciseCount)
        });
      }
    }

    return exercisesForLevel;
  }, [levelNum]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-orange-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Level {levelNum}</h1>
            <p className="text-gray-600">
              {levelNum <= 3 ? 'Beginner' : levelNum <= 6 ? 'Intermediate' : levelNum <= 8 ? 'Advanced' : 'Expert'} Ball Mastery Skills
            </p>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold mb-2">Your Progress</h2>
              <p className="text-gray-600">{Object.keys(bestScores).length}/{exercises.length} exercises completed</p>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span className="text-2xl font-bold">{Object.keys(bestScores).length}</span>
            </div>
          </div>
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <Link key={exercise.id} to={`/exercise/${exercise.id}`}>
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-primary">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={`${getDifficultyColor(exercise.difficulty)} text-white`}>
                      {exercise.difficulty}
                    </Badge>
                    {bestScores[exercise.id] && (
                      <Badge variant="secondary">
                        <Trophy className="w-3 h-3 mr-1" />
                        {bestScores[exercise.id]}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{exercise.name}</CardTitle>
                  <p className="text-sm text-gray-600">{exercise.description}</p>
                </CardHeader>
                
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Best: {bestScores[exercise.id] || 'Not attempted'}
                      </span>
                    </div>
                    <Play className="w-5 h-5 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Level;

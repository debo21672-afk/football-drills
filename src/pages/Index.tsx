import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Play } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface LevelProgress {
  levelId: number;
  completedExercises: number;
  totalExercises: number;
  bestScores: { [exerciseId: string]: number };
}

const Index = () => {
  const [progress, setProgress] = useState<{ [levelId: number]: LevelProgress }>({});
  const location = useLocation();

  useEffect(() => {
    const savedProgress = localStorage.getItem('footballAppProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    // Restore scroll position when coming back to index page
    const savedScrollPosition = sessionStorage.getItem('indexScrollPosition');
    if (savedScrollPosition && location.pathname === '/') {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition));
      }, 0);
    }
  }, [location.pathname]);

  const handleLevelClick = () => {
    // Save current scroll position before navigating
    sessionStorage.setItem('indexScrollPosition', window.scrollY.toString());
  };

  const levels = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Level ${i + 1}`,
    description: `Ball mastery skills - ${i === 0 ? 'Beginner' : i < 3 ? 'Basic' : i < 6 ? 'Intermediate' : i < 8 ? 'Advanced' : 'Expert'}`,
    exerciseCount: i % 2 === 0 ? 7 : 8,
    color: i < 3 ? 'bg-green-500' : i < 6 ? 'bg-blue-500' : i < 8 ? 'bg-orange-500' : 'bg-red-500'
  }));

  const getLevelProgress = (levelId: number) => {
    return progress[levelId] || { levelId, completedExercises: 0, totalExercises: levels.find(l => l.id === levelId)?.exerciseCount || 7, bestScores: {} };
  };

  const getTotalStars = () => {
    return Object.values(progress).reduce((total, level) => total + level.completedExercises, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <span className="text-6xl">⚽</span>
            Football Skills Training
          </h1>
          <p className="text-lg text-gray-600 mb-4">Master your ball skills with fun exercises and challenges!</p>
          
          <div className="flex justify-center items-center gap-4 mb-6">
            <Badge variant="secondary" className="text-lg p-2">
              <Trophy className="w-5 h-5 mr-2" />
              {getTotalStars()} Stars Earned
            </Badge>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-12 bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">How to Play</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl mb-2">📹</div>
              <h3 className="font-semibold mb-2">Watch & Learn</h3>
              <p className="text-gray-600">Watch the exercise video to learn the proper technique</p>
            </div>
            <div>
              <div className="text-4xl mb-2">⏱️</div>
              <h3 className="font-semibold mb-2">Test Mode</h3>
              <p className="text-gray-600">Take the 1-minute challenge to see how many reps you can do</p>
            </div>
            <div>
              <div className="text-4xl mb-2">🏆</div>
              <h3 className="font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">Record your scores and watch yourself improve!</p>
            </div>
          </div>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {levels.map((level) => {
            const levelProgress = getLevelProgress(level.id);
            const completionPercentage = (levelProgress.completedExercises / level.exerciseCount) * 100;
            
            return (
              <Link key={level.id} to={`/level/${level.id}`} onClick={handleLevelClick}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-primary">
                  <CardHeader className="pb-3">
                    <div className={`w-16 h-16 rounded-full ${level.color} flex items-center justify-center mb-2 mx-auto`}>
                      <span className="text-2xl font-bold text-white">{level.id}</span>
                    </div>
                    <CardTitle className="text-center text-lg">{level.name}</CardTitle>
                    <p className="text-sm text-gray-600 text-center">{level.description}</p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium">{levelProgress.completedExercises}/{level.exerciseCount}</span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${level.color}`}
                          style={{ width: `${completionPercentage}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">{levelProgress.completedExercises} earned</span>
                        </div>
                        <Play className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;

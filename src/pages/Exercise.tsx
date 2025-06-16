import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TimerComponent } from '@/components/TimerComponent';
import { ExerciseHeader } from '@/components/ExerciseHeader';
import { ExerciseVideo } from '@/components/ExerciseVideo';
import { ExerciseControls } from '@/components/ExerciseControls';
import { toast } from "@/hooks/use-toast";

const exerciseVideos: { [key: string]: string } = {
  "1-1": "6wZurRCJIXo",
  "1-2": "jOZ5hivPMwE", 
  "1-3": "paeIZJNfIw8",
  "1-4": "TnK6aXlbx9c",
  "1-5": "AsHdDDaCM3M",
  "1-6": "UrNuQx9Oslw",
  "1-7": "6X9dqpmaFw0",
  "8-1": "pZ8iGPw3c0Y",
  "8-2": "VMnDtnJJSMI",
  "8-3": "OsxLeSU_8gs",
  "8-4": "ycIuocLGlAc",
  "8-5": "Ui-kIJ8pMys",
  "8-6": "oGNnlzIYP-Q",
  "8-7": "PLZOyRwBth8",
  "9-1": "98-tu50f_QQ",
  "9-2": "CKOOaG7vJi8",
  "9-3": "FidOlZhrgu0",
  "9-4": "OfmG0jGRh0Q",
  "9-5": "GIfx7k7UNMA",
  "9-6": "t4fdMdRjyVQ",
  "9-7": "Mry1NmiArv4",
};

const Exercise = () => {
  const { exerciseId } = useParams();
  const [isTestMode, setIsTestMode] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);

  useEffect(() => {
    const savedProgress = localStorage.getItem('footballAppProgress');
    if (savedProgress && exerciseId) {
      const progress = JSON.parse(savedProgress);
      const [levelId] = exerciseId.split('-');
      const levelProgress = progress[parseInt(levelId)];
      if (levelProgress && levelProgress.bestScores[exerciseId]) {
        setBestScore(levelProgress.bestScores[exerciseId]);
      }
    }
  }, [exerciseId]);

  const saveScore = (score: number) => {
    if (!exerciseId) return;

    const [levelId] = exerciseId.split('-');
    const savedProgress = localStorage.getItem('footballAppProgress');
    const progress = savedProgress ? JSON.parse(savedProgress) : {};
    
    if (!progress[parseInt(levelId)]) {
      progress[parseInt(levelId)] = {
        levelId: parseInt(levelId),
        completedExercises: 0,
        totalExercises: 7,
        bestScores: {}
      };
    }

    const isNewBest = !bestScore || score > bestScore;
    const wasFirstTime = !progress[parseInt(levelId)].bestScores[exerciseId];

    progress[parseInt(levelId)].bestScores[exerciseId] = Math.max(score, bestScore || 0);
    progress[parseInt(levelId)].completedExercises = Object.keys(progress[parseInt(levelId)].bestScores).length;

    localStorage.setItem('footballAppProgress', JSON.stringify(progress));
    setBestScore(Math.max(score, bestScore || 0));

    if (wasFirstTime) {
      toast({
        title: "🏆 Exercise Completed!",
        description: `You scored ${score} reps! Keep practicing to improve.`,
      });
    } else if (isNewBest) {
      toast({
        title: "🎉 New Personal Best!",
        description: `Amazing! You beat your previous score with ${score} reps!`,
      });
    } else {
      toast({
        title: "Score Saved!",
        description: `You scored ${score} reps. Your best is still ${bestScore}.`,
      });
    }
  };

  const handleTimerComplete = (reps: number) => {
    setIsTestMode(false);
    saveScore(reps);
  };

  const getExerciseInfo = () => {
    if (!exerciseId) return null;
    
    const exercises = {
      '1-1': { name: 'Toe Taps', description: 'Quick toe touches on top of the ball' },
      '1-2': { name: 'Inside Touch', description: 'Touch ball with inside of both feet alternately' },
      '1-3': { name: 'Outside Touch', description: 'Touch ball with outside of both feet' },
      '1-4': { name: 'Sole Rolls', description: 'Roll ball forward and backward with sole' },
      '1-5': { name: 'Pull Back', description: 'Pull ball back with sole and push forward' },
      '1-6': { name: 'L-Shape', description: 'Inside touch followed by forward push' },
      '1-7': { name: 'Foundation', description: 'Combination of basic touches' },
      '9-1': { name: 'Level 9 Exercise 1', description: 'Advanced ball mastery exercise' },
      '9-2': { name: 'Level 9 Exercise 2', description: 'Advanced ball mastery exercise' },
      '9-3': { name: 'Level 9 Exercise 3', description: 'Advanced ball mastery exercise' },
      '9-4': { name: 'Level 9 Exercise 4', description: 'Advanced ball mastery exercise' },
      '9-5': { name: 'Level 9 Exercise 5', description: 'Advanced ball mastery exercise' },
      '9-6': { name: 'Level 9 Exercise 6', description: 'Advanced ball mastery exercise' },
      '9-7': { name: 'Level 9 Exercise 7', description: 'Advanced ball mastery exercise' },
    };

    return exercises[exerciseId as keyof typeof exercises] || { 
      name: 'Exercise', 
      description: 'Ball mastery exercise' 
    };
  };

  const exerciseInfo = getExerciseInfo();
  const [levelId] = (exerciseId || '1-1').split('-');

  if (!exerciseInfo) {
    return <div>Exercise not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <ExerciseHeader
          levelId={levelId}
          exerciseName={exerciseInfo.name}
          exerciseDescription={exerciseInfo.description}
          bestScore={bestScore}
        />

        <div className="space-y-6">
          <ExerciseVideo
            exerciseId={exerciseId || ""}
            exerciseVideos={exerciseVideos}
          />

          {/* Show Timer or Controls based on test mode */}
          {isTestMode ? (
            <TimerComponent
              onComplete={handleTimerComplete}
              onCancel={() => setIsTestMode(false)}
              exerciseName={exerciseInfo.name}
            />
          ) : (
            <ExerciseControls
              onStartTimer={() => setIsTestMode(true)}
              onSaveManualScore={saveScore}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Exercise;

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
      '1-1': { name: 'Toe Taps', description: 'Keeping the ball stationary, tap the top of the ball with the soles of both feet' },
      '1-2': { name: 'Bell Taps', description: 'Transfer ball from side to side in a "bell ringing" motion, using the inside of both feet' },
      '1-3': { name: 'Inside Outside', description: 'Move the ball between both feet using the inside and outside of the foot' },
      '1-4': { name: 'Rocking Sole', description: 'Rock the ball from side to side using the sole of the foot' },
      '1-5': { name: 'Sole Rolls', description: 'Transfer the ball from one foot to the other by rolling the foot over the ball' },
      '1-6': { name: 'Sole Inside Push', description: 'Trap the ball underneath the foot and roll foot outwards to push ball across with the inside of foot' },
      '1-7': { name: 'Brazilian Trap', description: 'Roll the ball across the body then trap the ball with the opposite sole of the foot behind standing leg' },
      '2-1': { name: 'Single Leg Inside Outside', description: 'Hop on your standing leg, moving the ball side to side using the inside and outside of the foot' },
      '2-2': { name: 'No Touch Stepovers', description: 'Keeping the ball still, step around the ball with both feet' },
      '2-3': { name: 'Brazilian Taps', description: 'Tap the ball with both soles followed by a third touch behind the standing leg' },
      '2-4': { name: '3 Point Push Pulls', description: 'Push the ball to the inside, centre and outside using the toe and pulling back with the sole' },
      '2-5': { name: 'Squares', description: 'Using the sole and inside of both feet, move the ball in a square shaped pattern' },
      '2-6': { name: 'Single Leg V Cuts', description: 'Using one foot at a time, create a V shape by pushing the ball to the inside and outside' },
      '2-7': { name: 'V Cuts', description: 'Create a V pattern, this time using both feet, changing feet each time' },
      '8-1': { name: 'Inside Out', description: 'Move the ball from inside to outside of the foot to improve lateral quickness and ball control.' },
      '8-2': { name: 'Sole Outside (V)', description: 'Use the sole to roll the ball back and then push outside in a V shape for change of direction.' },
      '8-3': { name: 'Inside Inside', description: 'Alternate touches with the inside of both feet, focusing on close control.' },
      '8-4': { name: 'Roll Inside', description: 'Roll the ball with the sole and tap inside to train foot dexterity.' },
      '8-5': { name: 'Single Sole Outside', description: 'Use only one foot\'s sole to roll and then push outside, isolating control to one side.' },
      '8-6': { name: 'Single Slide', description: 'Slide the ball sideways using one foot, keeping the ball under close control.' },
      '8-7': { name: 'Single Foot Roll Outside', description: 'Roll the ball then push outside with the same foot, combining rolling and lateral movement.' },
      '9-1': { name: 'Inside Out', description: 'Move the ball from inside to outside of the foot to improve lateral quickness and ball control.' },
      '9-2': { name: 'Roll Inside', description: 'Roll the ball with the sole and tap inside to train foot dexterity and close control.' },
      '9-3': { name: 'Sole Outside (V)', description: 'Use the sole to roll the ball back and then push outside in a V shape for change of direction.' },
      '9-4': { name: 'Inside Inside', description: 'Alternate touches with the inside of both feet, focusing on close control and rhythm.' },
      '9-5': { name: 'Slide (Chop Inside)', description: 'Quick lateral movement with the inside of the foot, chopping the ball to change direction.' },
      '9-6': { name: 'Single Sole Role (V)', description: 'Roll the ball with the sole in a V pattern using only one foot for enhanced control.' },
      '9-7': { name: 'Sole-Sole Outside', description: 'Combine sole touches with outside foot movements for advanced ball manipulation.' },
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

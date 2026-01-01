import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TimerComponent } from '@/components/TimerComponent';
import { ExerciseHeader } from '@/components/ExerciseHeader';
import { ExerciseVideo } from '@/components/ExerciseVideo';
import { ExerciseControls } from '@/components/ExerciseControls';
import { SessionSummary } from '@/components/SessionSummary';
import { toast } from "@/hooks/use-toast";
import { exerciseVideoMap, allExercises } from '@/data/exercises';
import { getProgress, saveProgress, addSession } from '@/utils/progressUtils';
import { useAuth } from '@/hooks/useAuth';
import { useCloudProgress } from '@/hooks/useCloudProgress';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

const Exercise = () => {
  const { exerciseId } = useParams();
  const [isTestMode, setIsTestMode] = useState(false);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [lastScore, setLastScore] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const { user } = useAuth();
  const { saveScore: saveCloudScore, getBestScore } = useCloudProgress();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    const loadBestScore = async () => {
      if (!exerciseId) return;
      
      if (user) {
        const cloudBest = await getBestScore(exerciseId);
        setBestScore(cloudBest);
      } else {
        const progress = getProgress();
        const [levelId] = exerciseId.split('-');
        const levelProgress = progress[parseInt(levelId)];
        if (levelProgress && levelProgress.bestScores[exerciseId]) {
          setBestScore(levelProgress.bestScores[exerciseId]);
        }
      }
    };
    
    loadBestScore();
  }, [exerciseId, user, getBestScore]);

  const saveScore = async (score: number, duration: number = 60) => {
    if (!exerciseId) return;

    // Check if offline and trying to save to cloud
    if (user && !isOnline) {
      toast({
        title: "📡 You're offline",
        description: "Your score cannot be saved to the cloud. Please reconnect to save your progress.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const isNewBest = !bestScore || score > bestScore;
      const wasFirstTime = !bestScore;

      if (user) {
        // Save to cloud
        const result = await saveCloudScore(exerciseId, score);

        if (!result.success) {
          toast({
            title: "❌ Failed to Save Score",
            description: result.error?.message || "Check your connection and try again. Your score was not saved.",
            variant: "destructive"
          });
          return; // Don't show summary if save failed
        }
      } else {
        // Save to localStorage
        const [levelId] = exerciseId.split('-');
        const progress = getProgress();

        if (!progress[parseInt(levelId)]) {
          progress[parseInt(levelId)] = {
            levelId: parseInt(levelId),
            completedExercises: 0,
            totalExercises: 7,
            bestScores: {},
            attempts: {}
          };
        }

        progress[parseInt(levelId)].bestScores[exerciseId] = Math.max(score, bestScore || 0);
        progress[parseInt(levelId)].completedExercises = Object.keys(progress[parseInt(levelId)].bestScores).length;
        saveProgress(progress);
        addSession(exerciseId, score, duration);
      }

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

      // Show summary modal
      setLastScore(score);
      setShowSummary(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTimerComplete = (reps: number) => {
    setIsTestMode(false);
    saveScore(reps);
  };

  const handleRetry = () => {
    setShowSummary(false);
    setIsTestMode(true);
  };

  const getExerciseInfo = () => {
    if (!exerciseId) return null;
    
    const exercise = allExercises[exerciseId];
    return exercise || { 
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
            exerciseVideos={exerciseVideoMap}
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
              isSaving={isSaving}
            />
          )}
        </div>
      </div>

      {/* Session Summary Modal */}
      {showSummary && exerciseId && (
        <SessionSummary
          exerciseId={exerciseId}
          currentScore={lastScore}
          onClose={() => setShowSummary(false)}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
};

export default Exercise;

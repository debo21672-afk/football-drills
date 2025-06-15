
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft, Play, Timer, Trophy, Save } from "lucide-react";
import { TimerComponent } from '@/components/TimerComponent';
import { toast } from "@/hooks/use-toast";

const exerciseVideos: { [key: string]: string } = {
  "8-1": "pZ8iGPw3c0Y",
  "8-2": "VMnDtnJJSMI",
  "8-3": "OsxLeSU_8gs",
  "8-4": "ycIuocLGlAc",
  "8-5": "Ui-kIJ8pMys",
  "8-6": "oGNnlzIYP-Q",
  "8-7": "PLZOyRwBth8",
};

const Exercise = () => {
  const { exerciseId } = useParams();
  const [isTestMode, setIsTestMode] = useState(false);
  const [manualReps, setManualReps] = useState('');
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [timerReps, setTimerReps] = useState(0);

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
        totalExercises: 7, // Will be updated properly
        bestScores: {}
      };
    }

    const isNewBest = !bestScore || score > bestScore;
    const wasFirstTime = !progress[parseInt(levelId)].bestScores[exerciseId];

    progress[parseInt(levelId)].bestScores[exerciseId] = Math.max(score, bestScore || 0);
    
    // Count completed exercises
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

  const handleManualSave = () => {
    const score = parseInt(manualReps);
    if (score > 0) {
      saveScore(score);
      setManualReps('');
    }
  };

  const handleTimerComplete = (reps: number) => {
    setIsTestMode(false);
    setTimerReps(reps);
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
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to={`/level/${levelId}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{exerciseInfo.name}</h1>
            <p className="text-gray-600">{exerciseInfo.description}</p>
          </div>
          {bestScore && (
            <Badge className="ml-auto bg-yellow-500 text-white text-lg p-2">
              <Trophy className="w-4 h-4 mr-1" />
              Best: {bestScore}
            </Badge>
          )}
        </div>

        <div className="space-y-6">
          {/* Video Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Exercise Video
              </CardTitle>
            </CardHeader>
            <CardContent>
              {exerciseVideos[exerciseId || ""] ? (
                <div className="aspect-video bg-black rounded-lg flex items-center justify-center border-2 border-primary mb-4">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${exerciseVideos[exerciseId || ""]}?autoplay=1&loop=1&playlist=${exerciseVideos[exerciseId || ""]}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-400">
                  <div className="text-center">
                    <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">YouTube Video Placeholder</p>
                    <p className="text-sm text-gray-500">Video ID: {exerciseId}-tutorial</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Controls */}
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
                  onClick={() => setIsTestMode(true)}
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
                    disabled={!manualReps || parseInt(manualReps) <= 0}
                    className="w-full"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Score
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Timer Modal */}
        <Dialog open={isTestMode} onOpenChange={setIsTestMode}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <TimerComponent
              onComplete={handleTimerComplete}
              onCancel={() => setIsTestMode(false)}
              exerciseName={exerciseInfo.name}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Exercise;

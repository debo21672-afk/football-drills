
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
      '3-1': { name: 'Sole Rolls', description: 'Roll the ball between the cones from one foot to the other using the sole of the foot.' },
      '3-2': { name: 'Nutmegs', description: 'Pull ball towards back and push through the cones using the outside of the foot. Repeat both sides.' },
      '3-3': { name: 'Upside Down U', description: 'Push ball forward with inside of the foot, sole roll through the cones and pull back with the sole.' },
      '3-4': { name: 'Forwards Infinity', description: 'Draw an Infinity symbol (figure of 8) with the ball around the cones with the sole and inside of both feet.' },
      '3-5': { name: 'V Cut Triangle', description: 'Perform an Inside Foot V Cut and Sole Roll the ball through the cones and repeat.' },
      '3-6': { name: 'L Drag Triangle', description: 'Perform the L Drag and double Sole Roll the ball through the cones to repeat on opposite foot.' },
      '3-7': { name: 'L Drag V Cut Triangle', description: 'Perform the L Drag followed by the Alternate V Cut and Sole Roll the ball through the cones.' },
      '4-1': { name: 'L Drag Sole Roll', description: 'Perform an L Drag followed by a Sole Roll across the body to repeat the move' },
      '4-2': { name: 'Inside Touch Stepover Outside Touch', description: 'Touch the ball with the inside of the foot, step over the ball, take an outside foot touch then repeat' },
      '4-3': { name: 'Sole Laces', description: 'Using the sole, drag the ball backwards and catch the ball with your laces to push forwards' },
      '4-4': { name: 'Reverse L Drag L Drag', description: 'Roll the ball behind standing leg and push forwards with the same foot, then L Drag to repeat' },
      '4-5': { name: 'Reverse L Drag Pivot', description: 'Perform a reverse L Drag while pivoting on the standing leg to retrieve the ball and repeat' },
      '4-6': { name: 'Double Reverse L Drag', description: 'Perform a Reverse L Drag, switching feet mid move to repeat on the opposite side' },
      '4-7': { name: 'Infinity Stepovers', description: 'Touch the ball gently with the inside of the foot, step around ball with opposite foot and repeat' },
      '5-1': { name: 'Outside Cuts', description: 'Using the outside of your foot, cut sharply alternating feet each time' },
      '5-2': { name: 'The Cruyff', description: 'Using the inside of the foot, hook the ball behind the opposite leg and repeat both sides' },
      '5-3': { name: 'Half Maradona', description: 'Drag the ball towards you with your sole, hop and exchange feet and roll 90 degrees.' },
      '5-4': { name: 'The Ronaldinho', description: 'Sole roll the ball across body and stop with back foot, then drag away and push forward' },
      '5-5': { name: 'Sole Cruyff', description: 'Pull ball towards you with the sole then Cruyff across body and repeat' },
      '5-6': { name: 'Fake Shot Sole Roll', description: 'Slightly flex leg to imitate a shooting motion then role ball across the body to opposite foot' },
      '5-7': { name: 'Fake Rabona', description: 'Bring leg behind opposite leg to fake a Robona, then cut the ball across and repeat' },
      '6-1': { name: 'Sole Sole Inside Inside', description: 'Perform a double sole roll followed immediately by double bell taps and repeat' },
      '6-2': { name: 'Outside Drag Toe Nudge', description: 'Drag the ball down the outside of your leg and nudge forwards using the toe of the same foot' },
      '6-3': { name: 'The Ronaldo', description: 'Roll the ball across, step over the ball with the opposite leg and catch with the laces of behind leg' },
      '6-4': { name: 'Rollover Snap', description: 'Roll your foot over the ball then snap the foot down to flick the ball in the opposite direction' },
      '6-5': { name: 'Stepover Sole Rolls', description: 'Roll the ball between the soles, stepping over the ball between each touch' },
      '6-6': { name: 'Inside Double Stepover Outside', description: 'Nudge the ball with the inside of the foot, stepover the ball with both feet then nudge with the outside of opposite foot' },
      '6-7': { name: 'Stepover Inside Inside', description: 'Step around the ball, hopping into an inside to inside touch' },
      '7-1': { name: 'Drag Pass', description: 'Use the sole of the foot to drag the ball towards the inside of opposite foot to tap the ball and repeat' },
      '7-2': { name: 'Roll Stepover Cut', description: 'Roll the ball with the sole of the foot, stepping over the ball and cutting with the inside of opposite foot' },
      '7-3': { name: 'Double Sole L Drag', description: 'Roll the ball twice across the body followed by an L Drag to repeat in the opposite direction' },
      '7-4': { name: 'L Drag to V Cut', description: 'Perform an L Drag, immediately followed by a V Cut' },
      '7-5': { name: 'Outside Nudge Stepover', description: 'Lightly nudge the ball with the outside of your foot then step over the ball with opposite foot' },
      '7-6': { name: 'Ronaldinho Fake Pass', description: 'Roll the ball back as if you were performing an L Drag but instead catch the ball with the laces' },
      '7-7': { name: 'Neymar Chop', description: 'Roll foot over the ball then as the ball rolls to the other side, chop behind the leg with the inside of opposite foot' },
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

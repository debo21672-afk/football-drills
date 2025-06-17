import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Trophy, Target } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  videoId: string; // YouTube video ID placeholder
}

const level2Exercises: Exercise[] = [
  {
    id: "2-1",
    name: "Single Leg Inside Outside",
    description: "Hop on your standing leg, moving the ball side to side using the inside and outside of the foot",
    difficulty: "Easy",
    videoId: "placeholder-2-1"
  },
  {
    id: "2-2",
    name: "No Touch Stepovers",
    description: "Keeping the ball still, step around the ball with both feet",
    difficulty: "Easy",
    videoId: "placeholder-2-2"
  },
  {
    id: "2-3",
    name: "Brazilian Taps",
    description: "Tap the ball with both soles followed by a third touch behind the standing leg",
    difficulty: "Medium",
    videoId: "placeholder-2-3"
  },
  {
    id: "2-4",
    name: "3 Point Push Pulls",
    description: "Push the ball to the inside, centre and outside using the toe and pulling back with the sole",
    difficulty: "Medium",
    videoId: "placeholder-2-4"
  },
  {
    id: "2-5",
    name: "Squares",
    description: "Using the sole and inside of both feet, move the ball in a square shaped pattern",
    difficulty: "Medium",
    videoId: "placeholder-2-5"
  },
  {
    id: "2-6",
    name: "Single Leg V Cuts",
    description: "Using one foot at a time, create a V shape by pushing the ball to the inside and outside",
    difficulty: "Hard",
    videoId: "placeholder-2-6"
  },
  {
    id: "2-7",
    name: "V Cuts",
    description: "Create a V pattern, this time using both feet, changing feet each time",
    difficulty: "Hard",
    videoId: "placeholder-2-7"
  },
];

const maestroExercises: Exercise[] = [
  {
    id: "1-1",
    name: "Toe Taps",
    description: "Keeping the ball stationary, tap the top of the ball with the soles of both feet",
    difficulty: "Easy",
    videoId: "placeholder-1-1"
  },
  {
    id: "1-2",
    name: "Bell Taps",
    description: "Transfer ball from side to side in a \"bell ringing\" motion, using the inside of both feet",
    difficulty: "Easy",
    videoId: "placeholder-1-2"
  },
  {
    id: "1-3",
    name: "Inside Outside",
    description: "Move the ball between both feet using the inside and outside of the foot",
    difficulty: "Easy",
    videoId: "placeholder-1-3"
  },
  {
    id: "1-4",
    name: "Rocking Sole",
    description: "Rock the ball from side to side using the sole of the foot",
    difficulty: "Easy",
    videoId: "placeholder-1-4"
  },
  {
    id: "1-5",
    name: "Sole Rolls",
    description: "Transfer the ball from one foot to the other by rolling the foot over the ball",
    difficulty: "Easy",
    videoId: "placeholder-1-5"
  },
  {
    id: "1-6",
    name: "Sole Inside Push",
    description: "Trap the ball underneath the foot and roll foot outwards to push ball across with the inside of foot",
    difficulty: "Medium",
    videoId: "placeholder-1-6"
  },
  {
    id: "1-7",
    name: "Brazilian Trap",
    description: "Roll the ball across the body then trap the ball with the opposite sole of the foot behind standing leg",
    difficulty: "Medium",
    videoId: "placeholder-1-7"
  },
];

const level3Exercises: Exercise[] = [
  {
    id: "3-1",
    name: "V Cut Exchange",
    description: "Perform a V cut by dragging the ball back with the sole of the inside of the opposite foot",
    difficulty: "Easy",
    videoId: "placeholder-3-1"
  },
  {
    id: "3-2",
    name: "Sole Roll Stop",
    description: "Using the sole of the foot, move the ball across the body, stopping with the opposite sole",
    difficulty: "Easy",
    videoId: "placeholder-3-2"
  },
  {
    id: "3-3",
    name: "Inside Touch Stepover",
    description: "Nudge the ball with the inside of your foot, step around the ball and repeat on opposite feet",
    difficulty: "Medium",
    videoId: "placeholder-3-3"
  },
  {
    id: "3-4",
    name: "Sole Roll Stepover",
    description: "Roll ball across your body using the sole, then perform an inside stopover with the opposite foot",
    difficulty: "Medium",
    videoId: "placeholder-3-4"
  },
  {
    id: "3-5",
    name: "L Drag Pivot",
    description: "Perform an L Drag, pivoting on your standing leg to repeat the move continuously",
    difficulty: "Medium",
    videoId: "placeholder-3-5"
  },
  {
    id: "3-6",
    name: "L Drag L Drag",
    description: "Perform the L Drag then switch feet to repay the move on the opposite side",
    difficulty: "Hard",
    videoId: "placeholder-3-6"
  },
  {
    id: "3-7",
    name: "Elastico Elastico",
    description: "Push the ball with the outside of the foot, then move foot around the ball to push back with the inside",
    difficulty: "Hard",
    videoId: "placeholder-3-7"
  }
];

const level4Exercises: Exercise[] = [
  {
    id: "4-1",
    name: "L Drag Sole Roll",
    description: "Perform an L Drag followed by a Sole Roll across the body to repeat the move",
    difficulty: "Easy",
    videoId: "placeholder-4-1"
  },
  {
    id: "4-2",
    name: "Inside Touch Stepover Outside Touch",
    description: "Touch the ball with the inside of the foot, step over the ball, take an outside foot touch then repeat",
    difficulty: "Medium",
    videoId: "placeholder-4-2"
  },
  {
    id: "4-3",
    name: "Sole Laces",
    description: "Using the sole, drag the ball backwards and catch the ball with your laces to push forwards",
    difficulty: "Medium",
    videoId: "placeholder-4-3"
  },
  {
    id: "4-4",
    name: "Reverse L Drag L Drag",
    description: "Roll the ball behind standing leg and push forwards with the same foot, then L Drag to repeat",
    difficulty: "Medium",
    videoId: "placeholder-4-4"
  },
  {
    id: "4-5",
    name: "Reverse L Drag Pivot",
    description: "Perform a reverse L Drag while pivoting on the standing leg to retrieve the ball and repeat",
    difficulty: "Medium",
    videoId: "placeholder-4-5"
  },
  {
    id: "4-6",
    name: "Double Reverse L Drag",
    description: "Perform a Reverse L Drag, switching feet mid move to repeat on the opposite side",
    difficulty: "Hard",
    videoId: "placeholder-4-6"
  },
  {
    id: "4-7",
    name: "Infinity Stepovers",
    description: "Touch the ball gently with the inside of the foot, step around ball with opposite foot and repeat",
    difficulty: "Hard",
    videoId: "placeholder-4-7"
  }
];

const level5Exercises: Exercise[] = [
  {
    id: "5-1",
    name: "Outside Cuts",
    description: "Using the outside of your foot, cut sharply alternating feet each time",
    difficulty: "Easy",
    videoId: "placeholder-5-1"
  },
  {
    id: "5-2",
    name: "The Cruyff",
    description: "Using the inside of the foot, hook the ball behind the opposite leg and repeat both sides",
    difficulty: "Medium",
    videoId: "placeholder-5-2"
  },
  {
    id: "5-3",
    name: "Half Maradona",
    description: "Drag the ball towards you with your sole, hop and exchange feet and roll 90 degrees.",
    difficulty: "Medium",
    videoId: "placeholder-5-3"
  },
  {
    id: "5-4",
    name: "The Ronaldinho",
    description: "Sole roll the ball across body and stop with back foot, then drag away and push forward",
    difficulty: "Hard",
    videoId: "placeholder-5-4"
  },
  {
    id: "5-5",
    name: "Sole Cruyff",
    description: "Pull ball towards you with the sole then Cruyff across body and repeat",
    difficulty: "Medium",
    videoId: "placeholder-5-5"
  },
  {
    id: "5-6",
    name: "Fake Shot Sole Roll",
    description: "Slightly flex leg to imitate a shooting motion then role ball across the body to opposite foot",
    difficulty: "Medium",
    videoId: "placeholder-5-6"
  },
  {
    id: "5-7",
    name: "Fake Rabona",
    description: "Bring leg behind opposite leg to fake a Robona, then cut the ball across and repeat",
    difficulty: "Hard",
    videoId: "placeholder-5-7"
  },
];

const level6Exercises: Exercise[] = [
  {
    id: "6-1",
    name: "Sole Sole Inside Inside",
    description: "Perform a double sole roll followed immediately by double bell taps and repeat",
    difficulty: "Medium",
    videoId: "placeholder-6-1"
  },
  {
    id: "6-2",
    name: "Outside Drag Toe Nudge",
    description: "Drag the ball down the outside of your leg and nudge forwards using the toe of the same foot",
    difficulty: "Medium",
    videoId: "placeholder-6-2"
  },
  {
    id: "6-3",
    name: "The Ronaldo",
    description: "Roll the ball across, step over the ball with the opposite leg and catch with the laces of behind leg",
    difficulty: "Hard",
    videoId: "placeholder-6-3"
  },
  {
    id: "6-4",
    name: "Rollover Snap",
    description: "Roll your foot over the ball then snap the foot down to flick the ball in the opposite direction",
    difficulty: "Hard",
    videoId: "placeholder-6-4"
  },
  {
    id: "6-5",
    name: "Stepover Sole Rolls",
    description: "Roll the ball between the soles, stepping over the ball between each touch",
    difficulty: "Medium",
    videoId: "placeholder-6-5"
  },
  {
    id: "6-6",
    name: "Inside Double Stepover Outside",
    description: "Nudge the ball with the inside of the foot, stepover the ball with both feet then nudge with the outside of opposite foot",
    difficulty: "Hard",
    videoId: "placeholder-6-6"
  },
  {
    id: "6-7",
    name: "Stepover Inside Inside",
    description: "Step around the ball, hopping into an inside to inside touch",
    difficulty: "Medium",
    videoId: "placeholder-6-7"
  },
];

const level7Exercises: Exercise[] = [
  {
    id: "7-1",
    name: "Drag Pass",
    description: "Use the sole of the foot to drag the ball towards the inside of opposite foot to tap the ball and repeat",
    difficulty: "Medium",
    videoId: "placeholder-7-1"
  },
  {
    id: "7-2",
    name: "Roll Stepover Cut",
    description: "Roll the ball with the sole of the foot, stepping over the ball and cutting with the inside of opposite foot",
    difficulty: "Medium",
    videoId: "placeholder-7-2"
  },
  {
    id: "7-3",
    name: "Double Sole L Drag",
    description: "Roll the ball twice across the body followed by an L Drag to repeat in the opposite direction",
    difficulty: "Hard",
    videoId: "placeholder-7-3"
  },
  {
    id: "7-4",
    name: "L Drag to V Cut",
    description: "Perform an L Drag, immediately followed by a V Cut",
    difficulty: "Hard",
    videoId: "placeholder-7-4"
  },
  {
    id: "7-5",
    name: "Outside Nudge Stepover",
    description: "Lightly nudge the ball with the outside of your foot then step over the ball with opposite foot",
    difficulty: "Medium",
    videoId: "placeholder-7-5"
  },
  {
    id: "7-6",
    name: "Ronaldinho Fake Pass",
    description: "Roll the ball back as if you were performing an L Drag but instead catch the ball with the laces",
    difficulty: "Hard",
    videoId: "placeholder-7-6"
  },
  {
    id: "7-7",
    name: "Neymar Chop",
    description: "Roll foot over the ball then as the ball rolls to the other side, chop behind the leg with the inside of opposite foot",
    difficulty: "Hard",
    videoId: "placeholder-7-7"
  },
];

const level8Exercises: Exercise[] = [
  {
    id: "8-1",
    name: "Inside Out",
    description: "Move the ball from inside to outside of the foot to improve lateral quickness and ball control.",
    difficulty: "Medium",
    videoId: "placeholder-8-1"
  },
  {
    id: "8-2",
    name: "Roll Inside",
    description: "Roll the ball with the sole and tap inside to train foot dexterity and close control.",
    difficulty: "Medium",
    videoId: "placeholder-8-2"
  },
  {
    id: "8-3",
    name: "Sole Outside (V)",
    description: "Use the sole to roll the ball back and then push outside in a V shape for change of direction.",
    difficulty: "Medium",
    videoId: "placeholder-8-3"
  },
  {
    id: "8-4",
    name: "Inside Inside",
    description: "Alternate touches with the inside of both feet, focusing on close control and rhythm.",
    difficulty: "Easy",
    videoId: "placeholder-8-4"
  },
  {
    id: "8-5",
    name: "Slide (Chop Inside)",
    description: "Quick lateral movement with the inside of the foot, chopping the ball to change direction.",
    difficulty: "Hard",
    videoId: "placeholder-8-5"
  },
  {
    id: "8-6",
    name: "Single Sole Role (V)",
    description: "Roll the ball with the sole in a V pattern using only one foot for enhanced control.",
    difficulty: "Hard",
    videoId: "placeholder-8-6"
  },
  {
    id: "8-7",
    name: "Sole-Sole Outside",
    description: "Combine sole touches with outside foot movements for advanced ball manipulation.",
    difficulty: "Hard",
    videoId: "placeholder-8-7"
  }
];

const level9Exercises: Exercise[] = [
  {
    id: "9-1",
    name: "Inside Out",
    description: "Move the ball from inside to outside of the foot to improve lateral quickness and ball control.",
    difficulty: "Medium",
    videoId: "placeholder-9-1"
  },
  {
    id: "9-2",
    name: "Sole Outside (V)",
    description: "Use the sole to roll the ball back and then push outside in a V shape for change of direction.",
    difficulty: "Medium",
    videoId: "placeholder-9-3"
  },
  {
    id: "9-3",
    name: "Inside Inside",
    description: "Alternate touches with the inside of both feet, focusing on close control.",
    difficulty: "Medium",
    videoId: "placeholder-9-4"
  },
  {
    id: "9-4",
    name: "Roll Inside",
    description: "Roll the ball with the sole and tap inside to train foot dexterity.",
    difficulty: "Medium",
    videoId: "placeholder-9-2"
  },
  {
    id: "9-5",
    name: "Single Sole Outside",
    description: "Use only one foot's sole to roll and then push outside, isolating control to one side.",
    difficulty: "Hard",
    videoId: "placeholder-9-5"
  },
  {
    id: "9-6",
    name: "Single Slide",
    description: "Slide the ball sideways using one foot, keeping the ball under close control.",
    difficulty: "Hard",
    videoId: "placeholder-9-6"
  },
  {
    id: "9-7",
    name: "Single Foot Roll Outside",
    description: "Roll the ball then push outside with the same foot, combining rolling and lateral movement.",
    difficulty: "Hard",
    videoId: "placeholder-9-7"
  }
];

const Level = () => {
  const { levelId } = useParams();
  const [bestScores, setBestScores] = useState<{ [exerciseId: string]: number }>({});

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const savedProgress = localStorage.getItem('footballAppProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      const levelProgress = progress[parseInt(levelId || '1')];
      if (levelProgress) {
        setBestScores(levelProgress.bestScores || {});
      }
    }
  }, [levelId]);

  const generateExercises = (level: number): Exercise[] => {
    if (level === 1) {
      return maestroExercises;
    }
    if (level === 2) {
      return level2Exercises;
    }
    if (level === 3) {
      return level3Exercises;
    }
    if (level === 4) {
      return level4Exercises;
    }
    if (level === 5) {
      return level5Exercises;
    }
    if (level === 6) {
      return level6Exercises;
    }
    if (level === 7) {
      return level7Exercises;
    }
    if (level === 8) {
      return level8Exercises;
    }
    if (level === 9) {
      return level9Exercises;
    }
    const baseExercises = [
      { name: "Toe Taps", description: "Quick toe touches on top of the ball", difficulty: 'Easy' as const },
      { name: "Inside Touch", description: "Touch ball with inside of both feet alternately", difficulty: 'Easy' as const },
      { name: "Outside Touch", description: "Touch ball with outside of both feet", difficulty: 'Medium' as const },
      { name: "Sole Rolls", description: "Roll ball forward and backward with sole", difficulty: 'Easy' as const },
      { name: "Pull Back", description: "Pull ball back with sole and push forward", difficulty: 'Medium' as const },
      { name: "L-Shape", description: "Inside touch followed by forward push", difficulty: 'Medium' as const },
      { name: "Foundation", description: "Combination of basic touches", difficulty: 'Hard' as const },
      { name: "Step Over", description: "Step over ball and touch with outside", difficulty: 'Hard' as const },
    ];

    const exerciseCount = level % 2 === 0 ? 7 : 8;
    return baseExercises.slice(0, exerciseCount).map((exercise, index) => ({
      ...exercise,
      id: `${level}-${index + 1}`,
      videoId: `placeholder-${level}-${index + 1}`
    }));
  };

  const exercises = generateExercises(parseInt(levelId || '1'));
  const levelNum = parseInt(levelId || '1');

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

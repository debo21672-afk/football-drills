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
    name: "Right Foot Weave",
    description: "Weave in and out of the cones using the inside and outside of the right foot taking a touch every step.",
    difficulty: "Easy",
    videoId: "placeholder-2-1"
  },
  {
    id: "2-2",
    name: "Left Foot Weave",
    description: "Weave in and out of the cones using the inside and outside of the left foot taking a touch every step.",
    difficulty: "Easy",
    videoId: "placeholder-2-2"
  },
  {
    id: "2-3",
    name: "Inside Foot Double U",
    description: "Pull ball back with the sole of your foot, push ball across body with inside of the foot, push forward with opposite foot and repeat.",
    difficulty: "Medium",
    videoId: "placeholder-2-3"
  },
  {
    id: "2-4",
    name: "Outside Foot Double U",
    description: "Pull ball back with the sole of your foot, push ball across body with outside of the foot, push forward with inside foot and repeat.",
    difficulty: "Medium",
    videoId: "placeholder-2-4"
  },
  {
    id: "2-5",
    name: "L Drag Double U",
    description: "Pull ball back and push behind standing leg with inside of foot then forward with inside of opposite foot and repeat.",
    difficulty: "Hard",
    videoId: "placeholder-2-5"
  },
  {
    id: "2-6",
    name: "Sideways Infinity",
    description: "Draw an infinity symbol (figure of 8) around the cones using the inside and sole of both feet.",
    difficulty: "Hard",
    videoId: "placeholder-2-6"
  },
  {
    id: "2-7",
    name: "Alternating V Cuts",
    description: "Perform an Inside Foot V cut, exchange feet and immediately perform Alternate V Cut.",
    difficulty: "Hard",
    videoId: "placeholder-2-7"
  },
];

const maestroExercises: Exercise[] = [
  {
    id: "1-1",
    name: "Inside Foot U",
    description: "Pull ball towards you using the sole of your foot, push ball across body with inside of the foot, push forward with opposite foot",
    difficulty: "Easy",
    videoId: "placeholder-1-1"
  },
  {
    id: "1-2",
    name: "Outside Foot U",
    description: "Pull ball back towards you and then across your body with the outside of the foot. Repeat both sides.",
    difficulty: "Easy",
    videoId: "placeholder-1-2"
  },
  {
    id: "1-3",
    name: "Inside Foot V Cut",
    description: "Pull ball towards you with the sole diagonally and push in the opposite direction with the inside foot.",
    difficulty: "Medium",
    videoId: "placeholder-1-3"
  },
  {
    id: "1-4",
    name: "Outside Foot V Cut",
    description: "Pull ball towards you diagonally, exchange feet and push the opposite way with the inside of the foot.",
    difficulty: "Medium",
    videoId: "placeholder-1-4"
  },
  {
    id: "1-5",
    name: "Alternate Foot V Cut",
    description: "Pull ball towards you diagonally, exchange feet and push the opposite way with the inside of the foot.",
    difficulty: "Medium",
    videoId: "placeholder-1-5"
  },
  {
    id: "1-6",
    name: "L Drag U",
    description: "Pull ball towards you and push behind standing leg with inside of the foot. Repeat both sides.",
    difficulty: "Hard",
    videoId: "placeholder-1-6"
  },
  {
    id: "1-7",
    name: "Sole Square",
    description: "Draw a square around the cone using the soles of both feet.",
    difficulty: "Hard",
    videoId: "placeholder-1-7"
  },
];

const level3Exercises: Exercise[] = [
  {
    id: "3-1",
    name: "Sole Rolls",
    description: "Roll the ball between the cones from one foot to the other using the sole of the foot.",
    difficulty: "Easy",
    videoId: "placeholder-3-1"
  },
  {
    id: "3-2",
    name: "Nutmegs",
    description: "Pull ball towards back and push through the cones using the outside of the foot. Repeat both sides.",
    difficulty: "Easy",
    videoId: "placeholder-3-2"
  },
  {
    id: "3-3",
    name: "Upside Down U",
    description: "Push ball forward with inside of the foot, sole roll through the cones and pull back with the sole.",
    difficulty: "Medium",
    videoId: "placeholder-3-3"
  },
  {
    id: "3-4",
    name: "Forwards Infinity",
    description: "Draw an Infinity symbol (figure of 8) with the ball around the cones with the sole and inside of both feet.",
    difficulty: "Medium",
    videoId: "placeholder-3-4"
  },
  {
    id: "3-5",
    name: "V Cut Triangle",
    description: "Perform an Inside Foot V Cut and Sole Roll the ball through the cones and repeat.",
    difficulty: "Medium",
    videoId: "placeholder-3-5"
  },
  {
    id: "3-6",
    name: "L Drag Triangle",
    description: "Perform the L Drag and double Sole Roll the ball through the cones to repeat on opposite foot.",
    difficulty: "Hard",
    videoId: "placeholder-3-6"
  },
  {
    id: "3-7",
    name: "L Drag V Cut Triangle",
    description: "Perform the L Drag followed by the Alternate V Cut and Sole Roll the ball through the cones.",
    difficulty: "Hard",
    videoId: "placeholder-3-7"
  }
];

const level4Exercises: Exercise[] = [
  {
    id: "4-1",
    name: "Triple Push Pull",
    description: "Push ball with the laces and pull back with the sole to the inside, forwards and then outside.",
    difficulty: "Easy",
    videoId: "placeholder-4-1"
  },
  {
    id: "4-2",
    name: "Double V Cut Sole Roll",
    description: "Perform a double Inside Foot V Cut and Sole Roll the ball in front of the base cones of the triangle.",
    difficulty: "Easy",
    videoId: "placeholder-4-2"
  },
  {
    id: "4-3",
    name: "Pyramids",
    description: "Sole Roll the ball behind the base cones of the triangle, push forward and work your way up and back down the triangle.",
    difficulty: "Easy",
    videoId: "placeholder-4-3"
  },
  {
    id: "4-4",
    name: "Right Foot Weave",
    description: "Weave around the course going around each of the cones using the inside and outside of your right foot.",
    difficulty: "Easy",
    videoId: "placeholder-4-4"
  },
  {
    id: "4-5",
    name: "Left Foot Weave",
    description: "Weave around the course going around each of the cones using the inside and outside of your left foot.",
    difficulty: "Easy",
    videoId: "placeholder-4-5"
  },
  {
    id: "4-6",
    name: "Sole Weave",
    description: "Weave around the course going around each of the cones using the sole of both feet.",
    difficulty: "Easy",
    videoId: "placeholder-4-6"
  },
  {
    id: "4-7",
    name: "Inside Outside Weave",
    description: "Weave around the course going around each of the cones using the inside and outside of both feet.",
    difficulty: "Easy",
    videoId: "placeholder-4-7"
  }
];

const level5Exercises: Exercise[] = [
  {
    id: "5-1",
    name: "Cross Soles",
    description: "Facing forwards, roll ball to each side of the square and back to the centre using the sole of the foot.",
    difficulty: "Easy",
    videoId: "placeholder-5-1"
  },
  {
    id: "5-2",
    name: "Oblongs",
    description: "Draw an oblong shape with the ball around the 2 base cones using the inside and sole of both feet.",
    difficulty: "Easy",
    videoId: "placeholder-5-2"
  },
  {
    id: "5-3",
    name: "Forwards Backwards Soles",
    description: "Roll the ball forwards and backwards up the sides and down the middle of the square using the sole.",
    difficulty: "Easy",
    videoId: "placeholder-5-3"
  },
  {
    id: "5-4",
    name: "Single Leg Sole Maze",
    description: "Roll the ball forwards, outside, forwards inside, backwards, outside, backwards with the sole. Repeat both sides.",
    difficulty: "Easy",
    videoId: "placeholder-5-4"
  },
  {
    id: "5-5",
    name: "Parallels",
    description: "Sole roll the ball behind the base cones, roll ball forwards then repeat all the way up to the front of the square and back to the start.",
    difficulty: "Easy",
    videoId: "placeholder-5-5"
  },
  {
    id: "5-6",
    name: "Two Feet Maze",
    description: "Using both feet, roll the ball forwards, outside, forwards inside, backwards, outside, backwards with the sole. Repeat both sides.",
    difficulty: "Easy",
    videoId: "placeholder-5-6"
  },
  {
    id: "5-7",
    name: "Matrix",
    description: "Using the sole and inside of both feet, draw a square around all four corner cones with the ball.",
    difficulty: "Easy",
    videoId: "placeholder-5-7"
  },
];

const level6Exercises: Exercise[] = [
  {
    id: "6-1",
    name: "Inside Foot Quarter Turn",
    description: "Pull ball towards the middle of the square and push 90 degrees with the inside of the same foot around all four sides.",
    difficulty: "Easy",
    videoId: "placeholder-6-1"
  },
  {
    id: "6-2",
    name: "Outside Foot Quarter Turn",
    description: "Pull ball towards the middle of the square and push 90 degrees with the outside of the same foot around all four sides.",
    difficulty: "Easy",
    videoId: "placeholder-6-2"
  },
  {
    id: "6-3",
    name: "Alternating Feet Quarter Turn",
    description: "Pull ball towards the middle of the square and push 90 degrees with the inside of the opposite foot around all four sides.",
    difficulty: "Easy",
    videoId: "placeholder-6-3"
  },
  {
    id: "6-4",
    name: "L Drag Quarter Turn",
    description: "Pull ball towards the middle of the square and push 90 degrees behind the standing leg with the inside of the same foot around all four sides.",
    difficulty: "Easy",
    videoId: "placeholder-6-4"
  },
  {
    id: "6-5",
    name: "Reverse L Drag Quarter Turn",
    description: "Pull ball down the outside of the standing leg and push 90 degrees with the inside of the same foot around all four sides.",
    difficulty: "Easy",
    videoId: "placeholder-6-5"
  },
  {
    id: "6-6",
    name: "Outer Square Sole",
    description: "Using the sole of both feet, roll the ball around the outside of the square forwards and laterally keeping as close to the cones as possible.",
    difficulty: "Easy",
    videoId: "placeholder-6-6"
  },
  {
    id: "6-7",
    name: "Samba",
    description: "Sole roll ball to the middle of the square, inside stepover, outside stepover, continue sole roll across and repeat in the opposite direction.",
    difficulty: "Easy",
    videoId: "placeholder-6-7"
  },
];

const level7Exercises: Exercise[] = [
  {
    id: "7-1",
    name: "Inside Foot Wheel",
    description: "Pull ball back with the sole and across with the inside of the foot then push forward with the opposite foot and repeat around entire circle.",
    difficulty: "Easy",
    videoId: "placeholder-7-1"
  },
  {
    id: "7-2",
    name: "Outside Foot Wheel",
    description: "Pull ball back with the sole and across with the outside of the foot then push forward with the same foot and repeat around entire circle.",
    difficulty: "Easy",
    videoId: "placeholder-7-2"
  },
  {
    id: "7-3",
    name: "Single Leg Sole Wheel",
    description: "Roll the ball inside and outside of the circle around the cones using the sole of the foot.",
    difficulty: "Easy",
    videoId: "placeholder-7-3"
  },
  {
    id: "7-4",
    name: "Two Foot Wheel",
    description: "Roll the ball inside and outside of the circle around the cones using the inside and sole of both feet.",
    difficulty: "Easy",
    videoId: "placeholder-7-4"
  },
  {
    id: "7-5",
    name: "Right Foot Weave",
    description: "Weave in and out of the cones around the circle using the inside and outside of your right foot.",
    difficulty: "Easy",
    videoId: "placeholder-7-5"
  },
  {
    id: "7-6",
    name: "Left Foot Weave",
    description: "Weave in and out of the cones around the circle using the inside and outside of your left foot.",
    difficulty: "Easy",
    videoId: "placeholder-7-6"
  },
  {
    id: "7-7",
    name: "Two Foot Weave",
    description: "Weave in and out of the cones around the circle using all areas of both feet.",
    difficulty: "Easy",
    videoId: "placeholder-7-7"
  },
];

const level8Exercises: Exercise[] = [
  {
    id: "8-1",
    name: "Inside Out",
    description: "Move the ball from inside to outside of the foot to improve lateral quickness and ball control.",
    difficulty: "Medium",
    videoId: "pZ8iGPw3c0Y"
  },
  {
    id: "8-2",
    name: "Sole Outside (V)",
    description: "Use the sole to roll the ball back and then push outside in a V shape for change of direction.",
    difficulty: "Medium",
    videoId: "VMnDtnJJSMI"
  },
  {
    id: "8-3",
    name: "Inside Inside",
    description: "Alternate touches with the inside of both feet, focusing on close control.",
    difficulty: "Medium",
    videoId: "OsxLeSU_8gs"
  },
  {
    id: "8-4",
    name: "Roll Inside",
    description: "Roll the ball with the sole and tap inside to train foot dexterity.",
    difficulty: "Medium",
    videoId: "ycIuocLGlAc"
  },
  {
    id: "8-5",
    name: "Single Sole Outside",
    description: "Use only one foot’s sole to roll and then push outside, isolating control to one side.",
    difficulty: "Medium",
    videoId: "Ui-kIJ8pMys"
  },
  {
    id: "8-6",
    name: "Single Slide",
    description: "Slide the ball sideways using one foot, keeping the ball under close control.",
    difficulty: "Hard",
    videoId: "oGNnlzIYP-Q"
  },
  {
    id: "8-7",
    name: "Single Foot Roll Outside",
    description: "Roll the ball then push outside with the same foot, combining rolling and lateral movement.",
    difficulty: "Hard",
    videoId: "PLZOyRwBth8"
  }
];

const Level = () => {
  const { levelId } = useParams();
  const [bestScores, setBestScores] = useState<{ [exerciseId: string]: number }>({});

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
                  {/* Only embed video in Level 8 */}
                  {levelNum === 8 && (
                    <div className="mt-3">
                      <div className="aspect-video rounded border border-gray-300 overflow-hidden bg-black">
                        <iframe
                          title={`Exercise ${exercise.id} video`}
                          src={`https://www.youtube.com/embed/${exercise.videoId}`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  )}
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

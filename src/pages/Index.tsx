import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Play, Settings, Flame, LogIn, LogOut, Shield } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getProgress, getStreakData, LevelProgress, StreakData } from '@/utils/progressUtils';
import { SettingsComponent } from '@/components/SettingsComponent';
import { useAuth } from '@/hooks/useAuth';
import { useCloudProgress } from '@/hooks/useCloudProgress';

const Index = () => {
  const [progress, setProgress] = useState<{ [levelId: number]: LevelProgress }>({});
  const [streakData, setStreakData] = useState<StreakData>({ currentStreak: 0, longestStreak: 0, lastSessionDate: null, totalSessions: 0 });
  const [showSettings, setShowSettings] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, isAdmin, signOut, loading } = useAuth();
  const { getProgress: getCloudProgress, getStreakData: getCloudStreak } = useCloudProgress();

  useEffect(() => {
    const loadProgress = async () => {
      if (user) {
        // Load from cloud
        const cloudProgress = await getCloudProgress();
        const cloudStreak = await getCloudStreak();
        
        const levelProgress: { [levelId: number]: LevelProgress } = {};
        Object.entries(cloudProgress).forEach(([exerciseId, bestScore]) => {
          const [levelIdStr] = exerciseId.split('-');
          const levelId = parseInt(levelIdStr);
          if (!levelProgress[levelId]) {
            levelProgress[levelId] = {
              levelId,
              completedExercises: 0,
              totalExercises: levelId % 2 === 0 ? 7 : 8,
              bestScores: {},
              attempts: {}
            };
          }
          levelProgress[levelId].bestScores[exerciseId] = bestScore;
          levelProgress[levelId].completedExercises = Object.keys(levelProgress[levelId].bestScores).length;
        });
        setProgress(levelProgress);
        setStreakData({
          currentStreak: cloudStreak.currentStreak,
          longestStreak: cloudStreak.longestStreak,
          lastSessionDate: null,
          totalSessions: 0
        });
      } else {
        // Load from localStorage
        setProgress(getProgress());
        setStreakData(getStreakData());
      }
    };
    
    loadProgress();
  }, [user, getCloudProgress, getCloudStreak]);

  useEffect(() => {
    // Restore scroll position when coming back to index page
    const savedScrollPosition = sessionStorage.getItem('indexScrollPosition');
    if (savedScrollPosition && location.pathname === '/') {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollPosition));
      }, 0);
    }
  }, [location.pathname]);

  const handleLevelClick = useCallback(() => {
    // Save current scroll position before navigating
    sessionStorage.setItem('indexScrollPosition', window.scrollY.toString());
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setProgress({});
    setStreakData({ currentStreak: 0, longestStreak: 0, lastSessionDate: null, totalSessions: 0 });
  };

  // Memoize levels array to avoid recreation on every render
  const levels = useMemo(() =>
    Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Level ${i + 1}`,
      description: `Ball mastery skills - ${i === 0 ? 'Beginner' : i < 3 ? 'Basic' : i < 6 ? 'Intermediate' : i < 8 ? 'Advanced' : 'Expert'}`,
      exerciseCount: (i + 1) % 2 === 0 ? 7 : 8,
      color: i < 3 ? 'bg-green-500' : i < 6 ? 'bg-blue-500' : i < 8 ? 'bg-orange-500' : 'bg-red-500'
    }))
  , []);

  const getLevelProgress = useCallback((levelId: number) => {
    return progress[levelId] || {
      levelId,
      completedExercises: 0,
      totalExercises: levels.find(l => l.id === levelId)?.exerciseCount || 7,
      bestScores: {}
    };
  }, [progress, levels]);

  const totalStars = useMemo(() =>
    Object.values(progress).reduce((total, level) => total + level.completedExercises, 0)
  , [progress]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      {/* Settings Modal */}
      {showSettings && <SettingsComponent onClose={() => setShowSettings(false)} />}

      <div className="max-w-6xl mx-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  {user.email}
                </span>
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/admin')}
                    className="gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate('/auth')}
                className="gap-2"
                disabled={loading}
              >
                <LogIn className="w-4 h-4" />
                Log In
              </Button>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowSettings(true)}
            className="hover:bg-white/50"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <span className="text-6xl">⚽</span>
            Football Skills Training
          </h1>
          <p className="text-lg text-gray-600 mb-4">Master your ball skills with fun exercises and challenges!</p>
          
          <div className="flex justify-center items-center gap-3 mb-6 flex-wrap">
            <Badge variant="secondary" className="text-lg p-2">
              <Trophy className="w-5 h-5 mr-2" />
              {totalStars} Stars Earned
            </Badge>
            
            {streakData.currentStreak > 0 && (
              <Badge className="text-lg p-2 bg-orange-500 hover:bg-orange-600">
                <Flame className="w-5 h-5 mr-2" />
                {streakData.currentStreak} Day Streak
              </Badge>
            )}
            
            {streakData.longestStreak > 3 && (
              <Badge variant="outline" className="text-lg p-2">
                🏆 Best: {streakData.longestStreak} Days
              </Badge>
            )}
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

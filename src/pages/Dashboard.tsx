import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useCloudProgress } from '@/hooks/useCloudProgress';
import { ArrowLeft, TrendingUp, Trophy, Flame, Target, Calendar as CalendarIcon, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Loader2 } from 'lucide-react';

interface SessionData {
  date: string;
  score: number;
  exerciseId: string;
}

interface LevelStats {
  levelId: number;
  completed: number;
  total: number;
  percentage: number;
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [levelStats, setLevelStats] = useState<LevelStats[]>([]);
  const [stats, setStats] = useState({
    totalExercises: 0,
    totalSessions: 0,
    currentStreak: 0,
    improvementPercentage: 0,
    averageScore: 0
  });
  const [activityMap, setActivityMap] = useState<{ [date: string]: number }>({});

  const { user } = useAuth();
  const { getProgress, getStreakData, getTotalSessions, getRecentSessions } = useCloudProgress();
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Fetch all data in parallel
        const [progress, streakData, totalSessions, recentSessions] = await Promise.all([
          getProgress(),
          getStreakData(),
          getTotalSessions(),
          getRecentSessions(30) // Last 30 days
        ]);

        // Process sessions data
        setSessions(recentSessions);

        // Calculate activity map for calendar
        const activityCount: { [date: string]: number } = {};
        recentSessions.forEach(session => {
          const date = new Date(session.created_at).toISOString().split('T')[0];
          activityCount[date] = (activityCount[date] || 0) + 1;
        });
        setActivityMap(activityCount);

        // Calculate level statistics
        const levels = Array.from({ length: 10 }, (_, i) => i + 1);
        const levelStatsData: LevelStats[] = levels.map(levelId => {
          const exercisesForLevel = Object.keys(progress).filter(
            exerciseId => exerciseId.startsWith(`${levelId}-`)
          );
          const total = levelId % 2 === 0 ? 7 : 8;
          const completed = exercisesForLevel.length;
          return {
            levelId,
            completed,
            total,
            percentage: Math.round((completed / total) * 100)
          };
        });
        setLevelStats(levelStatsData);

        // Calculate improvement percentage
        const sortedSessions = [...recentSessions].sort((a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        let improvementPercentage = 0;
        if (sortedSessions.length >= 6) {
          const firstThree = sortedSessions.slice(0, 3);
          const lastThree = sortedSessions.slice(-3);
          const firstAvg = firstThree.reduce((sum, s) => sum + s.score, 0) / 3;
          const lastAvg = lastThree.reduce((sum, s) => sum + s.score, 0) / 3;
          if (firstAvg > 0) {
            improvementPercentage = Math.round(((lastAvg - firstAvg) / firstAvg) * 100);
          }
        }

        // Calculate average score
        const averageScore = recentSessions.length > 0
          ? Math.round(recentSessions.reduce((sum, s) => sum + s.score, 0) / recentSessions.length)
          : 0;

        setStats({
          totalExercises: Object.keys(progress).length,
          totalSessions,
          currentStreak: streakData.currentStreak,
          improvementPercentage,
          averageScore
        });

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user, getProgress, getStreakData, getTotalSessions, getRecentSessions]);

  // Prepare chart data (group by date and average scores)
  const chartData = sessions.reduce((acc, session) => {
    const date = new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.scores.push(session.score);
      existing.avgScore = Math.round(existing.scores.reduce((a, b) => a + b, 0) / existing.scores.length);
    } else {
      acc.push({ date, scores: [session.score], avgScore: session.score });
    }
    return acc;
  }, [] as { date: string; scores: number[]; avgScore: number }[]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600">Track your training progress</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Exercises Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.totalExercises}</div>
              <p className="text-xs text-gray-500 mt-1">Unique exercises mastered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalSessions}</div>
              <p className="text-xs text-gray-500 mt-1">Training sessions completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Flame className="w-4 h-4" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.currentStreak}</div>
              <p className="text-xs text-gray-500 mt-1">Consecutive training days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${stats.improvementPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.improvementPercentage > 0 ? '+' : ''}{stats.improvementPercentage}%
              </div>
              <p className="text-xs text-gray-500 mt-1">Last 30 days vs first sessions</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Score Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Score Trends
              </CardTitle>
              <CardDescription>Average scores over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="avgScore"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 4 }}
                      name="Average Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-gray-500">
                  No session data yet. Start training to see your progress!
                </div>
              )}
            </CardContent>
          </Card>

          {/* Level Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Level Completion
              </CardTitle>
              <CardDescription>Progress across all 10 levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={levelStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="levelId" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#3b82f6" name="Completion %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Activity Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Training Activity
            </CardTitle>
            <CardDescription>Your training sessions over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 30 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (29 - i));
                const dateStr = date.toISOString().split('T')[0];
                const count = activityMap[dateStr] || 0;

                return (
                  <div
                    key={i}
                    className={`aspect-square rounded flex items-center justify-center text-xs font-medium
                      ${count === 0 ? 'bg-gray-100 text-gray-400' : ''}
                      ${count === 1 ? 'bg-green-200 text-green-700' : ''}
                      ${count === 2 ? 'bg-green-400 text-green-900' : ''}
                      ${count >= 3 ? 'bg-green-600 text-white' : ''}
                    `}
                    title={`${dateStr}: ${count} session${count !== 1 ? 's' : ''}`}
                  >
                    {date.getDate()}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 rounded"></div>
                <span>No activity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-200 rounded"></div>
                <span>1 session</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-400 rounded"></div>
                <span>2 sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600 rounded"></div>
                <span>3+ sessions</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

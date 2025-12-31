import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Users, Trophy, Flame, TrendingUp, Loader2 } from 'lucide-react';
import { allExercises } from '@/data/exercises';

interface UserData {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  totalSessions: number;
  totalExercises: number;
  currentStreak: number;
  longestStreak: number;
  lastActivity: string | null;
}

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchAllUsers();
    }
  }, [isAdmin]);

  const fetchAllUsers = async () => {
    setLoadingData(true);
    
    // Fetch all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      setLoadingData(false);
      return;
    }

    // Fetch all sessions to count per user
    const { data: sessions } = await supabase
      .from('sessions')
      .select('user_id, exercise_id');

    // Fetch all progress
    const { data: progress } = await supabase
      .from('user_progress')
      .select('user_id, exercise_id');

    // Fetch all streaks
    const { data: streaks } = await supabase
      .from('user_streaks')
      .select('*');

    // Combine data
    const usersWithData: UserData[] = profiles?.map(profile => {
      const userSessions = sessions?.filter(s => s.user_id === profile.id) || [];
      const userProgress = progress?.filter(p => p.user_id === profile.id) || [];
      const userStreak = streaks?.find(s => s.user_id === profile.id);
      
      return {
        id: profile.id,
        email: profile.email,
        display_name: profile.display_name,
        created_at: profile.created_at,
        totalSessions: userSessions.length,
        totalExercises: new Set(userProgress.map(p => p.exercise_id)).size,
        currentStreak: userStreak?.current_streak || 0,
        longestStreak: userStreak?.longest_streak || 0,
        lastActivity: userStreak?.last_activity_date || null
      };
    }) || [];

    setUsers(usersWithData);
    setLoadingData(false);
  };

  const fetchUserProgress = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_progress')
      .select('exercise_id, best_score, attempts')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user progress:', error);
      return;
    }

    const progressMap: Record<string, number> = {};
    data?.forEach(p => {
      progressMap[p.exercise_id] = p.best_score;
    });
    setUserProgress(progressMap);
    setSelectedUser(userId);
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const selectedUserData = users.find(u => u.id === selectedUser);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor all users' progress</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Trophy className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold">
                    {users.reduce((sum, u) => sum + u.totalSessions, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Flame className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Streaks</p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.currentStreak > 0).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Exercises</p>
                  <p className="text-2xl font-bold">
                    {users.length > 0 
                      ? Math.round(users.reduce((sum, u) => sum + u.totalExercises, 0) / users.length)
                      : 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No users registered yet</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {users.map(userData => (
                    <div
                      key={userData.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        selectedUser === userData.id ? 'border-primary bg-primary/5' : 'hover:border-gray-300'
                      }`}
                      onClick={() => fetchUserProgress(userData.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{userData.display_name || 'Anonymous'}</p>
                          <p className="text-sm text-gray-500">{userData.email}</p>
                        </div>
                        {userData.currentStreak > 0 && (
                          <Badge className="bg-orange-500">
                            <Flame className="w-3 h-3 mr-1" />
                            {userData.currentStreak}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>{userData.totalExercises} exercises</span>
                        <span>{userData.totalSessions} sessions</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected User Details */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedUserData 
                  ? `${selectedUserData.display_name || selectedUserData.email}'s Progress`
                  : 'Select a User'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedUser ? (
                <p className="text-center text-gray-500 py-8">
                  Click on a user to view their detailed progress
                </p>
              ) : (
                <div>
                  {/* User Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Best Streak</p>
                      <p className="text-xl font-bold">{selectedUserData?.longestStreak || 0} days</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Current Streak</p>
                      <p className="text-xl font-bold">{selectedUserData?.currentStreak || 0} days</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Total Sessions</p>
                      <p className="text-xl font-bold">{selectedUserData?.totalSessions || 0}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">Joined</p>
                      <p className="text-xl font-bold">
                        {selectedUserData?.created_at 
                          ? new Date(selectedUserData.created_at).toLocaleDateString()
                          : '-'}
                      </p>
                    </div>
                  </div>

                  {/* Exercise Scores */}
                  <h4 className="font-semibold mb-3">Exercise Best Scores</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {Object.entries(userProgress).length === 0 ? (
                      <p className="text-gray-500 text-sm">No exercises completed yet</p>
                    ) : (
                      Object.entries(userProgress).map(([exerciseId, score]) => (
                        <div key={exerciseId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">
                            {allExercises[exerciseId]?.name || exerciseId}
                          </span>
                          <Badge variant="secondary">{score} reps</Badge>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;

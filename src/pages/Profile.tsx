import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useCloudProgress } from '@/hooks/useCloudProgress';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Loader2, Save, Trophy, Flame, Target, Calendar, Download } from 'lucide-react';

const Profile = () => {
  const [displayName, setDisplayName] = useState('');
  const [originalDisplayName, setOriginalDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [stats, setStats] = useState({
    totalExercises: 0,
    totalSessions: 0,
    currentStreak: 0,
    longestStreak: 0,
    memberSince: ''
  });

  const { user } = useAuth();
  const { getProgress, getStreakData, getTotalSessions, exportAllData } = useCloudProgress();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Fetch profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, created_at')
          .eq('id', user.id)
          .maybeSingle();
        
        if (profile) {
          setDisplayName(profile.display_name || '');
          setOriginalDisplayName(profile.display_name || '');
          setStats(prev => ({
            ...prev,
            memberSince: new Date(profile.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          }));
        }

        // Fetch progress stats
        const progress = await getProgress();
        const streakData = await getStreakData();
        const totalSessions = await getTotalSessions();
        
        setStats(prev => ({
          ...prev,
          totalExercises: Object.keys(progress).length,
          totalSessions,
          currentStreak: streakData.currentStreak,
          longestStreak: streakData.longestStreak
        }));
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProfile();
  }, [user, getProgress, getStreakData, getTotalSessions]);

  const handleSave = async () => {
    if (!user) return;
    if (displayName === originalDisplayName) {
      toast({
        title: 'No changes',
        description: 'Display name is the same.'
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName.trim() })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setOriginalDisplayName(displayName.trim());
      toast({
        title: 'Profile updated!',
        description: 'Your display name has been saved.'
      });
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;

    setIsExporting(true);
    try {
      const result = await exportAllData();

      if (!result.success) {
        toast({
          title: 'Export failed',
          description: result.error?.message || 'Failed to export your data. Please try again.',
          variant: 'destructive'
        });
        return;
      }

      // Create and download JSON file
      const jsonString = JSON.stringify(result.data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const fileName = `football-skills-data-${new Date().toISOString().split('T')[0]}.json`;

      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Data exported!',
        description: `Your data has been downloaded as ${fileName}`
      });
    } catch (error: any) {
      toast({
        title: 'Export failed',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-primary-foreground font-bold">
                {displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
            <CardTitle className="text-2xl">Your Profile</CardTitle>
            <CardDescription>{user?.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <div className="flex gap-2">
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Enter your display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={50}
                />
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving || displayName === originalDisplayName}
                  className="gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Your Stats</CardTitle>
            <CardDescription>Track your training progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-700">{stats.totalExercises}</div>
                <div className="text-sm text-green-600">Exercises Completed</div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-700">{stats.totalSessions}</div>
                <div className="text-sm text-blue-600">Total Sessions</div>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <Flame className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold text-orange-700">{stats.currentStreak}</div>
                <div className="text-sm text-orange-600">Current Streak</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <Flame className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-purple-700">{stats.longestStreak}</div>
                <div className="text-sm text-purple-600">Longest Streak</div>
              </div>
            </div>
            
            {stats.memberSince && (
              <div className="mt-6 pt-4 border-t flex items-center justify-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Member since {stats.memberSince}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Export Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-xl">Data Export</CardTitle>
            <CardDescription>Download all your training data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Export all your progress, sessions, and statistics as a JSON file.
              This includes your exercise scores, session history, streak data, and profile information.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
              <p className="font-semibold mb-1">📊 What's included:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>All exercise best scores and attempts</li>
                <li>Complete session history</li>
                <li>Streak data and statistics</li>
                <li>Profile information</li>
              </ul>
            </div>

            <Button
              onClick={handleExportData}
              disabled={isExporting}
              className="w-full gap-2"
              variant="outline"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export My Data
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              This is your right under GDPR and data protection laws
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

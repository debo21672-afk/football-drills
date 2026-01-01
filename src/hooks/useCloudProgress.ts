import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useCloudProgress = () => {
  const { user } = useAuth();

  const saveScore = useCallback(async (exerciseId: string, score: number) => {
    if (!user) return;

    // Upsert progress (update if exists, insert if not)
    const { data: existing } = await supabase
      .from('user_progress')
      .select('best_score, attempts')
      .eq('user_id', user.id)
      .eq('exercise_id', exerciseId)
      .maybeSingle();

    if (existing) {
      // Update if new score is better
      const newBestScore = Math.max(existing.best_score, score);
      await supabase
        .from('user_progress')
        .update({ 
          best_score: newBestScore,
          attempts: existing.attempts + 1
        })
        .eq('user_id', user.id)
        .eq('exercise_id', exerciseId);
    } else {
      // Insert new record
      await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          exercise_id: exerciseId,
          best_score: score,
          attempts: 1
        });
    }

    // Add session record
    await supabase
      .from('sessions')
      .insert({
        user_id: user.id,
        exercise_id: exerciseId,
        score: score
      });

    // Update streak
    await updateStreak();
  }, [user]);

  const updateStreak = useCallback(async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    
    const { data: streakData } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!streakData) {
      // Create new streak record
      await supabase
        .from('user_streaks')
        .insert({
          user_id: user.id,
          current_streak: 1,
          longest_streak: 1,
          last_activity_date: today
        });
      return;
    }

    const lastDate = streakData.last_activity_date;
    
    if (lastDate === today) {
      // Already recorded today
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    if (lastDate === yesterdayStr) {
      // Consecutive day
      newStreak = streakData.current_streak + 1;
    }

    await supabase
      .from('user_streaks')
      .update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, streakData.longest_streak),
        last_activity_date: today
      })
      .eq('user_id', user.id);
  }, [user]);

  const getBestScore = useCallback(async (exerciseId: string): Promise<number | null> => {
    if (!user) return null;

    const { data } = await supabase
      .from('user_progress')
      .select('best_score')
      .eq('user_id', user.id)
      .eq('exercise_id', exerciseId)
      .maybeSingle();

    return data?.best_score || null;
  }, [user]);

  const getProgress = useCallback(async () => {
    if (!user) return {};

    const { data } = await supabase
      .from('user_progress')
      .select('exercise_id, best_score')
      .eq('user_id', user.id);

    const progressMap: Record<string, number> = {};
    data?.forEach(p => {
      progressMap[p.exercise_id] = p.best_score;
    });
    return progressMap;
  }, [user]);

  const getStreakData = useCallback(async () => {
    if (!user) return { currentStreak: 0, longestStreak: 0 };

    const { data } = await supabase
      .from('user_streaks')
      .select('current_streak, longest_streak')
      .eq('user_id', user.id)
      .maybeSingle();

    return {
      currentStreak: data?.current_streak || 0,
      longestStreak: data?.longest_streak || 0
    };
  }, [user]);

  const getTotalSessions = useCallback(async () => {
    if (!user) return 0;

    const { count } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    return count || 0;
  }, [user]);

  const getRecentSessions = useCallback(async (days: number = 30) => {
    if (!user) return [];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data } = await supabase
      .from('sessions')
      .select('exercise_id, score, created_at')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    return data || [];
  }, [user]);

  return {
    saveScore,
    getBestScore,
    getProgress,
    getStreakData,
    getTotalSessions,
    getRecentSessions
  };
};

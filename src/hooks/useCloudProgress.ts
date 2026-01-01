import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useCloudProgress = () => {
  const { user } = useAuth();

  const saveScore = useCallback(async (exerciseId: string, score: number): Promise<{ success: boolean; error?: Error }> => {
    if (!user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    try {
      // Upsert progress (update if exists, insert if not)
      const { data: existing, error: selectError } = await supabase
        .from('user_progress')
        .select('best_score, attempts')
        .eq('user_id', user.id)
        .eq('exercise_id', exerciseId)
        .maybeSingle();

      if (selectError) {
        throw new Error(`Failed to fetch existing progress: ${selectError.message}`);
      }

      if (existing) {
        // Update if new score is better
        const newBestScore = Math.max(existing.best_score, score);
        const { error: updateError } = await supabase
          .from('user_progress')
          .update({
            best_score: newBestScore,
            attempts: existing.attempts + 1
          })
          .eq('user_id', user.id)
          .eq('exercise_id', exerciseId);

        if (updateError) {
          throw new Error(`Failed to update progress: ${updateError.message}`);
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('user_progress')
          .insert({
            user_id: user.id,
            exercise_id: exerciseId,
            best_score: score,
            attempts: 1
          });

        if (insertError) {
          throw new Error(`Failed to save progress: ${insertError.message}`);
        }
      }

      // Add session record
      const { error: sessionError } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          exercise_id: exerciseId,
          score: score
        });

      if (sessionError) {
        throw new Error(`Failed to save session: ${sessionError.message}`);
      }

      // Update streak
      const streakResult = await updateStreak();
      if (!streakResult.success) {
        // Don't fail the whole operation if streak update fails
        console.warn('Streak update failed:', streakResult.error);
      }

      return { success: true };
    } catch (error) {
      console.error('Error saving score:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error occurred while saving score')
      };
    }
  }, [user]);

  const updateStreak = useCallback(async (): Promise<{ success: boolean; error?: Error }> => {
    if (!user) {
      return { success: false, error: new Error('User not authenticated') };
    }

    try {
      const today = new Date().toISOString().split('T')[0];

      const { data: streakData, error: selectError } = await supabase
        .from('user_streaks')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (selectError) {
        throw new Error(`Failed to fetch streak data: ${selectError.message}`);
      }

      if (!streakData) {
        // Create new streak record
        const { error: insertError } = await supabase
          .from('user_streaks')
          .insert({
            user_id: user.id,
            current_streak: 1,
            longest_streak: 1,
            last_activity_date: today
          });

        if (insertError) {
          throw new Error(`Failed to create streak: ${insertError.message}`);
        }
        return { success: true };
      }

      const lastDate = streakData.last_activity_date;

      if (lastDate === today) {
        // Already recorded today
        return { success: true };
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = 1;
      if (lastDate === yesterdayStr) {
        // Consecutive day
        newStreak = streakData.current_streak + 1;
      }

      const { error: updateError } = await supabase
        .from('user_streaks')
        .update({
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, streakData.longest_streak),
          last_activity_date: today
        })
        .eq('user_id', user.id);

      if (updateError) {
        throw new Error(`Failed to update streak: ${updateError.message}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating streak:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error occurred while updating streak')
      };
    }
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
      .order('created_at', { ascending: true })
      .limit(200); // Limit to 200 sessions to prevent performance issues

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

import { useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useUsageTracking = () => {
  const { user } = useAuth();
  const sessionStartRef = useRef<number | null>(null);
  const lastSaveRef = useRef<number>(0);

  const saveUsage = useCallback(async () => {
    if (!user || !sessionStartRef.current) return;

    const now = Date.now();
    const sessionDuration = Math.floor((now - sessionStartRef.current) / 1000);
    
    // Only save if at least 5 seconds have passed since last save
    if (now - lastSaveRef.current < 5000) return;
    lastSaveRef.current = now;

    const today = new Date().toISOString().split('T')[0];

    try {
      // Try to get existing record for today
      const { data: existing } = await supabase
        .from('user_daily_usage')
        .select('id, total_seconds, session_count')
        .eq('user_id', user.id)
        .eq('usage_date', today)
        .maybeSingle();

      if (existing) {
        // Update existing record
        await supabase
          .from('user_daily_usage')
          .update({
            total_seconds: existing.total_seconds + sessionDuration,
          })
          .eq('id', existing.id);
      } else {
        // Insert new record
        await supabase
          .from('user_daily_usage')
          .insert({
            user_id: user.id,
            usage_date: today,
            total_seconds: sessionDuration,
            session_count: 1,
          });
      }

      // Reset session start to now (to avoid double counting)
      sessionStartRef.current = now;
    } catch (error) {
      console.error('Error saving usage:', error);
    }
  }, [user]);

  const incrementSessionCount = useCallback(async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    try {
      const { data: existing } = await supabase
        .from('user_daily_usage')
        .select('id, session_count')
        .eq('user_id', user.id)
        .eq('usage_date', today)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('user_daily_usage')
          .update({ session_count: existing.session_count + 1 })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('user_daily_usage')
          .insert({
            user_id: user.id,
            usage_date: today,
            total_seconds: 0,
            session_count: 1,
          });
      }
    } catch (error) {
      console.error('Error incrementing session count:', error);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    // Start tracking
    sessionStartRef.current = Date.now();
    incrementSessionCount();

    // Save periodically (every 30 seconds)
    const interval = setInterval(saveUsage, 30000);

    // Save on visibility change (when user leaves/returns)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        saveUsage();
      } else {
        // Resume tracking
        sessionStartRef.current = Date.now();
      }
    };

    // Save before unload
    const handleBeforeUnload = () => {
      saveUsage();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      saveUsage();
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user, saveUsage, incrementSessionCount]);
};

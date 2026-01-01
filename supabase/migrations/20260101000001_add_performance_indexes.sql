-- Add database indexes for performance optimization
-- These indexes will significantly improve query performance as data grows

-- Index for user_progress queries (most common: lookup by user_id and exercise_id)
CREATE INDEX IF NOT EXISTS idx_user_progress_user_exercise
  ON public.user_progress(user_id, exercise_id);

-- Index for user_progress by user only (for getting all user's progress)
CREATE INDEX IF NOT EXISTS idx_user_progress_user
  ON public.user_progress(user_id);

-- Index for sessions queries (dashboard queries by user and date)
CREATE INDEX IF NOT EXISTS idx_sessions_user_created
  ON public.sessions(user_id, created_at DESC);

-- Index for sessions by exercise (for exercise-specific history)
CREATE INDEX IF NOT EXISTS idx_sessions_user_exercise
  ON public.sessions(user_id, exercise_id, created_at DESC);

-- Index for user_streaks (frequently queried by user_id)
CREATE INDEX IF NOT EXISTS idx_streaks_user
  ON public.user_streaks(user_id);

-- Index for profiles email lookup (used in admin checks)
CREATE INDEX IF NOT EXISTS idx_profiles_email
  ON public.profiles(email);

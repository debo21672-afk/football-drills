-- Fix critical security issue: Add proper admin authorization
-- This migration adds is_admin column and fixes RLS policies

-- Add is_admin column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Drop the insecure admin policies that allow anyone to view all data
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all progress" ON public.user_progress;
DROP POLICY IF EXISTS "Admins can view all sessions" ON public.sessions;
DROP POLICY IF EXISTS "Admins can view all streaks" ON public.user_streaks;

-- Create secure admin policies that check is_admin column
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can view all progress"
  ON public.user_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can view all sessions"
  ON public.sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

CREATE POLICY "Admins can view all streaks"
  ON public.user_streaks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Set admin status for the designated admin user
-- Replace with your actual admin email
UPDATE public.profiles
SET is_admin = true
WHERE email = 'debo21672@gmail.com';

-- Create index for faster admin checks
CREATE INDEX IF NOT EXISTS idx_profiles_admin ON public.profiles(id, is_admin) WHERE is_admin = true;

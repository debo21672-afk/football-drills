-- Create user_daily_usage table to track time spent per user per day
CREATE TABLE public.user_daily_usage (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    usage_date date NOT NULL DEFAULT CURRENT_DATE,
    total_seconds integer NOT NULL DEFAULT 0,
    session_count integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, usage_date)
);

-- Enable RLS
ALTER TABLE public.user_daily_usage ENABLE ROW LEVEL SECURITY;

-- Users can view their own usage
CREATE POLICY "Users can view their own usage"
  ON public.user_daily_usage FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own usage
CREATE POLICY "Users can insert their own usage"
  ON public.user_daily_usage FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own usage
CREATE POLICY "Users can update their own usage"
  ON public.user_daily_usage FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all usage
CREATE POLICY "Admins can view all usage"
  ON public.user_daily_usage FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_user_daily_usage_updated_at
  BEFORE UPDATE ON public.user_daily_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
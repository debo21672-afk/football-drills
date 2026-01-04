-- Create notification settings table for admin configuration
CREATE TABLE public.notification_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can view and modify settings
CREATE POLICY "Admins can view notification settings"
ON public.notification_settings
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert notification settings"
ON public.notification_settings
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update notification settings"
ON public.notification_settings
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete notification settings"
ON public.notification_settings
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_notification_settings_updated_at
    BEFORE UPDATE ON public.notification_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create notification log table to track sent notifications
CREATE TABLE public.notification_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_type TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    metadata JSONB,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view logs
CREATE POLICY "Admins can view notification logs"
ON public.notification_log
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default notification settings
INSERT INTO public.notification_settings (setting_key, setting_value) VALUES
('inactivity_threshold_days', '3'::jsonb),
('inactivity_alerts_enabled', 'true'::jsonb),
('daily_summary_enabled', 'true'::jsonb),
('milestone_alerts_enabled', 'true'::jsonb),
('admin_email', '"debo21672@gmail.com"'::jsonb),
('streak_milestones', '[7, 14, 30]'::jsonb);
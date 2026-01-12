import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationSettings {
  inactivity_threshold_days: number;
  inactivity_alerts_enabled: boolean;
  daily_summary_enabled: boolean;
  milestone_alerts_enabled: boolean;
  admin_email: string;
  streak_milestones: number[];
}

interface UserActivity {
  user_id: string;
  email: string;
  display_name: string | null;
  last_activity: string | null;
  days_inactive: number;
  current_streak: number;
  longest_streak: number;
  total_sessions: number;
}

async function getSettings(supabase: ReturnType<typeof createClient>): Promise<NotificationSettings> {
  const { data, error } = await supabase
    .from('notification_settings')
    .select('setting_key, setting_value');

  if (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }

  const settings: NotificationSettings = {
    inactivity_threshold_days: 3,
    inactivity_alerts_enabled: true,
    daily_summary_enabled: true,
    milestone_alerts_enabled: true,
    admin_email: 'debo21672@gmail.com',
    streak_milestones: [7, 14, 30],
  };

  for (const row of data || []) {
    const key = row.setting_key as keyof NotificationSettings;
    if (key in settings) {
      (settings as Record<string, unknown>)[key] = row.setting_value;
    }
  }

  return settings;
}

async function getUserActivities(supabase: ReturnType<typeof createClient>): Promise<UserActivity[]> {
  // Get all users with their activity data
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, email, display_name');

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    throw profilesError;
  }

  const activities: UserActivity[] = [];
  const today = new Date();

  for (const profile of profiles || []) {
    // Get last activity from user_daily_usage
    const { data: usageData } = await supabase
      .from('user_daily_usage')
      .select('usage_date')
      .eq('user_id', profile.id)
      .order('usage_date', { ascending: false })
      .limit(1);

    // Get streak data
    const { data: streakData } = await supabase
      .from('user_streaks')
      .select('current_streak, longest_streak')
      .eq('user_id', profile.id)
      .single();

    // Get total sessions
    const { count: sessionCount } = await supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id);

    const lastActivity = usageData?.[0]?.usage_date || null;
    const daysInactive = lastActivity
      ? Math.floor((today.getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    activities.push({
      user_id: profile.id,
      email: profile.email,
      display_name: profile.display_name,
      last_activity: lastActivity,
      days_inactive: daysInactive,
      current_streak: streakData?.current_streak || 0,
      longest_streak: streakData?.longest_streak || 0,
      total_sessions: sessionCount || 0,
    });
  }

  return activities;
}

async function checkMilestones(
  supabase: ReturnType<typeof createClient>,
  settings: NotificationSettings
): Promise<{ type: string; user: UserActivity; milestone: string }[]> {
  const milestones: { type: string; user: UserActivity; milestone: string }[] = [];
  const activities = await getUserActivities(supabase);
  const today = new Date().toISOString().split('T')[0];

  for (const user of activities) {
    // Check streak milestones
    for (const milestone of settings.streak_milestones) {
      if (user.current_streak === milestone) {
        // Check if we already notified about this
        const { data: existingLog } = await supabase
          .from('notification_log')
          .select('id')
          .eq('user_id', user.user_id)
          .eq('notification_type', 'streak_milestone')
          .gte('sent_at', today)
          .single();

        if (!existingLog) {
          milestones.push({
            type: 'streak',
            user,
            milestone: `${milestone}-day streak`,
          });
        }
      }
    }

    // Check first activity (total_sessions = 1)
    if (user.total_sessions === 1) {
      const { data: existingLog } = await supabase
        .from('notification_log')
        .select('id')
        .eq('user_id', user.user_id)
        .eq('notification_type', 'first_activity')
        .single();

      if (!existingLog) {
        milestones.push({
          type: 'first_activity',
          user,
          milestone: 'First exercise completed',
        });
      }
    }

    // Check level completions (would need to track this separately - simplified for now)
  }

  return milestones;
}

async function sendInactivityAlert(
  settings: NotificationSettings,
  inactiveUsers: UserActivity[]
): Promise<void> {
  if (inactiveUsers.length === 0) return;

  const userList = inactiveUsers
    .map(u => `• ${u.display_name || u.email} - ${u.days_inactive} days inactive`)
    .join('\n');

  const html = `
    <h2>⚠️ Inactive Users Alert</h2>
    <p>The following users have been inactive for ${settings.inactivity_threshold_days}+ days:</p>
    <pre style="background: #f4f4f4; padding: 15px; border-radius: 5px;">${userList}</pre>
    <p>Total inactive users: ${inactiveUsers.length}</p>
    <hr>
    <p style="color: #666; font-size: 12px;">Football Training App - Admin Notifications</p>
  `;

  const response = await resend.emails.send({
    from: 'Football Training <onboarding@resend.dev>',
    to: [settings.admin_email],
    subject: `⚠️ ${inactiveUsers.length} Inactive User${inactiveUsers.length > 1 ? 's' : ''} Alert`,
    html,
  });

  console.log('Inactivity alert sent:', response);
}

async function sendDailySummary(
  settings: NotificationSettings,
  activities: UserActivity[]
): Promise<void> {
  const totalUsers = activities.length;
  const activeToday = activities.filter(u => u.days_inactive === 0).length;
  const inactiveCount = activities.filter(u => u.days_inactive >= settings.inactivity_threshold_days).length;
  const avgStreak = activities.reduce((sum, u) => sum + u.current_streak, 0) / (totalUsers || 1);
  const totalSessions = activities.reduce((sum, u) => sum + u.total_sessions, 0);

  const topStreaks = [...activities]
    .sort((a, b) => b.current_streak - a.current_streak)
    .slice(0, 5)
    .map(u => `• ${u.display_name || u.email}: ${u.current_streak} days`)
    .join('\n');

  const html = `
    <h2>📊 Daily Summary Report</h2>
    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
    
    <h3>📈 Key Metrics</h3>
    <ul>
      <li><strong>Total Users:</strong> ${totalUsers}</li>
      <li><strong>Active Today:</strong> ${activeToday}</li>
      <li><strong>Inactive (${settings.inactivity_threshold_days}+ days):</strong> ${inactiveCount}</li>
      <li><strong>Average Streak:</strong> ${avgStreak.toFixed(1)} days</li>
      <li><strong>Total Sessions:</strong> ${totalSessions}</li>
    </ul>
    
    <h3>🏆 Top Streaks</h3>
    <pre style="background: #f4f4f4; padding: 15px; border-radius: 5px;">${topStreaks || 'No active streaks'}</pre>
    
    <hr>
    <p style="color: #666; font-size: 12px;">Football Training App - Daily Summary</p>
  `;

  const response = await resend.emails.send({
    from: 'Football Training <onboarding@resend.dev>',
    to: [settings.admin_email],
    subject: `📊 Daily Summary - ${activeToday}/${totalUsers} Active Users`,
    html,
  });

  console.log('Daily summary sent:', response);
}

async function sendMilestoneAlerts(
  supabase: ReturnType<typeof createClient>,
  settings: NotificationSettings,
  milestones: { type: string; user: UserActivity; milestone: string }[]
): Promise<void> {
  if (milestones.length === 0) return;

  const milestoneList = milestones
    .map(m => `• ${m.user.display_name || m.user.email}: ${m.milestone}`)
    .join('\n');

  const html = `
    <h2>🎉 User Milestones Achieved!</h2>
    <p>The following users have achieved milestones:</p>
    <pre style="background: #f4f4f4; padding: 15px; border-radius: 5px;">${milestoneList}</pre>
    <hr>
    <p style="color: #666; font-size: 12px;">Football Training App - Milestone Alerts</p>
  `;

  const response = await resend.emails.send({
    from: 'Football Training <onboarding@resend.dev>',
    to: [settings.admin_email],
    subject: `🎉 ${milestones.length} New Milestone${milestones.length > 1 ? 's' : ''} Achieved!`,
    html,
  });

  // Log sent notifications
  for (const m of milestones) {
    await supabase.from('notification_log').insert({
      notification_type: m.type === 'streak' ? 'streak_milestone' : m.type,
      recipient_email: settings.admin_email,
      subject: `Milestone: ${m.milestone}`,
      user_id: m.user.user_id,
      metadata: { milestone: m.milestone },
    });
  }

  console.log('Milestone alerts sent:', response);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    // Authenticate the request - require admin role
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('Missing or invalid Authorization header');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Missing authentication' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create client with user's auth token to validate
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await authClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error('Invalid token:', claimsError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log('Authenticated user:', userId);

    // Use service role client to check admin role (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if user has admin role
    const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: 'admin'
    });

    if (roleError) {
      console.error('Error checking admin role:', roleError);
      return new Response(
        JSON.stringify({ error: 'Error checking permissions' }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!isAdmin) {
      console.error('User is not an admin:', userId);
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Admin access verified for user:', userId);
    
    // Get notification settings
    const settings = await getSettings(supabase);
    console.log('Notification settings:', settings);

    // Get user activities
    const activities = await getUserActivities(supabase);
    console.log(`Found ${activities.length} users`);

    const results: string[] = [];

    // Send inactivity alerts
    if (settings.inactivity_alerts_enabled) {
      const inactiveUsers = activities.filter(
        u => u.days_inactive >= settings.inactivity_threshold_days
      );
      if (inactiveUsers.length > 0) {
        await sendInactivityAlert(settings, inactiveUsers);
        results.push(`Sent inactivity alert for ${inactiveUsers.length} users`);
        
        // Log notification
        await supabase.from('notification_log').insert({
          notification_type: 'inactivity_alert',
          recipient_email: settings.admin_email,
          subject: `Inactivity Alert - ${inactiveUsers.length} users`,
          metadata: { user_count: inactiveUsers.length },
        });
      }
    }

    // Send daily summary
    if (settings.daily_summary_enabled) {
      await sendDailySummary(settings, activities);
      results.push('Sent daily summary');
      
      await supabase.from('notification_log').insert({
        notification_type: 'daily_summary',
        recipient_email: settings.admin_email,
        subject: 'Daily Summary',
        metadata: { total_users: activities.length },
      });
    }

    // Check and send milestone alerts
    if (settings.milestone_alerts_enabled) {
      const milestones = await checkMilestones(supabase, settings);
      if (milestones.length > 0) {
        await sendMilestoneAlerts(supabase, settings, milestones);
        results.push(`Sent ${milestones.length} milestone alerts`);
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-notifications:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

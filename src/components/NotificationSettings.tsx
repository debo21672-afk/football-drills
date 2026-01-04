import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bell, Mail, Clock, Trophy, AlertTriangle, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

interface NotificationSettingsData {
  inactivity_threshold_days: number;
  inactivity_alerts_enabled: boolean;
  daily_summary_enabled: boolean;
  milestone_alerts_enabled: boolean;
  admin_email: string;
  streak_milestones: number[];
}

export const NotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettingsData>({
    inactivity_threshold_days: 3,
    inactivity_alerts_enabled: true,
    daily_summary_enabled: true,
    milestone_alerts_enabled: true,
    admin_email: 'debo21672@gmail.com',
    streak_milestones: [7, 14, 30],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [newMilestone, setNewMilestone] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('setting_key, setting_value');

      if (error) throw error;

      const loadedSettings = { ...settings };
      for (const row of data || []) {
        const key = row.setting_key as keyof NotificationSettingsData;
        if (key in loadedSettings) {
          (loadedSettings as Record<string, unknown>)[key] = row.setting_value;
        }
      }
      setSettings(loadedSettings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load notification settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async (key: string, value: Json) => {
    try {
      // Check if setting exists
      const { data: existing } = await supabase
        .from('notification_settings')
        .select('id')
        .eq('setting_key', key)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('notification_settings')
          .update({ setting_value: value })
          .eq('setting_key', key);
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from('notification_settings')
          .insert({ setting_key: key, setting_value: value });
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving setting:', error);
      throw error;
    }
  };

  const handleToggle = async (key: keyof NotificationSettingsData, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    try {
      await saveSetting(key, value);
      toast.success('Setting updated');
    } catch {
      toast.error('Failed to update setting');
      setSettings(prev => ({ ...prev, [key]: !value }));
    }
  };

  const handleNumberChange = async (key: keyof NotificationSettingsData, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveThreshold = async () => {
    setSaving(true);
    try {
      await saveSetting('inactivity_threshold_days', settings.inactivity_threshold_days);
      toast.success('Inactivity threshold saved');
    } catch {
      toast.error('Failed to save threshold');
    } finally {
      setSaving(false);
    }
  };

  const handleEmailChange = async () => {
    setSaving(true);
    try {
      await saveSetting('admin_email', settings.admin_email);
      toast.success('Admin email saved');
    } catch {
      toast.error('Failed to save email');
    } finally {
      setSaving(false);
    }
  };

  const addMilestone = async () => {
    const milestone = parseInt(newMilestone);
    if (isNaN(milestone) || milestone <= 0) {
      toast.error('Please enter a valid number');
      return;
    }
    if (settings.streak_milestones.includes(milestone)) {
      toast.error('Milestone already exists');
      return;
    }

    const updatedMilestones = [...settings.streak_milestones, milestone].sort((a, b) => a - b);
    setSettings(prev => ({ ...prev, streak_milestones: updatedMilestones }));
    setNewMilestone('');

    try {
      await saveSetting('streak_milestones', updatedMilestones);
      toast.success('Milestone added');
    } catch {
      toast.error('Failed to add milestone');
    }
  };

  const removeMilestone = async (milestone: number) => {
    const updatedMilestones = settings.streak_milestones.filter(m => m !== milestone);
    setSettings(prev => ({ ...prev, streak_milestones: updatedMilestones }));

    try {
      await saveSetting('streak_milestones', updatedMilestones);
      toast.success('Milestone removed');
    } catch {
      toast.error('Failed to remove milestone');
    }
  };

  const testNotifications = async () => {
    setTesting(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-notifications');
      
      if (error) throw error;
      
      toast.success('Test notifications sent! Check your email.');
      console.log('Notification results:', data);
    } catch (error) {
      console.error('Error testing notifications:', error);
      toast.error('Failed to send test notifications');
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Email Notifications
        </CardTitle>
        <CardDescription>
          Configure email notifications for user activity alerts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Admin Email */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Admin Email
          </Label>
          <div className="flex gap-2">
            <Input
              type="email"
              value={settings.admin_email}
              onChange={(e) => setSettings(prev => ({ ...prev, admin_email: e.target.value }))}
              placeholder="admin@example.com"
            />
            <Button onClick={handleEmailChange} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Notification Types */}
        <div className="space-y-4">
          <h4 className="font-medium">Notification Types</h4>
          
          {/* Inactivity Alerts */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium">Inactivity Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when users haven't been active
                </p>
              </div>
            </div>
            <Switch
              checked={settings.inactivity_alerts_enabled}
              onCheckedChange={(checked) => handleToggle('inactivity_alerts_enabled', checked)}
            />
          </div>

          {/* Inactivity Threshold */}
          {settings.inactivity_alerts_enabled && (
            <div className="ml-8 space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Inactivity Threshold (days)
              </Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={settings.inactivity_threshold_days}
                  onChange={(e) => handleNumberChange('inactivity_threshold_days', parseInt(e.target.value) || 3)}
                  className="w-24"
                />
                <span className="text-sm text-muted-foreground">days of no activity</span>
                <Button size="sm" onClick={handleSaveThreshold} disabled={saving}>
                  Save
                </Button>
              </div>
            </div>
          )}

          {/* Daily Summary */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Daily Summary</p>
                <p className="text-sm text-muted-foreground">
                  Receive a daily overview of user engagement
                </p>
              </div>
            </div>
            <Switch
              checked={settings.daily_summary_enabled}
              onCheckedChange={(checked) => handleToggle('daily_summary_enabled', checked)}
            />
          </div>

          {/* Milestone Alerts */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium">Milestone Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when users achieve milestones
                </p>
              </div>
            </div>
            <Switch
              checked={settings.milestone_alerts_enabled}
              onCheckedChange={(checked) => handleToggle('milestone_alerts_enabled', checked)}
            />
          </div>

          {/* Streak Milestones */}
          {settings.milestone_alerts_enabled && (
            <div className="ml-8 space-y-3">
              <Label>Streak Milestones (days)</Label>
              <div className="flex flex-wrap gap-2">
                {settings.streak_milestones.map(milestone => (
                  <Badge 
                    key={milestone} 
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeMilestone(milestone)}
                  >
                    {milestone} days ×
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min={1}
                  placeholder="Add milestone..."
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  className="w-32"
                  onKeyDown={(e) => e.key === 'Enter' && addMilestone()}
                />
                <Button size="sm" variant="outline" onClick={addMilestone}>
                  Add
                </Button>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Test Button */}
        <div className="flex justify-end">
          <Button onClick={testNotifications} disabled={testing}>
            {testing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Send Test Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

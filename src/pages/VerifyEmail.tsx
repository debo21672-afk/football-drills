import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Mail, Loader2, LogOut, RefreshCw } from 'lucide-react';

const VerifyEmail = () => {
  const { user, signOut } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const handleResendVerification = async () => {
    if (!user?.email) return;

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) {
        toast({
          title: 'Failed to resend email',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Verification email sent!',
          description: 'Check your inbox for the verification link.'
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to resend verification email',
        variant: 'destructive'
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refresh the session to check if email has been verified
      const { data: { session }, error } = await supabase.auth.refreshSession();

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive'
        });
        setIsRefreshing(false);
        return;
      }

      // Check if email is now verified
      if (session?.user?.email_confirmed_at) {
        toast({
          title: 'Email verified!',
          description: 'Redirecting you to the app...'
        });

        // Wait a moment before redirecting
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      } else {
        toast({
          title: 'Email not yet verified',
          description: 'Please click the link in your email and try again.',
          variant: 'destructive'
        });
        setIsRefreshing(false);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to refresh session',
        variant: 'destructive'
      });
      setIsRefreshing(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center justify-center">
      <Card className="max-w-md w-full border-2 border-blue-500">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-10 h-10 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription className="text-base">
            We sent a verification email to <span className="font-semibold">{user?.email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="font-semibold text-blue-900 mb-2">To continue, please:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-800 ml-2">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the verification link in the email</li>
              <li>Return here and click "I've Verified My Email"</li>
            </ol>
          </div>

          <div className="space-y-2">
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="w-full gap-2"
              size="lg"
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  I've Verified My Email
                </>
              )}
            </Button>

            <Button
              onClick={handleResendVerification}
              disabled={isResending}
              variant="outline"
              className="w-full gap-2"
              size="lg"
            >
              {isResending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Resend Verification Email
                </>
              )}
            </Button>

            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Didn't receive the email? Check your spam folder or try resending.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;

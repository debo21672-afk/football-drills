import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  displayName: z.string().max(50, 'Display name must be less than 50 characters').optional()
});

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

type AuthMode = 'login' | 'signup' | 'forgot';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; displayName?: string }>({});
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  const { user, signIn, signUp, signInWithGoogle, resetPassword, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const validateForm = () => {
    try {
      if (mode === 'forgot') {
        emailSchema.parse({ email });
      } else {
        authSchema.parse({ email, password, displayName: displayName || undefined });
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string; displayName?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: 'Google Sign In Failed',
          description: error.message,
          variant: 'destructive'
        });
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trim and sanitize email
    const trimmedEmail = email.trim().toLowerCase();
    setEmail(trimmedEmail);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (mode === 'forgot') {
        const { error } = await resetPassword(trimmedEmail);
        if (error) {
          toast({
            title: 'Reset Failed',
            description: error.message,
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Check your email',
            description: 'We sent you a password reset link.'
          });
          setMode('login');
        }
      } else if (mode === 'login') {
        const { error } = await signIn(trimmedEmail, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: 'Login Failed',
              description: 'Invalid email or password. Please try again.',
              variant: 'destructive'
            });
          } else {
            toast({
              title: 'Login Failed',
              description: error.message,
              variant: 'destructive'
            });
          }
        } else {
          toast({
            title: 'Welcome back!',
            description: 'You have successfully logged in.'
          });
        }
      } else {
        const { error } = await signUp(trimmedEmail, password, displayName.trim());
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Sign Up Failed',
              description: 'This email is already registered. Please log in instead.',
              variant: 'destructive'
            });
          } else {
            toast({
              title: 'Sign Up Failed',
              description: error.message,
              variant: 'destructive'
            });
          }
        } else {
          // Show email verification screen
          setSignupEmail(trimmedEmail);
          setShowEmailVerification(true);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    setIsResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: signupEmail,
      });

      if (error) {
        toast({
          title: 'Failed to Resend Email',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Email Sent!',
          description: 'Check your inbox for the verification link.'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsResendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Show email verification screen after signup
  if (showEmailVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">📧</div>
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a verification link to <strong>{signupEmail}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
              <p className="font-semibold mb-2">Next Steps:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the verification link in the email</li>
                <li>Return here to log in</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-900">
              <p className="font-semibold mb-1">⚠️ Important</p>
              <p>You must verify your email before you can log in. The verification link will expire in 24 hours.</p>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Didn't receive the email?{' '}
              <button
                type="button"
                onClick={handleResendVerificationEmail}
                disabled={isResendingEmail}
                className="text-primary hover:underline font-medium disabled:opacity-50"
              >
                {isResendingEmail ? 'Sending...' : 'Resend verification email'}
              </button>
            </div>

            <Button
              onClick={() => {
                setShowEmailVerification(false);
                setMode('login');
                setEmail('');
                setPassword('');
                setDisplayName('');
                setErrors({});
              }}
              className="w-full"
              variant="outline"
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTitle = () => {
    switch (mode) {
      case 'forgot': return 'Reset Password';
      case 'signup': return 'Join Football Skills';
      default: return 'Welcome Back!';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'forgot': return 'Enter your email and we\'ll send you a reset link';
      case 'signup': return 'Create an account to save your training progress';
      default: return 'Log in to track your progress and compete';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {mode === 'forgot' && (
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrors({});
              }}
              className="absolute left-4 top-4 text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="text-6xl mb-4">{mode === 'forgot' ? '📧' : '⚽'}</div>
          <CardTitle className="text-2xl">{getTitle()}</CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Your name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={`h-12 ${errors.displayName ? 'border-red-500' : ''}`}
                  aria-invalid={!!errors.displayName}
                  aria-describedby={errors.displayName ? "displayname-error" : undefined}
                />
                {errors.displayName && (
                  <p id="displayname-error" className="text-sm text-red-500" role="alert">{errors.displayName}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`h-12 ${errors.email ? 'border-red-500' : ''}`}
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-500" role="alert">{errors.email}</p>
              )}
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`h-12 ${errors.password ? 'border-red-500' : ''}`}
                  required
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                {errors.password && (
                  <p id="password-error" className="text-sm text-red-500" role="alert">{errors.password}</p>
                )}
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setErrors({});
                  }}
                  className="text-sm text-muted-foreground hover:text-primary underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {mode === 'forgot' ? 'Sending...' : mode === 'login' ? 'Logging in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'forgot' ? 'Send Reset Link' : mode === 'login' ? 'Log In' : 'Create Account'
              )}
            </Button>
          </form>

          {mode !== 'forgot' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 gap-2 text-base"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                Continue with Google
              </Button>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'signup' : 'login');
                    setErrors({});
                  }}
                  className="text-sm text-muted-foreground hover:text-primary underline"
                >
                  {mode === 'login' 
                    ? "Don't have an account? Sign up" 
                    : 'Already have an account? Log in'}
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;

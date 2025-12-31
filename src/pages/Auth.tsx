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
  
  const { user, signIn, signUp, resetPassword, loading } = useAuth();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);

    try {
      if (mode === 'forgot') {
        const { error } = await resetPassword(email);
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
        const { error } = await signIn(email, password);
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
        const { error } = await signUp(email, password, displayName);
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
          toast({
            title: 'Account created!',
            description: 'Welcome to Football Skills Training!'
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Loader2 className="w-8 h-8 animate-spin" />
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
                />
                {errors.displayName && (
                  <p className="text-sm text-red-500">{errors.displayName}</p>
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
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
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
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
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

            <Button type="submit" className="w-full" disabled={isLoading}>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;

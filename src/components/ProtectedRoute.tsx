import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-emerald-900">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  // Not authenticated - redirect to auth
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Authenticated but email not verified - redirect to verify email page
  // Allow access to verify-email page itself to avoid redirect loop
  if (!user.email_confirmed_at && location.pathname !== '/verify-email') {
    return <Navigate to="/verify-email" replace />;
  }

  // Authenticated and verified - allow access
  return <>{children}</>;
};

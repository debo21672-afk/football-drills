import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { OfflineBanner } from "@/components/OfflineBanner";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { ProfileSkeleton } from "@/components/skeletons/ProfileSkeleton";
import { LevelSkeleton } from "@/components/skeletons/LevelSkeleton";

// Lazy load route components for better performance
const Index = lazy(() => import("./pages/Index"));
const Level = lazy(() => import("./pages/Level"));
const Exercise = lazy(() => import("./pages/Exercise"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (replaces cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const isOnline = useOnlineStatus();

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <OfflineBanner isOnline={isOnline} />
            <BrowserRouter>
              <Suspense fallback={<LoadingSpinner message="Loading..." />}>
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route
                    path="/verify-email"
                    element={
                      <ProtectedRoute>
                        <VerifyEmail />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Suspense fallback={<DashboardSkeleton />}>
                          <Dashboard />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Suspense fallback={<ProfileSkeleton />}>
                          <Profile />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <Suspense fallback={<LoadingSpinner message="Loading admin panel..." />}>
                          <Admin />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/level/:levelId"
                    element={
                      <ProtectedRoute>
                        <Suspense fallback={<LevelSkeleton />}>
                          <Level />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/exercise/:exerciseId"
                    element={
                      <ProtectedRoute>
                        <Exercise />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;

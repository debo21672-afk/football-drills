import React, { Component, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home, RotateCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });

    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error reporting service (e.g., Sentry)
      console.log('Production error logged:', { error, errorInfo });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  handleClearAndReload = () => {
    // Clear potentially corrupted data
    try {
      // Only clear app-specific data, not auth tokens
      localStorage.removeItem('footballAppProgress');
      localStorage.removeItem('footballAppSettings');
      localStorage.removeItem('footballAppStreak');
      localStorage.removeItem('footballAppSessions');

      // Show alert before reload
      alert('Local data cleared. The app will now reload.');
      window.location.reload();
    } catch (e) {
      console.error('Failed to clear local storage:', e);
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 flex items-center justify-center">
          <Card className="max-w-md border-2 border-red-500 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-xl text-red-600">
                Oops! Something went wrong
              </CardTitle>
              <CardDescription className="text-gray-600">
                We encountered an unexpected error. Your cloud progress is safe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <p className="font-semibold text-blue-900 mb-1">Try these solutions:</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-800 ml-2">
                  <li>Click "Reload Page" to refresh the app</li>
                  <li>Click "Go Home" to return to the main page</li>
                  <li>If the error persists, try "Clear & Reload"</li>
                </ol>
              </div>

              {this.state.error && (
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                    Technical details (for debugging)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                    <div className="font-semibold text-gray-900 mb-1">Error:</div>
                    <pre className="text-red-700 mb-2 whitespace-pre-wrap">
                      {this.state.error.toString()}
                    </pre>
                    {this.state.error.stack && (
                      <>
                        <div className="font-semibold text-gray-900 mb-1">Stack Trace:</div>
                        <pre className="text-gray-700 whitespace-pre-wrap">
                          {this.state.error.stack}
                        </pre>
                      </>
                    )}
                  </div>
                </details>
              )}

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Button onClick={this.handleReload} className="flex-1 gap-2" size="lg">
                    <RotateCw className="w-4 h-4" />
                    Reload Page
                  </Button>
                  <Button onClick={this.handleReset} variant="outline" className="flex-1 gap-2" size="lg">
                    <Home className="w-4 h-4" />
                    Go Home
                  </Button>
                </div>

                <Button
                  onClick={this.handleClearAndReload}
                  variant="destructive"
                  className="w-full gap-2"
                  size="lg"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Local Data & Reload
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Note: "Clear & Reload" removes local cached data but preserves your cloud progress
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

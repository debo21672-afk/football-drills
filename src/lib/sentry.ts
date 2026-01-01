// Sentry Error Monitoring Configuration
// Install with: npm install @sentry/react

// Uncomment when @sentry/react is installed
/*
import * as Sentry from "@sentry/react";

export const initSentry = () => {
  // Only initialize in production
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,

      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring
      // We recommend adjusting this value in production
      tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,

      // Capture Replay for 10% of all sessions,
      // plus 100% of sessions with an error
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,

      // Integrations
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],

      // Filter out sensitive data
      beforeSend(event, hint) {
        // Don't send events for local development
        if (window.location.hostname === 'localhost') {
          return null;
        }

        // Remove sensitive data from event
        if (event.request) {
          delete event.request.cookies;
        }

        return event;
      },

      // Ignore certain errors
      ignoreErrors: [
        // Browser extensions
        'top.GLOBALS',
        // Random plugins/extensions
        'originalCreateNotification',
        'canvas.contentDocument',
        'MyApp_RemoveAllHighlights',
        // Network errors
        'NetworkError',
        'Failed to fetch',
        // Auth errors (expected)
        'Invalid login credentials',
        'Email not confirmed',
      ],
    });

    console.log('Sentry initialized');
  } else {
    console.log('Sentry disabled (not in production or DSN not configured)');
  }
};

export const logError = (error: Error, context?: Record<string, any>) => {
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    });
  } else {
    console.error('Error:', error, context);
  }
};

export const logMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.captureMessage(message, level);
  } else {
    console.log(`[${level}]`, message);
  }
};
*/

// Temporary fallback while Sentry is not installed
export const initSentry = () => {
  console.log('Sentry not installed. Install with: npm install @sentry/react');
};

export const logError = (error: Error, context?: Record<string, any>) => {
  console.error('Error:', error, context);
};

export const logMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  console.log(`[${level}]`, message);
};

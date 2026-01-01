// PostHog Analytics Configuration
// Install with: npm install posthog-js

// Uncomment when posthog-js is installed
/*
import posthog from 'posthog-js';

export const initAnalytics = () => {
  if (import.meta.env.VITE_POSTHOG_KEY && import.meta.env.VITE_POSTHOG_HOST) {
    posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
      api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',

      // Privacy-friendly settings
      autocapture: false, // Manual event tracking only
      capture_pageview: true,
      capture_pageleave: true,

      // Respect user privacy
      respect_dnt: true,
      opt_out_capturing_by_default: false,

      // Performance
      loaded: (posthog) => {
        if (import.meta.env.DEV) {
          posthog.debug(); // Enable debug mode in development
        }
      },

      // Session recording (disabled for privacy)
      disable_session_recording: true,
    });

    console.log('PostHog analytics initialized');
  } else {
    console.log('PostHog disabled (API key not configured)');
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof posthog !== 'undefined') {
    posthog.capture(eventName, properties);
  } else {
    console.log('[Analytics Event]', eventName, properties);
  }
};

export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  if (typeof posthog !== 'undefined') {
    posthog.identify(userId, traits);
  } else {
    console.log('[Analytics Identify]', userId, traits);
  }
};

export const resetAnalytics = () => {
  if (typeof posthog !== 'undefined') {
    posthog.reset();
  }
};
*/

// Temporary fallback while PostHog is not installed
export const initAnalytics = () => {
  console.log('PostHog not installed. Install with: npm install posthog-js');
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  console.log('[Analytics Event]', eventName, properties);
};

export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  console.log('[Analytics Identify]', userId, traits);
};

export const resetAnalytics = () => {
  console.log('[Analytics Reset]');
};

# Analytics and Error Monitoring Setup

This guide will help you set up Sentry (error monitoring) and PostHog (analytics) for your Football Skills Tracker application.

## Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install @sentry/react posthog-js
```

### 2. Get API Keys

**Sentry:**
1. Sign up at https://sentry.io
2. Create a new project (React)
3. Copy your DSN (looks like: `https://xxxxx@o000000.ingest.sentry.io/0000000`)

**PostHog:**
1. Sign up at https://posthog.com (or self-host)
2. Create a new project
3. Copy your Project API Key
4. Note your PostHog host (default: `https://app.posthog.com`)

### 3. Add Environment Variables

Add to your `.env` file:

```bash
# Sentry Error Monitoring
VITE_SENTRY_DSN=your-sentry-dsn-here

# PostHog Analytics (Privacy-friendly)
VITE_POSTHOG_KEY=your-posthog-key-here
VITE_POSTHOG_HOST=https://app.posthog.com
```

### 4. Uncomment Integration Code

In the following files, uncomment the code blocks:

**src/lib/sentry.ts:**
- Uncomment the import and full Sentry implementation
- Comment out or remove the temporary fallback functions

**src/lib/analytics.ts:**
- Uncomment the import and full PostHog implementation
- Comment out or remove the temporary fallback functions

**src/main.tsx:**
- Uncomment `initSentry()` call
- Uncomment `initAnalytics()` call

### 5. Test

Run your app in development:
```bash
npm run dev
```

Check the console - you should see:
- ✅ "Sentry initialized" (in production) or "Sentry disabled" (in dev)
- ✅ "PostHog analytics initialized"

## Analytics Events

The app automatically tracks:
- **Page views**: Automatic
- **User identification**: When user logs in
- **Custom events**: Exercise completions, score saves, account actions

## Error Monitoring

Sentry automatically captures:
- **JavaScript errors**: All uncaught exceptions
- **React errors**: Component errors via ErrorBoundary
- **Network errors**: Failed API calls
- **Performance**: Slow page loads and transitions

## Privacy Considerations

Both services are configured with privacy in mind:

**PostHog:**
- ✅ Autocapture disabled (manual events only)
- ✅ Session recording disabled
- ✅ Respects Do Not Track
- ✅ No PII collected automatically

**Sentry:**
- ✅ Sensitive data filtered (cookies, auth tokens)
- ✅ Replay masks all text and media
- ✅ Only 10% of sessions replayed
- ✅ 100% of error sessions replayed
- ✅ Local development errors not sent

## GDPR Compliance

Both services are GDPR-compliant:
- Users can request data deletion
- Data retention periods configured
- Data processing agreements available
- EU data residency options available

## Cost

**Free Tiers (Sufficient for Beta):**
- **Sentry**: 5,000 errors/month, 1 user
- **PostHog**: 1M events/month, unlimited users

## Monitoring Dashboard

**Sentry Dashboard:**
- Real-time error alerts
- Error frequency and trends
- Stack traces and breadcrumbs
- User context and device info

**PostHog Dashboard:**
- User journeys and funnels
- Feature usage analytics
- Retention and engagement metrics
- A/B testing capability

## Alerts

**Recommended Alerts:**

**Sentry:**
1. New error types (immediate email)
2. Error rate spike (> 10 errors/minute)
3. Performance degradation

**PostHog:**
1. Drop in daily active users
2. High bounce rate on key pages
3. Signup funnel drop-off

## Advanced Configuration

### Custom Error Context

```typescript
import { logError } from '@/lib/sentry';

try {
  await riskyOperation();
} catch (error) {
  logError(error, {
    userId: user.id,
    operation: 'save_score',
    exerciseId: 'ball-juggling'
  });
}
```

### Custom Analytics Events

```typescript
import { trackEvent } from '@/lib/analytics';

trackEvent('exercise_completed', {
  exerciseId: 'ball-juggling',
  score: 42,
  duration: 60,
  newPersonalBest: true
});
```

## Troubleshooting

**Sentry not capturing errors:**
- Check DSN is correct
- Verify you're in production mode
- Check console for initialization message

**PostHog not tracking:**
- Check API key is correct
- Verify host URL is correct
- Check browser console for errors
- Disable ad blockers

**High data usage:**
- Reduce Sentry sample rate (currently 10%)
- Reduce PostHog autocapture (already disabled)
- Implement client-side sampling

## Support

- **Sentry Docs**: https://docs.sentry.io/platforms/javascript/guides/react/
- **PostHog Docs**: https://posthog.com/docs
- **Community**: Both have active Discord communities

---

**Next Steps:**
1. Install packages
2. Get API keys
3. Add environment variables
4. Uncomment code
5. Deploy to production
6. Monitor your dashboards!

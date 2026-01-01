# Security Headers Configuration

This document outlines the security headers configured for the Football Skills Tracker application.

## Implemented Security Headers

### 1. X-Content-Type-Options
```
X-Content-Type-Options: nosniff
```
Prevents browsers from MIME-sniffing responses, reducing XSS risks.

### 2. X-Frame-Options
```
X-Frame-Options: DENY
```
Prevents the site from being embedded in iframes, protecting against clickjacking attacks.

### 3. X-XSS-Protection
```
X-XSS-Protection: 1; mode=block
```
Enables browser XSS filtering and blocks page rendering if attack detected.

### 4. Referrer-Policy
```
Referrer-Policy: strict-origin-when-cross-origin
```
Controls how much referrer information is sent with requests.

### 5. Content Security Policy (CSP)
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://*.supabase.co wss://*.supabase.co https://accounts.google.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self'
```

**What this does:**
- `default-src 'self'`: Only allow resources from same origin by default
- `script-src`: Allow scripts from same origin and inline scripts (required for React)
- `style-src`: Allow styles from same origin and inline styles (required for Tailwind)
- `img-src`: Allow images from same origin, data URIs, and HTTPS sources
- `connect-src`: Allow API calls to Supabase and Google OAuth
- `frame-ancestors 'none'`: Prevent embedding in frames
- `base-uri 'self'`: Restrict base tag URLs
- `form-action 'self'`: Only allow form submissions to same origin

**Note:** `unsafe-inline` and `unsafe-eval` are required for React development but should be replaced with nonces in production if possible.

### 6. Permissions Policy
```
Permissions-Policy:
  geolocation=(),
  microphone=(),
  camera=(),
  payment=(),
  usb=(),
  magnetometer=(),
  gyroscope=(),
  accelerometer=()
```
Disables browser features not needed by the application.

### 7. Strict-Transport-Security (HSTS)
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```
Forces HTTPS connections for 1 year, including subdomains. Enables HSTS preloading.

### 8. Cross-Origin Policies
```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
```
Enhanced cross-origin isolation for additional security.

## Deployment Setup

### For Netlify
The `public/_headers` file is automatically deployed and applied.

### For Vercel
Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "geolocation=(), microphone=(), camera=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains; preload" }
      ]
    }
  ]
}
```

### For Cloudflare Pages
Add to `_headers` file in the `public` directory (already included).

### For Supabase Edge Functions
Configure in the Supabase dashboard or add to edge function responses.

## Testing Security Headers

Use these tools to verify headers are correctly set:

1. **securityheaders.com** - Comprehensive header analysis
2. **observatory.mozilla.org** - Mozilla's security scanner
3. **Chrome DevTools** - Network tab → Response Headers
4. **curl command**:
   ```bash
   curl -I https://your-domain.com
   ```

## CORS Configuration

CORS is handled by Supabase for API endpoints. The application allows:
- Supabase API calls: `https://*.supabase.co`
- WebSocket connections: `wss://*.supabase.co`
- Google OAuth: `https://accounts.google.com`

## Email Verification Enforcement

Email verification is enforced at the application level in `ProtectedRoute.tsx`:
- Users must verify their email before accessing protected routes
- Unverified users are redirected to `/verify-email`
- Verification status is checked on every protected route access

## Rate Limiting

Supabase provides built-in rate limiting for:
- Auth endpoints: 30 requests per hour per IP
- API endpoints: Configurable via RLS policies

For additional rate limiting, consider implementing:
- Supabase Edge Functions with rate limiting middleware
- Cloudflare rate limiting rules
- Application-level rate limiting with Redis

## Regular Security Audits

Schedule regular security reviews:
- [ ] Quarterly CSP policy review
- [ ] Monthly dependency updates (`npm audit`)
- [ ] Annual penetration testing
- [ ] Continuous monitoring with security headers scanner

## Additional Recommendations

1. **Enable Supabase Auth Policies**:
   - Email verification required (✅ implemented)
   - Password strength requirements
   - Account lockout after failed attempts

2. **Database Security**:
   - Row Level Security (RLS) enabled on all tables (✅ implemented)
   - Regular backup verification
   - Audit logs for admin actions

3. **Monitoring**:
   - Set up error tracking (e.g., Sentry)
   - Monitor authentication failures
   - Track unusual API usage patterns

4. **User Data Protection**:
   - GDPR data export feature (✅ implemented)
   - Data retention policy
   - User data deletion capability

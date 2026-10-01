/**
 * Browser Security Headers Middleware
 * Implements defensive HTTP headers:
 * - Content-Security-Policy (CSP)
 * - X-Frame-Options: DENY
 * - X-Content-Type-Options: nosniff
 * - Referrer-Policy: strict-origin-when-cross-origin
 * - Permissions-Policy (restrictive minimal policy)
 * - Cross-Origin-Opener-Policy: same-origin
 */

export const securityHeadersMiddleware = (req, res, next) => {
  // 1. Content Security Policy tailored for TSH website & integrations (Google Fonts, Google Forms)
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://tsh-backend.onrender.com http://localhost:5000 http://127.0.0.1:5000 ws:",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self' https://forms.gle https://docs.google.com",
  ].join('; ');

  res.setHeader('Content-Security-Policy', cspDirectives);

  // 2. Prevent clickjacking in legacy and modern browsers
  res.setHeader('X-Frame-Options', 'DENY');

  // 3. Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // 4. Restrict Referrer header leakage
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 5. Restrictive minimal Permissions Policy (disable unnecessary browser sensors & hardware APIs)
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), vr=(), accelerometer=(), gyroscope=()'
  );

  // 6. Cross-Origin Isolation & Opener Policy
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');

  // 7. Strip sensitive framework banner
  res.removeHeader('X-Powered-By');

  next();
};

/**
 * Strict CORS Configuration
 * Enforces an exact allowlist of trusted origins.
 * Arbitrary origins are rejected and credentials are restricted to allowed origins only.
 */

export const getTrustedOrigins = () => {
  const trusted = new Set();

  // 1. Explicit CLIENT_URL from environment
  if (process.env.CLIENT_URL) {
    trusted.add(process.env.CLIENT_URL.trim().replace(/\/+$/, ''));
  }

  // 2. Comma-separated ALLOWED_ORIGINS list from environment
  if (process.env.ALLOWED_ORIGINS) {
    process.env.ALLOWED_ORIGINS.split(',')
      .map((o) => o.trim().replace(/\/+$/, ''))
      .filter(Boolean)
      .forEach((o) => trusted.add(o));
  }

  // 3. Known production deployment domain if configured
  if (process.env.PRODUCTION_FRONTEND_URL) {
    trusted.add(process.env.PRODUCTION_FRONTEND_URL.trim().replace(/\/+$/, ''));
  }

  // 4. Default official production deployment on Vercel
  trusted.add('https://technical-spiritual-hackathon.vercel.app');

  // 4. In development mode only, permit local development Vite/React ports
  const isDev = (process.env.NODE_ENV || 'development') !== 'production';
  if (isDev) {
    [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5174',
      'http://localhost:5175',
      'http://127.0.0.1:5175',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ].forEach((o) => trusted.add(o));
  }

  return Array.from(trusted);
};

export const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests without origin header (e.g. mobile apps, curl, internal health probes)
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.trim().replace(/\/+$/, '');
    const allowed = getTrustedOrigins();

    if (allowed.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // Strictly reject untrusted or arbitrary origins
    return callback(new Error(`CORS policy violation: Origin '${origin}' is not authorized.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Disposition'],
  maxAge: 86400, // Cache preflight response for 24 hours
};

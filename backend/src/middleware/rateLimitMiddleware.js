/**
 * Lightweight, high-performance in-memory rate limiting middleware
 * Protects endpoints against brute-force attacks and abuse.
 */

class MemoryRateLimiter {
  constructor(windowMs, maxRequests, message) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.message = message || 'Too many requests, please try again later.';
    this.hits = new Map();

    // Periodic cleanup every 2 minutes
    setInterval(() => {
      const now = Date.now();
      for (const [key, record] of this.hits.entries()) {
        if (now - record.startTime > this.windowMs) {
          this.hits.delete(key);
        }
      }
    }, 2 * 60 * 1000).unref();
  }

  middleware() {
    return (req, res, next) => {
      // In test mode or when rate-limiting is explicitly disabled via env, pass through
      if (process.env.DISABLE_RATE_LIMIT === 'true') {
        return next();
      }

      const clientIp =
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.socket?.remoteAddress ||
        'unknown-ip';

      const key = `${clientIp}_${req.baseUrl || req.path}`;
      const now = Date.now();
      let record = this.hits.get(key);

      if (!record || now - record.startTime > this.windowMs) {
        record = { count: 1, startTime: now };
        this.hits.set(key, record);
      } else {
        record.count += 1;
      }

      res.setHeader('X-RateLimit-Limit', this.maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - record.count));

      if (record.count > this.maxRequests) {
        const retryAfterSeconds = Math.ceil((record.startTime + this.windowMs - now) / 1000);
        res.setHeader('Retry-After', retryAfterSeconds);
        return res.status(429).json({
          success: false,
          message: this.message,
          retryAfter: retryAfterSeconds,
        });
      }

      next();
    };
  }
}

// 1. General API Rate Limiter: 400 requests / 15 minutes
export const generalLimiter = new MemoryRateLimiter(
  15 * 60 * 1000,
  400,
  'Too many API requests from this IP. Please slow down.'
).middleware();

// 2. Sensitive Authentication Limiter: 20 attempts / 15 minutes
export const authLimiter = new MemoryRateLimiter(
  15 * 60 * 1000,
  20,
  'Too many authentication attempts. Please try again in 15 minutes.'
).middleware();

// 3. Contact Inquiries Limiter: 10 queries / 15 minutes
export const contactLimiter = new MemoryRateLimiter(
  15 * 60 * 1000,
  10,
  'Too many contact submissions from this IP. Please wait before submitting again.'
).middleware();

// 4. Problem Hold Limiter: 30 hold attempts / 15 minutes
export const holdLimiter = new MemoryRateLimiter(
  15 * 60 * 1000,
  30,
  'Slot reservation rate limit reached. Please wait a moment before trying again.'
).middleware();

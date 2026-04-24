import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
}

const DEFAULT_CONFIG: RateLimitConfig = {
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  message: 'Too many requests, please try again later.',
};

// In-memory store for rate limiting.
// In production, use Redis via ioredis for distributed rate limiting.
const rateLimitStore = new Map<string, RateLimitEntry>();

// Periodic cleanup of expired entries
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

/**
 * Extract the client identifier from the request.
 * Uses X-Forwarded-For header if behind a proxy, otherwise falls back to req.ip.
 */
function getClientKey(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
}

/**
 * Create a rate limiter middleware with custom configuration.
 */
export function createRateLimiter(config: Partial<RateLimitConfig> = {}) {
  const cfg: RateLimitConfig = { ...DEFAULT_CONFIG, ...config };

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = getClientKey(req);
    const now = Date.now();

    let entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
      entry = {
        count: 1,
        resetTime: now + cfg.windowMs,
      };
      rateLimitStore.set(key, entry);
    } else {
      entry.count += 1;
    }

    // Set rate limit headers
    const remaining = Math.max(0, cfg.maxRequests - entry.count);
    res.setHeader('X-RateLimit-Limit', cfg.maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(entry.resetTime / 1000));

    if (entry.count > cfg.maxRequests) {
      logger.warn(`Rate limit exceeded for ${key}`, {
        count: entry.count,
        limit: cfg.maxRequests,
        path: req.originalUrl,
      });

      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter);

      res.status(429).json({
        error: cfg.message,
        statusCode: 429,
        retryAfter,
      });
      return;
    }

    next();
  };
}

/**
 * Default rate limiter instance using environment-based or default configuration.
 */
export const rateLimiter = createRateLimiter();

/**
 * Stricter rate limiter for authentication endpoints.
 */
export const authRateLimiter = createRateLimiter({
  windowMs: 900000, // 15 minutes
  maxRequests: 10,
  message: 'Too many authentication attempts, please try again later.',
});

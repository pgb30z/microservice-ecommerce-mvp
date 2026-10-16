import redisClient from "../config/redisClient.js";

const WINDOW_SECONDS =
  Number(process.env.RATE_LIMIT_WINDOW) || 60;

const MAX_REQUESTS =
  Number(process.env.RATE_LIMIT_MAX) || 5;

export async function rateLimiter(req, res, next) {
  try {
    const clientIp =
      req.ip ||
      req.socket.remoteAddress ||
      "unknown";

    const key = `rate_limit:${clientIp}`;

    const requestCount =
      await redisClient.incr(key);

    if (requestCount === 1) {
      await redisClient.expire(
        key,
        WINDOW_SECONDS
      );
    }

    const ttl =
      await redisClient.ttl(key);

    res.setHeader(
      "X-RateLimit-Limit",
      MAX_REQUESTS
    );

    res.setHeader(
      "X-RateLimit-Remaining",
      Math.max(
        MAX_REQUESTS - requestCount,
        0
      )
    );

    res.setHeader(
      "X-RateLimit-Reset",
      ttl
    );

    if (requestCount > MAX_REQUESTS) {
      return res.status(429).json({
        success: false,
        message: "Too many requests",
        retryAfter: ttl,
      });
    }

    next();
  } catch (error) {
    console.error(
      "Rate limiter error:",
      error.message
    );

    /*
      Nếu Redis tạm thời lỗi,
      Gateway vẫn cho request đi tiếp.
    */
    next();
  }
}
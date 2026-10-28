import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  // Mobile carriers in Uzbekistan use CGNAT (many visitors share one IP), so 100 was too low.
  // Login / contact / views keep their own much stricter limiters.
  max: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// View counters: count at most one view per IP per item per hour.
// Repeats get a normal 200 so the client never sees an error — they just aren't counted.
export const viewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1,
  keyGenerator: (req) => `${ipKeyGenerator(req.ip || '')}:${req.baseUrl}:${req.params.id}`,
  handler: (req, res) => {
    res.status(200).json({ success: true, counted: false });
  },
  standardHeaders: false,
  legacyHeaders: false,
});

// Contact form: stops bots from flooding the DB and the Telegram notifications
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many messages from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Password step: failed attempts only, so a successful login never locks the admin out
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts from this IP, please try again in 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// 2FA step has its own budget, so a mistyped code doesn't eat into password attempts
export const twoFactorLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many 2FA attempts from this IP, please try again in 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Public visit tracking: enough for normal browsing, stops scripts from flooding the analytics
export const visitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  handler: (req, res) => {
    res.status(200).json({ success: true, counted: false });
  },
  standardHeaders: false,
  legacyHeaders: false,
});

import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
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

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  message:
    'Too many login attempts from this IP, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
});

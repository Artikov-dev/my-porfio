import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, db } from './config/database';
import { ensureSchema, pruneOldContactIps, pruneOldVisits } from './config/schema';
import helmet from 'helmet';
import morgan from 'morgan';
import { logger } from './config/logger';
import { assertRequiredEnv } from './config/env';
import { globalLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/error.middleware';
import redisClient from './config/redis'; // Importing it also opens the Redis connection
import cookieParser from 'cookie-parser';
import { setupSocket } from './config/socket';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import blogRoutes from './routes/blog.routes';
import contactRoutes from './routes/contact.routes';
import seoRoutes from './routes/seo.routes';
import analyticsRoutes from './routes/analytics.routes';
import systemRoutes from './routes/system.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Number of reverse proxies in front of the app (Render's load balancer = 1). If another proxy
// (e.g. Cloudflare) sits in front, req.ip becomes that proxy's address and every visitor shares
// one rate-limit bucket — set TRUST_PROXY=2 then. Check with GET /api/system/client-ip (admin).
const trustProxy = Number(process.env.TRUST_PROXY ?? 1);
app.set('trust proxy', Number.isInteger(trustProxy) && trustProxy >= 0 ? trustProxy : 1);

// CORS - MUST be first middleware to handle preflight requests
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : ['http://localhost:5173'];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
};

app.use(cors(corsOptions));


// Security & Logging
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
// Like 'combined' but without the client IP: analytics only ever stores a salted hash of it,
// so the access log shouldn't keep the raw address either
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms ":referrer" ":user-agent"', {
    stream: { write: (message: string) => logger.info(message.trim()) },
  }),
);
app.use(globalLimiter);

// CSRF protection: auth cookies are SameSite=None, so reject state-changing requests
// that come from a browser page on another origin. (Requests without an Origin header,
// e.g. curl or server-to-server, are not sent with a victim's cookies by a browser.)
app.use((req: Request, res: Response, next) => {
  const origin = req.headers.origin;
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS' && origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ status: 'error', message: 'Origin not allowed' });
  }
  next();
});

// JSON only — no urlencoded parser, so cross-site HTML form posts can't populate req.body
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/system', systemRoutes);

// API Documentation — local/dev only; in production it would publish every (admin) endpoint
// Loaded with require() so the swagger packages can stay devDependencies (not installed on Render)
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('./config/swagger').setupSwagger(app);
}

// Health check endpoint. Always 200 while the process is up (Render would otherwise restart a
// healthy server during a database outage); the body says whether DB and Redis are reachable.
app.get('/health', async (req: Request, res: Response) => {
  let database = false;
  try {
    await db.query('SELECT 1');
    database = true;
  } catch {
    // reported below
  }
  res.status(200).json({
    status: database ? 'ok' : 'degraded',
    database,
    redis: redisClient.isConnected,
    timestamp: new Date().toISOString(),
  });
});

// Global Error Handler (must be the last middleware)
app.use(errorHandler);

// Initialize server
const startServer = async () => {
  assertRequiredEnv();
  await connectDB();

  if (db.isConnected) {
    try {
      await ensureSchema(db.query);
      logger.info('📦 Database schema is up to date');
    } catch (err: any) {
      logger.error(`❌ Could not apply database schema: ${err?.message || err}`);
    }
  }

  // Daily cleanup of old analytics rows and contact IPs (first run shortly after boot)
  const runPrune = () =>
    Promise.all([
      pruneOldVisits(db.query)
        .then((removed) => removed > 0 && logger.info(`🧹 Removed ${removed} old site visit(s)`)),
      pruneOldContactIps(db.query)
        .then((cleared) => cleared > 0 && logger.info(`🧹 Cleared the IP of ${cleared} old contact message(s)`)),
    ]).catch(() => {
      // DB offline — try again tomorrow
    });
  setTimeout(runPrune, 60_000).unref();
  setInterval(runPrune, 24 * 60 * 60 * 1000).unref();

  const httpServer = http.createServer(app);
  const io = setupSocket(httpServer);
  app.set('io', io);

  httpServer.listen(PORT, () => {
    logger.info(
      `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    );
  });

  // Render sends SIGTERM on every deploy: finish in-flight requests, then close sockets and the pool
  let shuttingDown = false;
  const shutdown = (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info(`🛑 ${signal} received, shutting down`);
    setTimeout(() => process.exit(1), 10_000).unref();
    // io.close() also closes the HTTP server (stops new connections, waits for open requests)
    io.close(async () => {
      await Promise.allSettled([db.close(), redisClient.quit()]);
      process.exit(0);
    });
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((err) => {
  logger.error(`❌ Server failed to start: ${err?.stack || err}`);
  process.exit(1);
});

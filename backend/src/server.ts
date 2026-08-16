// Trigger deployment
import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import helmet from 'helmet';
import morgan from 'morgan';
import { logger } from './config/logger';
import { setupSwagger } from './config/swagger';
import { globalLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/error.middleware';
import './config/redis'; // Initializes Redis connection
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

// Trust proxy (Render uses reverse proxy)
app.set('trust proxy', 1);

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

// Handle preflight requests explicitly before any other middleware
app.options('*', cors(corsOptions));

// Security & Logging
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(
  morgan('combined', {
    stream: { write: (message: string) => logger.info(message.trim()) },
  }),
);
app.use(globalLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/system', systemRoutes);

// API Documentation
setupSwagger(app);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global Error Handler (must be the last middleware)
app.use(errorHandler);

// Initialize server
const startServer = async () => {
  await connectDB();

  const httpServer = http.createServer(app);
  const io = setupSocket(httpServer);
  app.set('io', io);

  httpServer.listen(PORT, () => {
    logger.info(
      `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    );
  });
};

startServer();

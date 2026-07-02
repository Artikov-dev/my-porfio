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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet());
app.use(morgan('combined', { stream: { write: (message: string) => logger.info(message.trim()) } }));
app.use(globalLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contact', contactRoutes);

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
    logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();

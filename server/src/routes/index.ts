import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import authRoutes from './auth.routes';
import componentsRoutes from './components.routes';

const router = Router();

// Health check
router.get('/health', (_req: Request, res: Response) => {
  const mongoState = mongoose.connection.readyState;
  const mongoStates: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const memoryUsage = process.memoryUsage();
  const isDbConnected = mongoState === 1;

  const healthData = {
    success: true,
    status: isDbConnected ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    services: {
      database: {
        status: mongoStates[mongoState] || 'unknown',
        connected: isDbConnected,
      },
    },
    system: {
      nodeVersion: process.version,
      memory: {
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      },
    },
  };

  const statusCode = isDbConnected ? 200 : 503;
  res.status(statusCode).json(healthData);
});

// Rutas de autenticación
router.use('/auth', authRoutes);

// Rutas de componentes
router.use('/components', componentsRoutes);

export default router;


import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, unknown>;
}

export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';

  // Error de duplicado de MongoDB
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = `El ${field} ya está registrado`;
  }

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
  }

  // Error de Cast de MongoDB (ID inválido)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'ID inválido';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};


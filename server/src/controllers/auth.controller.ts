import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger';

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nombre, email, password } = req.body;
      
      logger.info(`Intento de registro para: ${email}`);
      
      const result = await authService.register({ nombre, email, password });

      logger.info(`Usuario registrado exitosamente: ${email}`);

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      
      logger.info(`Intento de login para: ${email}`);
      
      const result = await authService.login({ email, password });

      logger.info(`Login exitoso para: ${email}`);

      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
};


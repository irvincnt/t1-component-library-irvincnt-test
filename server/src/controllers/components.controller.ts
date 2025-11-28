import { Request, Response, NextFunction } from 'express';
import { trackingService } from '../services/tracking.service';
import { trackingToCSV } from '../utils/csvExporter';
import { logger } from '../utils/logger';

export const componentsController = {
  track: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { nombre, accion, tipo_usuario, usuario } = req.body;
      
      logger.debug(`Tracking: ${nombre} - ${accion}`);
      
      const tracking = await trackingService.track({
        nombre,
        accion,
        tipo_usuario,
        usuario
      });

      res.status(201).json({
        success: true,
        message: 'Interacción registrada',
        data: tracking
      });
    } catch (error) {
      next(error);
    }
  },

  getStats: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await trackingService.getStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  viewExport: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const validatedPage = Math.max(1, page);
      const validatedLimit = Math.min(Math.max(1, limit), 25); // Máximo 25 registros por página

      logger.info(`Obteniendo datos de tracking paginados - Página: ${validatedPage}, Límite: ${validatedLimit}`);
      
      const result = await trackingService.getPaginated(validatedPage, validatedLimit);

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  },

  export: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('Exportando datos de tracking a CSV');
      
      const trackings = await trackingService.export();

      res.status(200).json({
        success: true,
        data: trackings
      });
    } catch (error) {
      next(error);
    }
  }
};


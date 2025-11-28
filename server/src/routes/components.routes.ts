import { Router } from 'express';
import { componentsController } from '../controllers/components.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate, trackingValidation } from '../middlewares/validation.middleware';

const router = Router();

// Rutas públicas
router.post('/track', validate(trackingValidation), componentsController.track);
router.get('/stats', componentsController.getStats);

// Rutas protegidas
router.get('/export/view', authMiddleware, componentsController.viewExport);
router.get('/export', authMiddleware, componentsController.export);
export default router;


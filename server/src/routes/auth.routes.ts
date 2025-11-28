import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate, registerValidation, loginValidation } from '../middlewares/validation.middleware';

const router = Router();

router.post('/register', validate(registerValidation), authController.register);
router.post('/login', validate(loginValidation), authController.login);

export default router;


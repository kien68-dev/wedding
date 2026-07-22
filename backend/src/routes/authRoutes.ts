import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     responses:
 *       200:
 *         description: Success
 */
router.post('/login', authController.login.bind(authController));
router.post('/register', authController.register.bind(authController));
router.get('/profile', authenticate, authController.profile.bind(authController));
router.post('/change-password', authenticate, authController.changePassword.bind(authController));

export default router;

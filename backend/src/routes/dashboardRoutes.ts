import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();
const controller = new DashboardController();

router.get('/summary', authenticate, authorize(['ADMIN', 'STAFF']), controller.summary.bind(controller));

export default router;

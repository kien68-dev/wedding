import { Router } from 'express';
import { ServiceController } from '../controllers/serviceController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();
const controller = new ServiceController();

router.get('/', authenticate, authorize(['ADMIN', 'STAFF']), controller.list.bind(controller));
router.post('/', authenticate, authorize(['ADMIN']), controller.create.bind(controller));
router.put('/:id', authenticate, authorize(['ADMIN']), controller.update.bind(controller));
router.delete('/:id', authenticate, authorize(['ADMIN']), controller.remove.bind(controller));

export default router;

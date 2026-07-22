import { Router } from 'express';
import { CustomerController } from '../controllers/customerController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();
const customerController = new CustomerController();

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: List customers
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', authenticate, authorize(['ADMIN', 'STAFF']), customerController.list.bind(customerController));
router.post('/', authenticate, authorize(['ADMIN', 'STAFF']), customerController.create.bind(customerController));
router.put('/:id', authenticate, authorize(['ADMIN', 'STAFF']), customerController.update.bind(customerController));
router.delete('/:id', authenticate, authorize(['ADMIN']), customerController.remove.bind(customerController));

export default router;

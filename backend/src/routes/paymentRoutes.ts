import { Router } from 'express';
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment
} from '../controllers/paymentController.js';

const router = Router();

/**
 * @swagger
 * /api/payments:
 *   get:
 *     tags: [Payments]
 *     summary: Get all payments
 *     responses:
 *       200:
 *         description: List of all payments
 */
router.get('/', getAllPayments);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     tags: [Payments]
 *     summary: Get payment by ID
 */
router.get('/:id', getPaymentById);

/**
 * @swagger
 * /api/payments:
 *   post:
 *     tags: [Payments]
 *     summary: Create a new payment
 */
router.post('/', createPayment);

/**
 * @swagger
 * /api/payments/{id}:
 *   put:
 *     tags: [Payments]
 *     summary: Update payment
 */
router.put('/:id', updatePayment);

/**
 * @swagger
 * /api/payments/{id}:
 *   delete:
 *     tags: [Payments]
 *     summary: Delete payment
 */
router.delete('/:id', deletePayment);

export default router;

import { Router } from 'express';
import {
  getAllWeddingEvents,
  getWeddingEventById,
  createWeddingEvent,
  updateWeddingEvent,
  deleteWeddingEvent
} from '../controllers/weddingEventController.js';

const router = Router();

/**
 * @swagger
 * /api/wedding-events:
 *   get:
 *     tags: [Wedding Events]
 *     summary: Get all wedding events
 *     responses:
 *       200:
 *         description: List of all wedding events
 */
router.get('/', getAllWeddingEvents);

/**
 * @swagger
 * /api/wedding-events/{id}:
 *   get:
 *     tags: [Wedding Events]
 *     summary: Get wedding event by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/:id', getWeddingEventById);

/**
 * @swagger
 * /api/wedding-events:
 *   post:
 *     tags: [Wedding Events]
 *     summary: Create a new wedding event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [eventDate, eventTime, venueId, customerId, totalAmount]
 *             properties:
 *               eventDate: { type: string, format: date-time }
 *               eventTime: { type: string }
 *               venueId: { type: integer }
 *               customerId: { type: integer }
 *               menuId: { type: integer }
 *               serviceId: { type: integer }
 *               status: { type: string }
 *               totalAmount: { type: number }
 *               depositAmount: { type: number }
 */
router.post('/', createWeddingEvent);

/**
 * @swagger
 * /api/wedding-events/{id}:
 *   put:
 *     tags: [Wedding Events]
 *     summary: Update wedding event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.put('/:id', updateWeddingEvent);

/**
 * @swagger
 * /api/wedding-events/{id}:
 *   delete:
 *     tags: [Wedding Events]
 *     summary: Delete wedding event
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.delete('/:id', deleteWeddingEvent);

export default router;

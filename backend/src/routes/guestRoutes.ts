import { Router } from 'express';
import {
  getAllGuests,
  getGuestById,
  getGuestsByEvent,
  createGuest,
  updateGuest,
  deleteGuest
} from '../controllers/guestController.js';

const router = Router();

/**
 * @swagger
 * /api/guests:
 *   get:
 *     tags: [Guests]
 *     summary: Get all guests
 */
router.get('/', getAllGuests);

/**
 * @swagger
 * /api/guests/{id}:
 *   get:
 *     tags: [Guests]
 *     summary: Get guest by ID
 */
router.get('/:id', getGuestById);

/**
 * @swagger
 * /api/guests/event/{eventId}:
 *   get:
 *     tags: [Guests]
 *     summary: Get guests by wedding event
 */
router.get('/event/:eventId', getGuestsByEvent);

/**
 * @swagger
 * /api/guests:
 *   post:
 *     tags: [Guests]
 *     summary: Create a new guest
 */
router.post('/', createGuest);

/**
 * @swagger
 * /api/guests/{id}:
 *   put:
 *     tags: [Guests]
 *     summary: Update guest
 */
router.put('/:id', updateGuest);

/**
 * @swagger
 * /api/guests/{id}:
 *   delete:
 *     tags: [Guests]
 *     summary: Delete guest
 */
router.delete('/:id', deleteGuest);

export default router;

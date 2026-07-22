import { Router } from 'express';
import {
  getAllContracts,
  getContractById,
  getContractsByCustomer,
  createContract,
  updateContract,
  deleteContract
} from '../controllers/contractController.js';

const router = Router();

/**
 * @swagger
 * /api/contracts:
 *   get:
 *     tags: [Contracts]
 *     summary: Get all contracts
 */
router.get('/', getAllContracts);

/**
 * @swagger
 * /api/contracts/{id}:
 *   get:
 *     tags: [Contracts]
 *     summary: Get contract by ID
 */
router.get('/:id', getContractById);

/**
 * @swagger
 * /api/contracts/customer/{customerId}:
 *   get:
 *     tags: [Contracts]
 *     summary: Get contracts by customer
 */
router.get('/customer/:customerId', getContractsByCustomer);

/**
 * @swagger
 * /api/contracts:
 *   post:
 *     tags: [Contracts]
 *     summary: Create a new contract
 */
router.post('/', createContract);

/**
 * @swagger
 * /api/contracts/{id}:
 *   put:
 *     tags: [Contracts]
 *     summary: Update contract
 */
router.put('/:id', updateContract);

/**
 * @swagger
 * /api/contracts/{id}:
 *   delete:
 *     tags: [Contracts]
 *     summary: Delete contract
 */
router.delete('/:id', deleteContract);

export default router;

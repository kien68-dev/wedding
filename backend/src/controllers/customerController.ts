import { Request, Response } from 'express';
import { CustomerRepository } from '../repositories/customerRepository.js';

const customerRepository = new CustomerRepository();

export class CustomerController {
  async list(req: Request, res: Response) {
    try {
      const customers = await customerRepository.findAll();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to fetch customers' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const customer = await customerRepository.create(req.body);
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to create customer' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const customer = await customerRepository.update(id, req.body);
      res.json(customer);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to update customer' });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await customerRepository.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to delete customer' });
    }
  }
}

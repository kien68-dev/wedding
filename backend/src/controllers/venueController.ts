import { Request, Response } from 'express';
import prisma from '../prisma/client.js';

export class VenueController {
  async list(_: Request, res: Response) {
    try {
      const venues = await prisma.venue.findMany({ orderBy: { createdAt: 'desc' } });
      res.json(venues);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Unable to load venues' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, capacity, price, status, imageUrl } = req.body;
      if (!name || !capacity || !price) {
        return res.status(400).json({ message: 'Name, capacity and price are required' });
      }

      const venue = await prisma.venue.create({
        data: { name, capacity: Number(capacity), price: Number(price), status: status ?? 'AVAILABLE', imageUrl }
      });

      return res.status(201).json(venue);
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Unable to create venue' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const venue = await prisma.venue.update({ where: { id }, data: req.body });
      return res.json(venue);
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Unable to update venue' });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await prisma.venue.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Unable to delete venue' });
    }
  }
}

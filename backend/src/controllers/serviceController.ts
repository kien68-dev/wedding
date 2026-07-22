import { Request, Response } from 'express';
import prisma from '../prisma/client.js';

export class ServiceController {
  async list(_: Request, res: Response) {
    try {
      const services = await prisma.service.findMany({ orderBy: { createdAt: 'desc' } });
      return res.json(services);
    } catch (error) {
      return res.status(500).json({ message: error instanceof Error ? error.message : 'Unable to load services' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const service = await prisma.service.create({ data: req.body });
      return res.status(201).json(service);
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Unable to create service' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const service = await prisma.service.update({ where: { id }, data: req.body });
      return res.json(service);
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Unable to update service' });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await prisma.service.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Unable to delete service' });
    }
  }
}

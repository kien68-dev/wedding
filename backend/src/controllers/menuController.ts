import { Request, Response } from 'express';
import prisma from '../prisma/client.js';

export class MenuController {
  async list(_: Request, res: Response) {
    try {
      const menus = await prisma.menu.findMany({ orderBy: { createdAt: 'desc' } });
      return res.json(menus);
    } catch (error) {
      return res.status(500).json({ message: error instanceof Error ? error.message : 'Unable to load menus' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const menu = await prisma.menu.create({ data: req.body });
      return res.status(201).json(menu);
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Unable to create menu' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const menu = await prisma.menu.update({ where: { id }, data: req.body });
      return res.json(menu);
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Unable to update menu' });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await prisma.menu.delete({ where: { id } });
      return res.status(204).send();
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : 'Unable to delete menu' });
    }
  }
}

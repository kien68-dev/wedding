import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllGuests = async (req: Request, res: Response) => {
  try {
    const guests = await prisma.guest.findMany({
      include: { weddingEvent: true }
    });
    res.json(guests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guests' });
  }
};

export const getGuestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const guest = await prisma.guest.findUnique({
      where: { id: Number(id) },
      include: { weddingEvent: true }
    });
    if (!guest) return res.status(404).json({ error: 'Guest not found' });
    res.json(guest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guest' });
  }
};

export const getGuestsByEvent = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const guests = await prisma.guest.findMany({
      where: { weddingEventId: Number(eventId) },
      include: { weddingEvent: true }
    });
    res.json(guests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guests for event' });
  }
};

export const createGuest = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, tableNumber, status, weddingEventId } = req.body;
    const guest = await prisma.guest.create({
      data: {
        name,
        phone: phone || null,
        email: email || null,
        tableNumber: tableNumber ? Number(tableNumber) : null,
        status: status || 'PENDING',
        weddingEventId: weddingEventId ? Number(weddingEventId) : null
      },
      include: { weddingEvent: true }
    });
    res.status(201).json(guest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create guest' });
  }
};

export const updateGuest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone, email, tableNumber, status } = req.body;
    const guest = await prisma.guest.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(email && { email }),
        ...(tableNumber && { tableNumber: Number(tableNumber) }),
        ...(status && { status })
      },
      include: { weddingEvent: true }
    });
    res.json(guest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update guest' });
  }
};

export const deleteGuest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.guest.delete({ where: { id: Number(id) } });
    res.json({ message: 'Guest deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete guest' });
  }
};

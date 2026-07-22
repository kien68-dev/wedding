import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllWeddingEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.weddingEvent.findMany({
      include: {
        venue: true,
        customer: true,
        menu: true,
        service: true,
        payments: true,
        guests: true
      }
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wedding events' });
  }
};

export const getWeddingEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await prisma.weddingEvent.findUnique({
      where: { id: Number(id) },
      include: {
        venue: true,
        customer: true,
        menu: true,
        service: true,
        payments: true,
        guests: true
      }
    });
    if (!event) return res.status(404).json({ error: 'Wedding event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wedding event' });
  }
};

export const createWeddingEvent = async (req: Request, res: Response) => {
  try {
    const { eventDate, eventTime, venueId, customerId, menuId, serviceId, status, totalAmount, depositAmount } = req.body;
    const event = await prisma.weddingEvent.create({
      data: {
        eventDate: new Date(eventDate),
        eventTime,
        venueId: Number(venueId),
        customerId: Number(customerId),
        menuId: menuId ? Number(menuId) : null,
        serviceId: serviceId ? Number(serviceId) : null,
        status: status || 'PENDING',
        totalAmount: Number(totalAmount),
        depositAmount: depositAmount ? Number(depositAmount) : 0
      },
      include: { venue: true, customer: true, menu: true, service: true }
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create wedding event' });
  }
};

export const updateWeddingEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { eventDate, eventTime, venueId, customerId, menuId, serviceId, status, totalAmount, depositAmount } = req.body;
    const event = await prisma.weddingEvent.update({
      where: { id: Number(id) },
      data: {
        ...(eventDate && { eventDate: new Date(eventDate) }),
        ...(eventTime && { eventTime }),
        ...(venueId && { venueId: Number(venueId) }),
        ...(customerId && { customerId: Number(customerId) }),
        ...(menuId && { menuId: Number(menuId) }),
        ...(serviceId && { serviceId: Number(serviceId) }),
        ...(status && { status }),
        ...(totalAmount && { totalAmount: Number(totalAmount) }),
        ...(depositAmount !== undefined && { depositAmount: Number(depositAmount) })
      },
      include: { venue: true, customer: true, menu: true, service: true }
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update wedding event' });
  }
};

export const deleteWeddingEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.weddingEvent.delete({ where: { id: Number(id) } });
    res.json({ message: 'Wedding event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete wedding event' });
  }
};

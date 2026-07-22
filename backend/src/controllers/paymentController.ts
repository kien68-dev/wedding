import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      include: { weddingEvent: true }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payment = await prisma.payment.findUnique({
      where: { id: Number(id) },
      include: { weddingEvent: true }
    });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
};

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { eventId, amount, type, status } = req.body;
    const payment = await prisma.payment.create({
      data: {
        eventId: Number(eventId),
        amount: Number(amount),
        type,
        status: status || 'PENDING'
      },
      include: { weddingEvent: true }
    });
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

export const updatePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, type, status } = req.body;
    const payment = await prisma.payment.update({
      where: { id: Number(id) },
      data: {
        ...(amount && { amount: Number(amount) }),
        ...(type && { type }),
        ...(status && { status })
      },
      include: { weddingEvent: true }
    });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment' });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.payment.delete({ where: { id: Number(id) } });
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete payment' });
  }
};

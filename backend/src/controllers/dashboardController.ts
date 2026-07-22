import { Request, Response } from 'express';
import prisma from '../prisma/client.js';

export class DashboardController {
  async summary(_: Request, res: Response) {
    try {
      const [weddingCount, guestCount, revenueResult, upcomingEvents] = await Promise.all([
        prisma.weddingEvent.count(),
        prisma.guest.count(),
        prisma.payment.aggregate({ _sum: { amount: true } }),
        prisma.weddingEvent.findMany({
          take: 5,
          orderBy: { eventDate: 'asc' },
          include: { customer: true, venue: true }
        })
      ]);

      res.json({
        weddingCount,
        guestCount,
        revenue: revenueResult._sum.amount ?? 0,
        upcomingEvents
      });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'Unable to load dashboard summary' });
    }
  }
}

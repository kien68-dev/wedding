import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CustomerRepository {
  async findAll() {
    return prisma.customer.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findById(id: number) {
    return prisma.customer.findUnique({ where: { id } });
  }

  async create(data: { fullName: string; phone: string; email?: string | null; citizenId?: string | null; address?: string | null; notes?: string | null }) {
    return prisma.customer.create({ data });
  }

  async update(id: number, data: Partial<{ fullName: string; phone: string; email?: string | null; citizenId?: string | null; address?: string | null; notes?: string | null }>) {
    return prisma.customer.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.customer.delete({ where: { id } });
  }
}

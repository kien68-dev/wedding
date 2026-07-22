import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllContracts = async (req: Request, res: Response) => {
  try {
    const contracts = await prisma.contract.findMany({
      include: { customer: true }
    });
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
};

export const getContractById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contract = await prisma.contract.findUnique({
      where: { id: Number(id) },
      include: { customer: true }
    });
    if (!contract) return res.status(404).json({ error: 'Contract not found' });
    res.json(contract);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contract' });
  }
};

export const getContractsByCustomer = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;
    const contracts = await prisma.contract.findMany({
      where: { customerId: Number(customerId) },
      include: { customer: true }
    });
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contracts for customer' });
  }
};

export const createContract = async (req: Request, res: Response) => {
  try {
    const { customerId, totalValue, depositAmount, status, pdfUrl } = req.body;
    const contract = await prisma.contract.create({
      data: {
        customerId: Number(customerId),
        totalValue: Number(totalValue),
        depositAmount: Number(depositAmount),
        status: status || 'PENDING',
        pdfUrl: pdfUrl || null
      },
      include: { customer: true }
    });
    res.status(201).json(contract);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create contract' });
  }
};

export const updateContract = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { totalValue, depositAmount, status, pdfUrl } = req.body;
    const contract = await prisma.contract.update({
      where: { id: Number(id) },
      data: {
        ...(totalValue && { totalValue: Number(totalValue) }),
        ...(depositAmount && { depositAmount: Number(depositAmount) }),
        ...(status && { status }),
        ...(pdfUrl && { pdfUrl })
      },
      include: { customer: true }
    });
    res.json(contract);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contract' });
  }
};

export const deleteContract = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.contract.delete({ where: { id: Number(id) } });
    res.json({ message: 'Contract deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contract' });
  }
};

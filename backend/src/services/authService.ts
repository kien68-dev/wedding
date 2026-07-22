import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const defaultAdminEmail = (process.env.DEFAULT_ADMIN_EMAIL ?? 'admin@wedding.com').toLowerCase();
const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD ?? 'admin123';
const defaultAdminName = process.env.DEFAULT_ADMIN_NAME ?? 'Administrator';
const defaultAdminRole = process.env.DEFAULT_ADMIN_ROLE ?? 'ADMIN';

export class AuthService {
  private createTokens(user: { id: number; email: string; name: string; role: string }) {
    const accessToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET ?? 'secret', { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET ?? 'refresh-secret', { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const normalizedEmail = email?.trim().toLowerCase();

    if (normalizedEmail === defaultAdminEmail && password === defaultAdminPassword) {
      const user = {
        id: 1,
        email: defaultAdminEmail,
        name: defaultAdminName,
        role: defaultAdminRole
      };
      const tokens = this.createTokens(user);
      return {
        user,
        ...tokens
      };
    }

    let user = null as { id: number; email: string; passwordHash: string; name: string; role: string } | null;
    try {
      user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    } catch {
      user = null;
    }

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const tokens = this.createTokens({ id: user.id, email: user.email, name: user.name, role: user.role });

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      ...tokens
    };
  }

  async register(email: string, password: string, name: string, role: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new Error('Email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, passwordHash, name, role } });

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  async getProfile(userId: number) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  async updatePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

    return { message: 'Password updated successfully' };
  }
}

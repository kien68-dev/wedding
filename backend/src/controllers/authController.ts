import { Request, Response } from 'express';
import { AuthService } from '../services/authService.js';

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: error instanceof Error ? error.message : 'Login failed' });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { email, password, name, role } = req.body;
      const user = await authService.register(email, password, name, role);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Registration failed' });
    }
  }

  async profile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const profile = await authService.getProfile(userId);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Unable to load profile' });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { currentPassword, newPassword } = req.body;
      const result = await authService.updatePassword(userId, currentPassword, newPassword);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Password change failed' });
    }
  }
}

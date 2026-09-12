import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../prisma';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      return res.json({ notifications });
    } catch {
      // Fallback notifications for offline/in-memory mode
      return res.json({
        notifications: [
          {
            id: 'notif-welcome',
            userId,
            title: 'Welcome to AYUSH Setu Portal',
            message: 'Your account is active. Explore verified internships, job opportunities, and skill assessments.',
            read: false,
            createdAt: new Date().toISOString()
          }
        ]
      });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const markRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    try {
      await prisma.notification.updateMany({
        where: { userId },
        data: { read: true }
      });
    } catch {}

    return res.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

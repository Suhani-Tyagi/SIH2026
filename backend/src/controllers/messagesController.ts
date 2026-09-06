import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }]
      },
      orderBy: { createdAt: 'asc' }
    });

    return res.json({ messages });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const senderId = req.user?.id;
    if (!senderId) return res.status(401).json({ message: 'Unauthorized' });

    const { receiverId, content } = req.body;
    const senderName = req.user?.name || 'User';

    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        senderName,
        content
      }
    });

    // Notify receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        title: `New Message from ${senderName} 💬`,
        message: content.substring(0, 100) + '...',
        type: 'INFO'
      }
    });

    return res.json({ message: 'Message sent', data: message });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

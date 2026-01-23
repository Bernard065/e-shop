import { Request, Response, NextFunction } from 'express';
import './express.js';
import jwt from 'jsonwebtoken';
import { prisma, User } from '@e-shop/database';

type AuthRequest = Request & { user?: User | null };

const isAuthenticated = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies.access_token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: 'user' | 'seller';
    };

    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const account = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    req.user = account;

    if (!account) {
      return res.status(401).json({ message: 'Account not found' });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export default isAuthenticated;

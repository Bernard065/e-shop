import { NextFunction, Request, Response } from 'express';
import { prisma } from '@e-shop/database';
import {
  checkOtpRestrictions,
  sendOtp,
  trackOtpRequest,
} from '../utils/auth.helpers';
import { z } from 'zod';

const initiateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export const initiateRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email } = initiateSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
      return;
    }

    await checkOtpRestrictions(email);
    await trackOtpRequest(email);

    await sendOtp(email, name, 'user-registration-otp');

    res.status(200).json({
      success: true,
      message:
        'OTP sent. Please submit OTP and password to complete registration.',
    });
  } catch (error) {
    next(error);
  }
};

import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { userRegistrationSchema } from '@e-shop/shared-types';
import { prisma } from '@e-shop/database';
import { redis } from '@e-shop/redis';
import {
  checkOtpRestrictions,
  sendOtp,
  trackOtpRequest,
} from '../utils/auth.helpers';

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Validate Body
    const { name, email, password } = userRegistrationSchema.parse(req.body);

    // Check if user already exists in DB
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

    // Check OTP Restrictions
    await checkOtpRestrictions(email);

    // Track Request
    await trackOtpRequest(email);

    // Initialize hashedPassword as undefined
    let hashedPassword = undefined;

    // Only hash if password is provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    // Cache for 5 minutes
    await redis.set(
      `registration_data:${email}`,
      JSON.stringify(userData),
      'EX',
      300,
    );

    // Send OTP
    await sendOtp(email, name, 'user-registration-otp');

    res.status(200).json({
      success: true,
      message:
        'OTP sent to your email. Please verify to complete registration.',
    });
  } catch (error) {
    next(error);
  }
};

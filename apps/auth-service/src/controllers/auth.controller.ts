import { NextFunction, Request, Response } from 'express';
import { prisma } from '@e-shop/database';
import {
  checkOtpRestrictions,
  generateTokens,
  sendOtp,
  trackOtpRequest,
  verifyOtp,
} from '../utils/auth.helpers';
import { baseUserSchema } from '@e-shop/shared-types';
import { AuthError, ValidationError } from '@e-shop/common';
import bcrypt from 'bcryptjs';
import { setCookie } from '../utils/cookies/setCookie';

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email } = baseUserSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });

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

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email, otp, password } = req.body;

    if (!name || !email || !otp || !password) {
      return next(new ValidationError('All fields are required'));
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(new ValidationError('User with this email already exists'));
    }

    await verifyOtp(email, otp);

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ValidationError('Email and password are required'));
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      await bcrypt.compare(password, '$2b$12$abcdefghijklmnopqrstuvwxyz123456');
      return next(new AuthError('Invalid email or password'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return next(new AuthError('Invalid email or password'));
    }

    const tokens = generateTokens(user.id, user.role);

    setCookie(res, 'access_token', tokens.accessToken);
    setCookie(res, 'refresh_token', tokens.refreshToken);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const userForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: 'user' | 'seller',
) => {
  try {
    const { email } = req.body;
    if (!email) return next(new ValidationError('Email is required'));

    let user = null;

    if (userType === 'user') {
      user = await prisma.user.findUnique({ where: { email } });
    } else if (userType === 'seller') {
      // user = await prisma.seller.findUnique({ where: { email } });
    }

    if (!user) {
      return next(new ValidationError(`No ${userType} found with this email`));
    }

    await checkOtpRestrictions(email);
    await trackOtpRequest(email);
    await sendOtp(email, user.name, 'forgot-password-otp');

    res.status(200).json({
      success: true,
      message: 'OTP sent. Please check your email.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return next(error);
  }
};

export const userResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: 'user' | 'seller',
) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return next(
        new ValidationError('Email, OTP, and new password are required'),
      );
    }

    let user = null;

    if (userType === 'user') {
      user = await prisma.user.findUnique({ where: { email } });
    } else if (userType === 'seller') {
      // user = await prisma.seller.findUnique({ where: { email } });
    }

    if (!user) {
      return next(new ValidationError(`No ${userType} found with this email`));
    }

    await verifyOtp(email, otp);

    // Check if new password is the same as the old one
    if (user.password) {
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return next(
          new ValidationError(
            'New password cannot be the same as the current password. Please request a new OTP and try again.',
          ),
        );
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    if (userType === 'user') {
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });
    } else if (userType === 'seller') {
      // await prisma.seller.update({ ... });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    return next(error);
  }
};

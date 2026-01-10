import { NextFunction, Request, Response } from 'express';
import { prisma } from '@e-shop/database';
import {
  checkOtpRestrictions,
  sendOtp,
  trackOtpRequest,
  verifyOtp,
} from '../utils/auth.helpers';
import { baseUserSchema } from '@e-shop/shared-types';
import { AuthError, ValidationError } from '@e-shop/common';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { setCookie } from '../utils/cookies/setCookie';

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, email } = baseUserSchema.parse(req.body);

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

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new ValidationError('User with this email already exists'));
    }

    await verifyOtp(email, otp);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
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

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return next(new AuthError('Invalid email or password'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new AuthError('Invalid email or password'));
    }

    const accessTokenExpiresIn = (process.env.JWT_EXPIRES_IN ||
      '1h') as SignOptions['expiresIn'];
    const refreshTokenExpiresIn = (process.env.JWT_REFRESH_EXPIRES_IN ||
      '7d') as SignOptions['expiresIn'];

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      {
        expiresIn: accessTokenExpiresIn,
      },
    );

    const refreshToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_REFRESH_SECRET as string,
      {
        expiresIn: refreshTokenExpiresIn,
      },
    );

    setCookie(res, 'access_token', accessToken);
    setCookie(res, 'refresh_token', refreshToken);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return next(error);
  }
};

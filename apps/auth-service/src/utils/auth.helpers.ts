import crypto from 'crypto';
import { redis } from '@e-shop/redis';
import { sendEmail } from './email.helpers';
import { ValidationError } from '@e-shop/common';
import jwt, { SignOptions } from 'jsonwebtoken';

// Helper: Generate Access and Refresh Tokens
export const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET as string,
    {
      expiresIn: (process.env.JWT_EXPIRES_IN ||
        '1h') as SignOptions['expiresIn'],
    },
  );

  const refreshToken = jwt.sign(
    { userId, role },
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ||
        '7d') as SignOptions['expiresIn'],
    },
  );

  return { accessToken, refreshToken };
};

// Helper: Check for locks
export const checkOtpRestrictions = async (email: string) => {
  const [locked, spamLocked, cooldown] = await Promise.all([
    redis.get(`otp_lock:${email}`),
    redis.get(`otp_spam_lock:${email}`),
    redis.get(`otp_cooldown:${email}`),
  ]);

  if (locked) {
    throw new ValidationError(
      'Too many failed attempts. Please request a new OTP after some time.',
    );
  }

  if (spamLocked) {
    throw new ValidationError('Too many OTP requests. Please try again later.');
  }

  if (cooldown) {
    throw new ValidationError(
      'Please wait 1 minute before requesting a new OTP.',
    );
  }
};

// Helper: Track request counts (Atomic)
export const trackOtpRequest = async (email: string) => {
  const otpRequestKey = `otp_request_count:${email}`;

  // Atomic increment. Returns the new value.
  const requests = await redis.incr(otpRequestKey);

  // If it's the first request, set the expiry to 1 hour
  if (requests === 1) {
    await redis.expire(otpRequestKey, 3600);
  }

  if (requests > 3) {
    // Lock for 1 hour
    await redis.set(`otp_spam_lock:${email}`, 'locked', 'EX', 3600);
    throw new ValidationError('Too many OTP requests. Please try again later.');
  }
};

// Helper: Send OTP
export const sendOtp = async (
  email: string,
  name: string,
  template: string,
) => {
  const otp = crypto.randomInt(100000, 1000000).toString();

  // Save OTP to Redis (Expires in 5 mins)
  await redis.set(`otp:${email}`, otp, 'EX', 300);

  // Set Cooldown (Expires in 1 min)
  await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`DEV ONLY - OTP for ${email}: ${otp}`);
  }

  await sendEmail(email, 'Verify your email', template, { name, otp });
};

export const verifyOtp = async (email: string, otp: string) => {
  const storedOtp = await redis.get(`otp:${email}`);

  if (!storedOtp) {
    throw new ValidationError('OTP has expired or is invalid.');
  }

  const isValid = crypto.timingSafeEqual(
    Buffer.from(storedOtp),
    Buffer.from(otp.padEnd(storedOtp.length)),
  );

  if (!isValid) {
    const failedAttemptsKey = `otp_failed_attempts:${email}`;
    const failedAttempts = await redis.incr(failedAttemptsKey);

    if (failedAttempts === 1) {
      await redis.expire(failedAttemptsKey, 3600);
    }

    if (failedAttempts >= 3) {
      await redis.set(`otp_lock:${email}`, 'locked', 'EX', 3600);
      await redis.del(`otp:${email}`, failedAttemptsKey);
      throw new ValidationError(
        'Too many failed attempts. Please request a new OTP after some time.',
      );
    }
    throw new ValidationError('Invalid OTP provided');
  }

  // OTP is valid - clean up
  await redis.del(`otp:${email}`, `otp_failed_attempts:${email}`);
};

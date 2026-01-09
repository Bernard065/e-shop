import crypto from 'crypto';
import { redis } from '@e-shop/redis';
import { sendEmail } from './email.helpers.js';
import { ValidationError } from '@e-shop/common';

// Helper: Check for locks
export const checkOtpRestrictions = async (email: string) => {
  if (await redis.get(`otp_lock:${email}`)) {
    throw new ValidationError(
      'Too many failed attempts. Please request a new OTP after some time.',
    );
  }

  if (await redis.get(`otp_spam_lock:${email}`)) {
    throw new ValidationError('Too many OTP requests. Please try again later.');
  }

  if (await redis.get(`otp_cooldown:${email}`)) {
    throw new ValidationError(
      'Please wait 1 minute before requesting a new OTP.',
    );
  }
};

// Helper: Track request counts
export const trackOtpRequest = async (email: string) => {
  const otpRequestKey = `otp_request_count:${email}`;
  const otpRequests = parseInt((await redis.get(otpRequestKey)) || '0');

  if (otpRequests >= 2) {
    // Lock for 1 hour
    await redis.set(`otp_spam_lock:${email}`, 'locked', 'EX', 3600);
    throw new ValidationError('Too many OTP requests. Please try again later.');
  }

  // Increment count, expire in 1 hour
  await redis.set(otpRequestKey, otpRequests + 1, 'EX', 3600);
};

// Helper: Send OTP
export const sendOtp = async (
  email: string,
  name: string,
  template: string,
) => {
  // Generate a 6-digit OTP
  const otp = crypto.randomInt(100000, 1000000).toString();

  // Save OTP to Redis FIRST (Expires in 5 mins)
  await redis.set(`otp:${email}`, otp, 'EX', 300);
  console.log(`OTP saved to Redis for ${email}`);

  // Set Cooldown (Expires in 1 min)
  await redis.set(`otp_cooldown:${email}`, 'true', 'EX', 60);

  // Send email last (so OTP is saved even if email fails)
  await sendEmail(email, 'Verify your email', template, { name, otp });
};

export const verifyOtp = async (email: string, otp: string) => {
  const storedOtp = await redis.get(`otp:${email}`);
  const failedAttemptsKey = `otp_failed_attempts:${email}`;
  const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || '0');

  if (storedOtp !== otp) {
    if (failedAttempts >= 2) {
      await redis.set(`otp_lock:${email}`, 'locked', 'EX', 3600);
      await redis.del(`otp:${email}`, failedAttemptsKey);
      throw new ValidationError(
        'Too many failed attempts. Please request a new OTP after some time.',
      );
    }
    await redis.set(failedAttemptsKey, failedAttempts + 1, 'EX', 3600);
    throw new ValidationError('Invalid OTP provided');
  }

  // OTP is valid - clean up
  await redis.del(`otp:${email}`, failedAttemptsKey);
};

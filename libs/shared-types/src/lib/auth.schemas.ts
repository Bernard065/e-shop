import { z } from 'zod';

// Base user schema
const baseUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional(),
});

// User registration schema
export const userRegistrationSchema = baseUserSchema;

// Seller registration schema
export const sellerRegistrationSchema = baseUserSchema.extend({
  phone_number: z.string().min(1, 'Phone number is required'),
  country: z.string().min(1, 'Country is required'),
});

// Login schema (Password is still required for login)
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Types inferred from schemas
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type SellerRegistration = z.infer<typeof sellerRegistrationSchema>;
export type Login = z.infer<typeof loginSchema>;

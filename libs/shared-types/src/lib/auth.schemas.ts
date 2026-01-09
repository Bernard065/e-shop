import { z } from 'zod';

// Reusable password schema to keep validation consistent
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters');

// Base user schema (credentials-agnostic)
export const baseUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email format').toLowerCase(),
});

// User registration schema (password required)
export const userRegistrationSchema = baseUserSchema.extend({
  password: passwordSchema,
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email format').toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

// Types inferred from schemas
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type Login = z.infer<typeof loginSchema>;

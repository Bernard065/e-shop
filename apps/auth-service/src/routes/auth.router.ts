import express, { Router } from 'express';
import { userRegistration, verifyUser } from '../controllers/auth.controller';

const router: Router = express.Router();

router.post(
  '/user-registration',
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Register a new user'
    #swagger.description = 'Send OTP to user email for registration verification'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        name: 'John Doe',
        email: 'john@example.com'
      }
    }
    #swagger.responses[200] = {
      description: 'OTP sent successfully'
    }
    #swagger.responses[409] = {
      description: 'User already exists'
    }
  */
  userRegistration,
);

router.post(
  '/verify-user',
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Verify user registration'
    #swagger.description = 'Verify OTP and create user account'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        name: 'John Doe',
        email: 'john@example.com',
        otp: '123456',
        password: 'SecurePassword123'
      }
    }
    #swagger.responses[201] = {
      description: 'User registered successfully'
    }
    #swagger.responses[400] = {
      description: 'Invalid OTP or validation error'
    }
  */
  verifyUser,
);

export default router;

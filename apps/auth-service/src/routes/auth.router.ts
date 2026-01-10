import express, { Router } from 'express';
import {
  loginUser,
  userForgotPassword,
  userRegistration,
  userResetPassword,
  verifyUser,
} from '../controllers/auth.controller';

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

router.post(
  '/login-user',
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Login user'
    #swagger.description = 'Authenticate user and return JWT tokens'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        email: 'john@example.com',
        password: 'SecurePassword123'
      }
    }
    #swagger.responses[200] = {
      description: 'Login successful'
    }
    #swagger.responses[400] = {
      description: 'Invalid email or password'
    }
  */
  loginUser,
);

router.post(
  '/forgot-user-password',
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Forgot user password'
    #swagger.description = 'Send OTP to user email for password reset'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        email: 'john@example.com'
      }
    }                     
    #swagger.responses[200] = {
      description: 'OTP sent successfully'
    }
    #swagger.responses[404] = {
      description: 'User not found'
    }
  */
  (req, res, next) => userForgotPassword(req, res, next, 'user'),
);

router.post(
  '/reset-user-password',
  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Reset user password'
    #swagger.description = 'Reset user password using OTP'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        email: 'john@example.com',
        otp: '123456',
        newPassword: 'NewSecurePassword123'
      }
    }   
    #swagger.responses[200] = {
      description: 'Password reset successful'
    }
    #swagger.responses[400] = {
      description: 'Invalid OTP or validation error'
    }
  */
  (req, res, next) => userResetPassword(req, res, next, 'user'),
);

export default router;

import { NextFunction, Request, Response } from 'express';
import { AppError } from './error-handler.js';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    console.log(`Error ${req.method} ${req.url} - ${err.message}`);

    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }
  console.log('Unexpected Error:', err);

  return res.status(500).json({
    error: 'Something went wrong, please try again later.',
  });
};

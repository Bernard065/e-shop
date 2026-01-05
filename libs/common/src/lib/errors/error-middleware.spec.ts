import { Request, Response, NextFunction } from 'express';
import { errorMiddleware } from './error-middleware.js';
import { AppError } from './error-handler.js';

describe('errorMiddleware', () => {
  let mockReq: Request;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      method: 'GET',
      url: '/test',
    } as Request;
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn() as NextFunction;
  });

  it('should handle AppError correctly', () => {
    const appError = new AppError('Test error', 400, true, {
      field: 'invalid',
    });

    errorMiddleware(appError, mockReq, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Test error',
      details: { field: 'invalid' },
    });
  });

  it('should handle AppError without details', () => {
    const appError = new AppError('Test error', 404);

    errorMiddleware(appError, mockReq, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Test error',
    });
  });

  it('should handle non-AppError with 500 status', () => {
    const genericError = new Error('Generic error');

    errorMiddleware(genericError, mockReq, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Something went wrong, please try again later.',
    });
  });

  it('should not call next', () => {
    const appError = new AppError('Test error', 400);

    errorMiddleware(appError, mockReq, mockRes as Response, mockNext);

    expect(mockNext).not.toHaveBeenCalled();
  });
});

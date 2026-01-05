import {
  AppError,
  NotFoundError,
  ValidationError,
  InternalServerError,
  AuthError,
  ForbiddenError,
  BadRequestError,
  RateLimitError,
} from './error-handler.js';

describe('AppError', () => {
  it('should create an AppError with correct properties', () => {
    const error = new AppError('Test error', 400, true, { key: 'value' });

    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
    expect(error.isOperational).toBe(true);
    expect(error.details).toEqual({ key: 'value' });
    expect(error).toBeInstanceOf(Error);
  });

  it('should have default isOperational as true', () => {
    const error = new AppError('Test error', 400);

    expect(error.isOperational).toBe(true);
  });
});

describe('NotFoundError', () => {
  it('should create a NotFoundError with default message', () => {
    const error = new NotFoundError();

    expect(error.message).toBe('Resource not found');
    expect(error.statusCode).toBe(404);
    expect(error.isOperational).toBe(true);
  });

  it('should create a NotFoundError with custom message', () => {
    const error = new NotFoundError('Custom not found');

    expect(error.message).toBe('Custom not found');
    expect(error.statusCode).toBe(404);
  });

  it('should create a NotFoundError with details', () => {
    const error = new NotFoundError('Not found', { id: 123 });

    expect(error.details).toEqual({ id: 123 });
  });
});

describe('ValidationError', () => {
  it('should create a ValidationError with default message', () => {
    const error = new ValidationError();

    expect(error.message).toBe('Validation failed');
    expect(error.statusCode).toBe(400);
    expect(error.isOperational).toBe(true);
  });
});

describe('InternalServerError', () => {
  it('should create an InternalServerError with default message', () => {
    const error = new InternalServerError();

    expect(error.message).toBe('Internal server error');
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(false);
  });
});

describe('AuthError', () => {
  it('should create an AuthError with default message', () => {
    const error = new AuthError();

    expect(error.message).toBe('Authentication failed');
    expect(error.statusCode).toBe(401);
    expect(error.isOperational).toBe(true);
  });
});

describe('ForbiddenError', () => {
  it('should create a ForbiddenError with default message', () => {
    const error = new ForbiddenError();

    expect(error.message).toBe('Access forbidden');
    expect(error.statusCode).toBe(403);
    expect(error.isOperational).toBe(true);
  });
});

describe('BadRequestError', () => {
  it('should create a BadRequestError with default message', () => {
    const error = new BadRequestError();

    expect(error.message).toBe('Bad request');
    expect(error.statusCode).toBe(400);
    expect(error.isOperational).toBe(true);
  });
});

describe('RateLimitError', () => {
  it('should create a RateLimitError with default message', () => {
    const error = new RateLimitError();

    expect(error.message).toBe('Too many requests');
    expect(error.statusCode).toBe(429);
    expect(error.isOperational).toBe(true);
  });
});

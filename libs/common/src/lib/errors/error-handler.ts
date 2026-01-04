export class AppError<T = unknown> extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: T;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    details?: T,
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this);
  }
}

// Not found error
export class NotFoundError<T = unknown> extends AppError<T> {
  constructor(message = 'Resource not found', details?: T) {
    super(message, 404, true, details);
  }
}

// Validation error
export class ValidationError<T = unknown> extends AppError<T> {
  constructor(message = 'Validation failed', details?: T) {
    super(message, 400, true, details);
  }
}

// Internal server error
export class InternalServerError<T = unknown> extends AppError<T> {
  constructor(message = 'Internal server error', details?: T) {
    super(message, 500, false, details);
  }
}

// Authentication error
export class AuthError<T = unknown> extends AppError<T> {
  constructor(message = 'Authentication failed', details?: T) {
    super(message, 401, true, details);
  }
}

// Forbidden error
export class ForbiddenError<T = unknown> extends AppError<T> {
  constructor(message = 'Access forbidden', details?: T) {
    super(message, 403, true, details);
  }
}

// Bad request error
export class BadRequestError<T = unknown> extends AppError<T> {
  constructor(message = 'Bad request', details?: T) {
    super(message, 400, true, details);
  }
}

// Rate limit error
export class RateLimitError<T = unknown> extends AppError<T> {
  constructor(message = 'Too many requests', details?: T) {
    super(message, 429, true, details);
  }
}

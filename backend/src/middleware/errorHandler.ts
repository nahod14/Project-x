import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let { statusCode = 500, message } = err;

  if (process.env.NODE_ENV === 'production') {
    // Don't leak error details in production
    if (!err.isOperational) {
      statusCode = 500;
      message = 'Something went wrong!';
    }
  }

  res.status(statusCode).json({
    status: err.status,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}; 
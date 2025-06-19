import { AxiosError } from 'axios';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof AxiosError) {
    // Handle network errors
    if (!error.response) {
      return 'Unable to connect to the server. Please check your internet connection.';
    }

    // Handle specific HTTP status codes
    switch (error.response.status) {
      case 400:
        return 'Invalid request. Please check your input and try again.';
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'This action conflicts with the current state of the resource.';
      case 422:
        return 'The provided data is invalid. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'An unexpected error occurred. Please try again later.';
      default:
        return error.response.data?.message || 'An error occurred. Please try again.';
    }
  }

  // Handle other types of errors
  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

export const handleApiError = (error: unknown): never => {
  const message = getErrorMessage(error);
  throw new AppError(message);
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return !error.response;
  }
  return false;
};

export const isAuthError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
};

export const isValidationError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 422;
  }
  return false;
};

// Specific error messages for common scenarios
export const ErrorMessages = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    UNAUTHORIZED: 'You must be logged in to perform this action.',
  },
  PRICE_TRACKING: {
    INVALID_URL: 'Please enter a valid product URL.',
    DUPLICATE_ITEM: 'This item is already being tracked.',
    INVALID_PRICE: 'Please enter a valid price.',
    INVALID_ALERT: 'Please enter a valid price alert.',
  },
  NETWORK: {
    CONNECTION_ERROR: 'Unable to connect to the server. Please check your internet connection.',
    TIMEOUT: 'The request timed out. Please try again.',
  },
  GENERAL: {
    UNEXPECTED: 'An unexpected error occurred. Please try again.',
    RETRY: 'Something went wrong. Please try again.',
  },
} as const; 
export const ErrorMessages = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    REGISTRATION_FAILED: 'Registration failed. Please try again.',
    PASSWORD_RESET_FAILED: 'Password reset failed. Please try again.',
    EMAIL_VERIFICATION_FAILED: 'Email verification failed. Please try again.',
    SESSION_EXPIRED: 'Your session has expired. Please login again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    SOCIAL_LOGIN_FAILED: 'Social login failed. Please try again.',
  },
  NETWORK: {
    CONNECTION_ERROR: 'Unable to connect to the server. Please check your internet connection.',
    TIMEOUT: 'Request timed out. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PASSWORD: 'Password must be at least 8 characters long and contain uppercase, lowercase, number and special character',
    PASSWORDS_DONT_MATCH: 'Passwords do not match',
    INVALID_URL: 'Please enter a valid URL',
    INVALID_PRICE: 'Please enter a valid price',
  },
  PRICE_TRACKING: {
    ITEM_NOT_FOUND: 'Item not found',
    PRICE_UPDATE_FAILED: 'Failed to update price',
    ALERT_CREATION_FAILED: 'Failed to create price alert',
    ALERT_UPDATE_FAILED: 'Failed to update price alert',
    ALERT_DELETION_FAILED: 'Failed to delete price alert',
  },
}; 
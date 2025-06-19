import api from './api';
import { ErrorMessages } from '../utils/errorMessages';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw new Error(ErrorMessages.AUTH.INVALID_CREDENTIALS);
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw new Error(ErrorMessages.AUTH.REGISTRATION_FAILED);
    }
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getCurrentUser(): { id: string; email: string; name: string } | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
        email: payload.email,
        name: payload.name,
      };
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  async requestPasswordReset(email: string): Promise<void> {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error) {
      throw new Error(ErrorMessages.AUTH.PASSWORD_RESET_FAILED);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/reset-password', { token, newPassword });
    } catch (error) {
      throw new Error(ErrorMessages.AUTH.PASSWORD_RESET_FAILED);
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      await api.post('/auth/verify-email', { token });
    } catch (error) {
      throw new Error(ErrorMessages.AUTH.EMAIL_VERIFICATION_FAILED);
    }
  }

  async resendVerificationEmail(): Promise<void> {
    try {
      await api.post('/auth/resend-verification');
    } catch (error) {
      throw new Error(ErrorMessages.AUTH.EMAIL_VERIFICATION_FAILED);
    }
  }

  async loginWithGoogle(): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/google');
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw new Error(ErrorMessages.AUTH.SOCIAL_LOGIN_FAILED);
    }
  }

  async loginWithGitHub(): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/github');
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      throw new Error(ErrorMessages.AUTH.SOCIAL_LOGIN_FAILED);
    }
  }
}

export default new AuthService(); 
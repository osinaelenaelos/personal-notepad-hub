
import { apiService, ApiResponse } from './apiService';
import { API_CONFIG } from '@/config/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
    status: string;
    email_verified?: boolean;
  };
}

export interface VerifyTokenResponse {
  user_id: number;
  email: string;
  role: string;
}

class AuthService {
  // Авторизация
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return apiService.post<LoginResponse>(API_CONFIG.ENDPOINTS.LOGIN, {
      action: 'login',
      email,
      password
    });
  }

  // Проверка токена
  async verifyToken(): Promise<ApiResponse<VerifyTokenResponse>> {
    return apiService.post<VerifyTokenResponse>(API_CONFIG.ENDPOINTS.VERIFY_TOKEN, {
      action: 'verify_token'
    });
  }
}

export const authService = new AuthService();

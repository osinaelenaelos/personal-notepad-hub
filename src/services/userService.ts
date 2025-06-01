
import { apiService, ApiResponse } from './apiService';
import { API_CONFIG } from '@/config/api';
import { FallbackService } from './fallbackService';

export interface User {
  id: number;
  email: string;
  role: 'guest' | 'user' | 'premium' | 'admin';
  status: 'active' | 'blocked' | 'pending';
  created_at: string;
  last_active: string;
  pages_count: number;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: 'guest' | 'user' | 'premium' | 'admin';
}

export interface UpdateUserRequest {
  id: number;
  email?: string;
  role?: 'guest' | 'user' | 'premium' | 'admin';
  status?: 'active' | 'blocked' | 'pending';
}

class UserService {
  // Получение списка пользователей с fallback
  async getUsers(): Promise<ApiResponse<User[]>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        FallbackService.showDemoNotification();
        return FallbackService.getDemoUsers() as ApiResponse<User[]>;
      }

      const response = await apiService.get<User[]>(API_CONFIG.ENDPOINTS.USERS);
      
      // Проверяем и очищаем данные
      if (response.success && response.data) {
        response.data = response.data.filter(user => user && user.id);
      }
      
      return response;
    } catch (error) {
      console.warn('Fallback to demo users due to:', error);
      FallbackService.showDemoNotification();
      return FallbackService.getDemoUsers() as ApiResponse<User[]>;
    }
  }

  // Создание пользователя
  async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        return {
          success: false,
          error: 'API недоступен. Создание пользователей в демо режиме отключено.'
        };
      }

      return apiService.post<User>(API_CONFIG.ENDPOINTS.USERS, {
        action: 'create',
        ...userData
      });
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка создания пользователя'
      };
    }
  }

  // Обновление пользователя
  async updateUser(userData: UpdateUserRequest): Promise<ApiResponse<User>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        return {
          success: false,
          error: 'API недоступен. Обновление пользователей в демо режиме отключено.'
        };
      }

      return apiService.put<User>(API_CONFIG.ENDPOINTS.USERS, {
        action: 'update',
        ...userData
      });
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка обновления пользователя'
      };
    }
  }

  // Удаление пользователя
  async deleteUser(userId: number): Promise<ApiResponse<void>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        return {
          success: false,
          error: 'API недоступен. Удаление пользователей в демо режиме отключено.'
        };
      }

      return apiService.delete<void>(`${API_CONFIG.ENDPOINTS.USERS}?id=${userId}`);
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка удаления пользователя'
      };
    }
  }
}

export const userService = new UserService();

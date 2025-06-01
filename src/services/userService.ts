
import { apiService, ApiResponse } from './apiService';
import { API_CONFIG } from '@/config/api';
import { FallbackService } from './fallbackService';

export interface User {
  id: number;
  email: string;
  role: string;
  status: string;
  created_at: string;
  last_active: string;
  email_verified?: boolean;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUserRequest {
  id: number;
  email?: string;
  role?: string;
  status?: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

class UserService {
  // Получение списка пользователей с fallback
  async getUsers(page = 1, limit = 20, search = ''): Promise<ApiResponse<UsersResponse>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        FallbackService.showDemoNotification();
        return FallbackService.getDemoUsers() as ApiResponse<UsersResponse>;
      }

      return apiService.get<UsersResponse>(API_CONFIG.ENDPOINTS.USERS, {
        action: 'get_all',
        page: page.toString(),
        limit: limit.toString(),
        search
      });
    } catch (error) {
      console.warn('Fallback to demo data due to:', error);
      FallbackService.showDemoNotification();
      return FallbackService.getDemoUsers() as ApiResponse<UsersResponse>;
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
          error: 'API недоступен. Редактирование в демо режиме отключено.'
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
          error: 'API недоступен. Удаление в демо режиме отключено.'
        };
      }

      return apiService.delete<void>(`${API_CONFIG.ENDPOINTS.USERS}?action=delete&id=${userId}`);
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка удаления пользователя'
      };
    }
  }

  // Получение статистики пользователей
  async getUserStats(): Promise<ApiResponse<any>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        FallbackService.showDemoNotification();
        return FallbackService.getDemoStats();
      }

      return apiService.get<any>(API_CONFIG.ENDPOINTS.USERS, {
        action: 'get_stats'
      });
    } catch (error) {
      console.warn('Fallback to demo stats due to:', error);
      FallbackService.showDemoNotification();
      return FallbackService.getDemoStats();
    }
  }
}

export const userService = new UserService();

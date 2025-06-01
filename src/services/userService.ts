
import { apiService, ApiResponse } from './apiService';
import { API_CONFIG } from '@/config/api';
import { FallbackService } from './fallbackService';

export interface User {
  id: number | string;
  email: string;
  role: 'guest' | 'user' | 'premium' | 'admin';
  status: 'active' | 'blocked' | 'pending' | 'verified';
  created_at: string;
  createdAt: string;
  last_active: string;
  lastActive: string;
  pages_count: number;
  pagesCount: number;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserFilters {
  search?: string;
  status?: string;
  role?: string;
  page?: number;
  limit?: number;
}

export interface CreateUserRequest {
  email: string;
  password?: string;
  role?: 'guest' | 'user' | 'premium' | 'admin';
  status?: 'active' | 'blocked' | 'pending';
  pagesCount?: number;
}

export interface UpdateUserRequest {
  id: number;
  email?: string;
  role?: 'guest' | 'user' | 'premium' | 'admin';
  status?: 'active' | 'blocked' | 'pending';
}

class UserService {
  async getUsers(filters?: UserFilters): Promise<ApiResponse<UsersResponse>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        FallbackService.showDemoNotification();
        const demoUsers = FallbackService.getDemoUsers().data || [];
        return {
          success: true,
          data: {
            users: demoUsers,
            total: demoUsers.length,
            page: 1,
            limit: 10
          }
        };
      }

      const params: Record<string, string> = {};
      if (filters?.search) params.search = filters.search;
      if (filters?.status) params.status = filters.status;
      if (filters?.role) params.role = filters.role;

      const response = await apiService.get<any>(API_CONFIG.ENDPOINTS.USERS, params);
      
      if (response.success && response.data) {
        const users = Array.isArray(response.data) ? response.data : [];
        
        const normalizedUsers = users
          .filter(user => user && user.id)
          .map(user => ({
            id: user.id,
            email: user.email || '',
            role: user.role || 'user',
            status: user.status || 'pending',
            created_at: user.created_at || new Date().toISOString(),
            createdAt: user.created_at || new Date().toISOString(),
            last_active: user.last_active || new Date().toISOString(),
            lastActive: user.last_active || new Date().toISOString(),
            pages_count: user.pages_count || 0,
            pagesCount: user.pages_count || 0
          }));

        return {
          success: true,
          data: {
            users: normalizedUsers,
            total: normalizedUsers.length,
            page: 1,
            limit: 10
          }
        };
      }
      
      return {
        success: false,
        error: 'Не удалось получить пользователей'
      };
    } catch (error) {
      console.warn('Fallback to demo users due to:', error);
      FallbackService.showDemoNotification();
      const demoUsers = FallbackService.getDemoUsers().data || [];
      return {
        success: true,
        data: {
          users: demoUsers,
          total: demoUsers.length,
          page: 1,
          limit: 10
        }
      };
    }
  }

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
        email: userData.email,
        password: userData.password || 'defaultpassword123',
        role: userData.role || 'user'
      });
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка создания пользователя'
      };
    }
  }

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

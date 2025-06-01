
import { apiService, ApiResponse } from './apiService';
import { API_CONFIG } from '@/config/api';
import { FallbackService } from './fallbackService';

export interface EmailSettings {
  smtp_host: string;
  smtp_port: string;
  smtp_username: string;
  smtp_password: string;
  smtp_encryption: string;
  admin_email: string;
}

export interface DatabaseSettings {
  host: string;
  database: string;
  username: string;
  password: string;
  port: string;
}

export interface RoleLimit {
  setting_key: string;
  setting_value: string;
  description: string;
}

export interface SystemStatus {
  overall: string;
  lastCheck: string;
  database: {
    status: string;
    connection_time: number;
    last_backup: string;
    size: string;
  };
  server: {
    status: string;
    uptime: string;
    memory_usage: number;
    disk_usage: number;
  };
}

class SettingsService {
  async getEmailSettings(): Promise<ApiResponse<EmailSettings>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        return {
          success: true,
          data: {
            smtp_host: 'smtp.gmail.com',
            smtp_port: '587',
            smtp_username: '',
            smtp_password: '',
            smtp_encryption: 'tls',
            admin_email: 'admin@texttabs.com'
          }
        };
      }

      return apiService.get<EmailSettings>(`${API_CONFIG.ENDPOINTS.SETTINGS}?action=get_all`);
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка получения настроек email'
      };
    }
  }

  async updateEmailSettings(settings: EmailSettings): Promise<ApiResponse<void>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        return {
          success: false,
          error: 'API недоступен. Сохранение настроек в демо режиме отключено.'
        };
      }

      return apiService.post<void>(API_CONFIG.ENDPOINTS.SETTINGS, {
        action: 'update_settings',
        settings
      });
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка сохранения настроек email'
      };
    }
  }

  async testDatabaseConnection(config: DatabaseSettings): Promise<ApiResponse<void>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        return {
          success: false,
          error: 'API недоступен для тестирования подключения'
        };
      }

      return apiService.post<void>(API_CONFIG.ENDPOINTS.SETTINGS, {
        action: 'test_db_connection',
        config
      });
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка тестирования подключения'
      };
    }
  }

  async getRoleLimits(): Promise<ApiResponse<RoleLimit[]>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        return {
          success: true,
          data: [
            {
              setting_key: 'user_page_limit',
              setting_value: '10',
              description: 'Максимальное количество страниц для обычного пользователя'
            },
            {
              setting_key: 'premium_page_limit', 
              setting_value: '100',
              description: 'Максимальное количество страниц для премиум пользователя'
            }
          ]
        };
      }

      return apiService.get<RoleLimit[]>(`${API_CONFIG.ENDPOINTS.SETTINGS}?action=get_role_limits`);
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка получения ограничений ролей'
      };
    }
  }

  async updateRoleLimits(limits: RoleLimit[]): Promise<ApiResponse<void>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        return {
          success: false,
          error: 'API недоступен. Сохранение ограничений в демо режиме отключено.'
        };
      }

      return apiService.post<void>(API_CONFIG.ENDPOINTS.SETTINGS, {
        action: 'update_role_limits',
        limits
      });
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка сохранения ограничений ролей'
      };
    }
  }

  async getSystemStatus(): Promise<ApiResponse<SystemStatus>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        return {
          success: true,
          data: {
            overall: 'healthy',
            lastCheck: new Date().toISOString(),
            database: {
              status: 'connected',
              connection_time: 25,
              last_backup: '2024-01-01T00:00:00Z',
              size: '256 MB'
            },
            server: {
              status: 'running',
              uptime: '5 дней',
              memory_usage: 45,
              disk_usage: 68
            }
          }
        };
      }

      return apiService.get<SystemStatus>(`${API_CONFIG.ENDPOINTS.SETTINGS}?action=get_system_status`);
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка получения статуса системы'
      };
    }
  }
}

export const settingsService = new SettingsService();

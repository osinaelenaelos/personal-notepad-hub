
import { apiService, ApiResponse } from './apiService';
import { API_CONFIG } from '@/config/api';
import { FallbackService } from './fallbackService';

export interface SystemSettings {
  smtp_host: string;
  smtp_port: string;
  smtp_username: string;
  smtp_password: string;
  smtp_encryption: string;
  site_url: string;
  admin_email: string;
  user_page_limit: string;
  premium_page_limit: string;
}

export interface DatabaseConfig {
  host: string;
  database: string;
  username: string;
  password: string;
  charset: string;
  port: number;
}

class SettingsService {
  // Получение системных настроек с fallback
  async getSettings(): Promise<ApiResponse<SystemSettings>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        FallbackService.showDemoNotification();
        return FallbackService.getDemoSettings() as ApiResponse<SystemSettings>;
      }

      return apiService.get<SystemSettings>(API_CONFIG.ENDPOINTS.SETTINGS, {
        action: 'get_all'
      });
    } catch (error) {
      console.warn('Fallback to demo settings due to:', error);
      FallbackService.showDemoNotification();
      return FallbackService.getDemoSettings() as ApiResponse<SystemSettings>;
    }
  }

  // Обновление системных настроек
  async updateSettings(settings: Partial<SystemSettings>): Promise<ApiResponse<void>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        return {
          success: false,
          error: 'API недоступен. Изменение настроек в демо режиме отключено.'
        };
      }

      return apiService.post<void>(API_CONFIG.ENDPOINTS.SETTINGS, {
        action: 'update_settings',
        settings
      });
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка обновления настроек'
      };
    }
  }

  // Тестирование подключения к базе данных
  async testDatabaseConnection(config: DatabaseConfig): Promise<ApiResponse<void>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        return {
          success: false,
          error: 'API недоступен для тестирования подключения к БД.'
        };
      }

      return apiService.post<void>(API_CONFIG.ENDPOINTS.SETTINGS, {
        action: 'test_db_connection',
        config
      });
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка тестирования подключения к базе данных'
      };
    }
  }

  // Создание таблиц базы данных
  async createDatabaseTables(): Promise<ApiResponse<void>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        return {
          success: false,
          error: 'API недоступен для создания таблиц БД.'
        };
      }

      return apiService.post<void>(API_CONFIG.ENDPOINTS.SETTINGS, {
        action: 'create_tables'
      });
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка создания таблиц базы данных'
      };
    }
  }

  // Сохранение конфигурации базы данных
  async saveDatabaseConfig(config: DatabaseConfig): Promise<ApiResponse<void>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        return {
          success: false,
          error: 'API недоступен для сохранения конфигурации БД.'
        };
      }

      return apiService.post<void>(API_CONFIG.ENDPOINTS.SETTINGS, {
        action: 'save_db_config',
        config
      });
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка сохранения конфигурации базы данных'
      };
    }
  }

  // Получение информации о системе
  async getSystemInfo(): Promise<ApiResponse<any>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        return {
          success: true,
          data: {
            php_version: 'N/A (Demo Mode)',
            mysql_version: 'N/A (Demo Mode)',
            server_software: 'Demo Server',
            max_upload_size: 'N/A',
            memory_limit: 'N/A',
            api_status: 'Unavailable'
          }
        };
      }

      return apiService.get<any>(API_CONFIG.ENDPOINTS.SETTINGS, {
        action: 'get_system_info'
      });
    } catch (error) {
      return {
        success: true,
        data: {
          php_version: 'N/A (Error)',
          mysql_version: 'N/A (Error)',
          server_software: 'Unknown',
          max_upload_size: 'N/A',
          memory_limit: 'N/A',
          api_status: 'Error'
        }
      };
    }
  }
}

export const settingsService = new SettingsService();

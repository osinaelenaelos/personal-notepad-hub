
import { apiService, ApiResponse } from './apiService';
import { API_CONFIG } from '@/config/api';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

class NotificationService {
  // Получение уведомлений
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return apiService.post<Notification[]>(API_CONFIG.ENDPOINTS.SETTINGS, {
      action: 'get_notifications'
    });
  }

  // Отметить уведомление как прочитанное
  async markAsRead(id: number): Promise<ApiResponse> {
    return apiService.post(API_CONFIG.ENDPOINTS.SETTINGS, {
      action: 'mark_notification_read',
      id
    });
  }
}

export const notificationService = new NotificationService();

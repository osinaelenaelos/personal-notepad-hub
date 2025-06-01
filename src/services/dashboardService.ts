
import { apiService, ApiResponse } from './apiService';
import { API_CONFIG } from '@/config/api';
import { FallbackService } from './fallbackService';

export interface DashboardStats {
  totalUsers: number;
  totalPages: number;
  totalViews: number;
  newUsersToday: number;
  newPagesToday: number;
  verifiedUsers: number;
  pendingUsers: number;
  blockedUsers: number;
  publicPages: number;
  privatePages: number;
}

export interface ChartData {
  date: string;
  users: number;
  pages: number;
  views: number;
}

class DashboardService {
  // Получение основной статистики с fallback
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        FallbackService.showDemoNotification();
        return FallbackService.getDemoStats() as ApiResponse<DashboardStats>;
      }

      return apiService.get<DashboardStats>(API_CONFIG.ENDPOINTS.DASHBOARD_STATS, {
        action: 'get_stats'
      });
    } catch (error) {
      console.warn('Fallback to demo dashboard stats due to:', error);
      FallbackService.showDemoNotification();
      return FallbackService.getDemoStats() as ApiResponse<DashboardStats>;
    }
  }

  // Получение данных для графиков с fallback
  async getChartData(period = '30'): Promise<ApiResponse<ChartData[]>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        // Генерируем демо данные для графика
        const chartData: ChartData[] = [];
        const today = new Date();
        
        for (let i = parseInt(period) - 1; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          
          chartData.push({
            date: date.toISOString().split('T')[0],
            users: Math.floor(Math.random() * 10) + 1,
            pages: Math.floor(Math.random() * 15) + 2,
            views: Math.floor(Math.random() * 100) + 20
          });
        }
        
        return {
          success: true,
          data: chartData
        };
      }

      return apiService.get<ChartData[]>(API_CONFIG.ENDPOINTS.DASHBOARD_STATS, {
        action: 'get_chart_data',
        period
      });
    } catch (error) {
      console.warn('Fallback to demo chart data due to:', error);
      
      // Возвращаем демо данные для графика
      const chartData: ChartData[] = [];
      const today = new Date();
      
      for (let i = parseInt(period) - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        chartData.push({
          date: date.toISOString().split('T')[0],
          users: Math.floor(Math.random() * 10) + 1,
          pages: Math.floor(Math.random() * 15) + 2,
          views: Math.floor(Math.random() * 100) + 20
        });
      }
      
      return {
        success: true,
        data: chartData
      };
    }
  }

  // Получение активности пользователей
  async getUserActivity(): Promise<ApiResponse<any[]>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        const demoActivity = [
          {
            id: 1,
            user_email: 'user1@example.com',
            action: 'created_page',
            details: 'Создал страницу "Мой блог"',
            timestamp: new Date().toISOString()
          },
          {
            id: 2,
            user_email: 'user2@example.com',
            action: 'login',
            details: 'Вошел в систему',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          }
        ];
        
        return {
          success: true,
          data: demoActivity
        };
      }

      return apiService.get<any[]>(API_CONFIG.ENDPOINTS.DASHBOARD_STATS, {
        action: 'get_user_activity'
      });
    } catch (error) {
      const demoActivity = [
        {
          id: 1,
          user_email: 'user1@example.com',
          action: 'created_page',
          details: 'Создал страницу "Мой блог"',
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          user_email: 'user2@example.com',
          action: 'login',
          details: 'Вошел в систему',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      
      return {
        success: true,
        data: demoActivity
      };
    }
  }
}

export const dashboardService = new DashboardService();

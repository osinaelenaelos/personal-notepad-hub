
import { apiService, ApiResponse } from './apiService';
import { API_CONFIG } from '@/config/api';
import { FallbackService } from './fallbackService';

export interface DashboardStats {
  totalUsers: number;
  totalPages: number;
  totalViews: number;
  newUsersToday: number;
  verifiedUsers: number;
  activityPercent: number;
  stats?: {
    totalUsers: number;
    verifiedUsers: number;
    totalPages: number;
    activityPercent: number;
  };
  recentUsers?: RecentUser[];
  usersChart?: ChartDataPoint[];
  activityChart?: ChartDataPoint[];
}

export interface RecentUser {
  id: string;
  email: string;
  status: string;
  createdAt: string;
  created_at: string;
}

export interface ChartDataPoint {
  date: string;
  users?: string | number;
  pages?: string | number;
  month?: string;
}

class DashboardService {
  async getDashboardData(): Promise<ApiResponse<DashboardStats>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        FallbackService.showDemoNotification();
        return {
          success: true,
          data: {
            totalUsers: 1250,
            totalPages: 8734,
            totalViews: 45123,
            newUsersToday: 23,
            verifiedUsers: 980,
            activityPercent: 15,
            stats: {
              totalUsers: 1250,
              verifiedUsers: 980,
              totalPages: 8734,
              activityPercent: 15
            },
            recentUsers: [
              {
                id: '1',
                email: 'user1@example.com',
                status: 'verified',
                createdAt: new Date().toISOString(),
                created_at: new Date().toISOString()
              },
              {
                id: '2', 
                email: 'user2@example.com',
                status: 'pending',
                createdAt: new Date().toISOString(),
                created_at: new Date().toISOString()
              }
            ],
            usersChart: [
              { date: '2024-01-01', month: 'Янв', users: 120 },
              { date: '2024-02-01', month: 'Фев', users: 150 },
              { date: '2024-03-01', month: 'Мар', users: 180 },
              { date: '2024-04-01', month: 'Апр', users: 220 },
              { date: '2024-05-01', month: 'Май', users: 280 },
              { date: '2024-06-01', month: 'Июн', users: 350 }
            ],
            activityChart: [
              { date: '2024-01-01', pages: 45 },
              { date: '2024-01-02', pages: 52 },
              { date: '2024-01-03', pages: 38 },
              { date: '2024-01-04', pages: 67 },
              { date: '2024-01-05', pages: 43 },
              { date: '2024-01-06', pages: 58 },
              { date: '2024-01-07', pages: 72 }
            ]
          }
        };
      }

      const response = await apiService.get<any>(API_CONFIG.ENDPOINTS.DASHBOARD);
      
      if (response.success && response.data) {
        const data = response.data;
        return {
          success: true,
          data: {
            totalUsers: data.total_users || 0,
            totalPages: data.total_pages || 0,
            totalViews: data.total_views || 0,
            newUsersToday: data.new_users_today || 0,
            verifiedUsers: data.active_users || 0,
            activityPercent: 15,
            stats: {
              totalUsers: data.total_users || 0,
              verifiedUsers: data.active_users || 0,
              totalPages: data.total_pages || 0,
              activityPercent: 15
            },
            recentUsers: (data.recent_users || []).map((user: any) => ({
              id: user.id?.toString() || '',
              email: user.email || '',
              status: user.status || 'pending',
              createdAt: user.created_at || new Date().toISOString(),
              created_at: user.created_at || new Date().toISOString()
            })),
            usersChart: (data.users_chart || []).map((item: any) => ({
              date: item.date || item.month || new Date().toISOString(),
              month: item.month || item.date || '',
              users: item.users || 0
            })),
            activityChart: (data.activity_chart || []).map((item: any) => ({
              date: item.date || '',
              pages: item.pages || 0
            }))
          }
        } as ApiResponse<DashboardStats>;
      }

      return {
        success: false,
        error: 'Не удалось получить данные дашборда'
      };
    } catch (error) {
      console.warn('Fallback to demo dashboard data:', error);
      FallbackService.showDemoNotification();
      return {
        success: true,
        data: {
          totalUsers: 1250,
          totalPages: 8734,
          totalViews: 45123,
          newUsersToday: 23,
          verifiedUsers: 980,
          activityPercent: 15,
          stats: {
            totalUsers: 1250,
            verifiedUsers: 980,
            totalPages: 8734,
            activityPercent: 15
          },
          recentUsers: [],
          usersChart: [],
          activityChart: []
        }
      };
    }
  }
}

export const dashboardService = new DashboardService();

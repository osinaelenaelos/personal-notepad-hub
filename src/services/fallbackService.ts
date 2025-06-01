
import { toast } from '@/hooks/use-toast';

export class FallbackService {
  private static readonly API_TIMEOUT = 5000; // 5 секунд

  // Проверка доступности API
  static async isApiAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.API_TIMEOUT);

      const response = await fetch('/api/auth.php?action=test', {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.warn('API недоступен:', error);
      return false;
    }
  }

  // Показ уведомления о демо режиме
  static showDemoNotification(): void {
    if (!this.hasShownDemoNotification()) {
      toast({
        title: "Демо режим",
        description: "API недоступен. Используются демонстрационные данные.",
        variant: "default",
      });
      this.markDemoNotificationShown();
    }
  }

  private static hasShownDemoNotification(): boolean {
    return sessionStorage.getItem('demo_notification_shown') === 'true';
  }

  private static markDemoNotificationShown(): void {
    sessionStorage.setItem('demo_notification_shown', 'true');
  }

  // Демонстрационные данные для настроек
  static getDemoSettings() {
    return {
      success: true,
      data: {
        smtp_host: 'smtp.gmail.com',
        smtp_port: '587',
        smtp_username: 'demo@example.com',
        smtp_password: '••••••••',
        smtp_encryption: 'tls',
        site_url: 'https://demo.texttabs.com',
        admin_email: 'admin@texttabs.com',
        user_page_limit: '10',
        premium_page_limit: '100'
      }
    };
  }

  // Демонстрационные пользователи
  static getDemoUsers() {
    return {
      success: true,
      data: [
        {
          id: 1,
          email: 'admin@texttabs.com',
          role: 'admin',
          status: 'active',
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString(),
          pages_count: 0
        },
        {
          id: 2,
          email: 'user@example.com',
          role: 'user',
          status: 'active',
          created_at: new Date().toISOString(),
          last_active: new Date().toISOString(),
          pages_count: 5
        }
      ]
    };
  }

  // Демонстрационные страницы
  static getDemoPages() {
    return {
      success: true,
      data: [
        {
          id: 1,
          user_id: 2,
          title: 'Демо страница',
          slug: 'demo-page',
          is_public: true,
          views_count: 42,
          created_at: new Date().toISOString()
        }
      ]
    };
  }

  // Демонстрационная статистика
  static getDemoStats() {
    return {
      success: true,
      data: {
        total_users: 2,
        total_pages: 1,
        active_users: 2,
        public_pages: 1,
        recent_users: this.getDemoUsers().data,
        users_chart: [
          { date: '2025-01-01', users: 1 },
          { date: '2025-01-02', users: 2 }
        ]
      }
    };
  }
}


import { toast } from '@/hooks/use-toast';
import { API_CONFIG } from '@/config/api';

class FallbackService {
  private static demoNotificationShown = false;

  static async isApiAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth.php?action=verify_token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  static showDemoNotification() {
    if (!this.demoNotificationShown) {
      toast({
        title: "Демо режим",
        description: "API недоступен. Показаны демонстрационные данные.",
        variant: "default",
      });
      this.demoNotificationShown = true;
    }
  }

  static getDemoUsers() {
    return {
      success: true,
      data: [
        {
          id: 1,
          email: 'admin@texttabs.com',
          role: 'admin',
          status: 'verified',
          created_at: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          last_active: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          pages_count: 5,
          pagesCount: 5
        },
        {
          id: 2,
          email: 'user@example.com',
          role: 'user',
          status: 'pending',
          created_at: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          last_active: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          pages_count: 3,
          pagesCount: 3
        }
      ]
    };
  }
}

export { FallbackService };

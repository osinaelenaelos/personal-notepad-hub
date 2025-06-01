
// Сервис для fallback функциональности при недоступности БД
export class FallbackService {
  // Демо данные для случаев, когда БД недоступна
  private static demoUsers = [
    {
      id: 1,
      email: 'admin@texttabs.com',
      role: 'admin',
      status: 'verified',
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString()
    },
    {
      id: 2,
      email: 'user@example.com',
      role: 'user',
      status: 'verified',
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString()
    }
  ];

  private static demoPages = [
    {
      id: 1,
      user_id: 2,
      title: 'Пример страницы',
      content: '<h1>Демо контент</h1><p>Это пример страницы пользователя.</p>',
      url_slug: 'example-page',
      is_public: true,
      views_count: 150,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  private static demoStats = {
    totalUsers: 125,
    totalPages: 45,
    totalViews: 2340,
    newUsersToday: 5,
    newPagesToday: 3,
    verifiedUsers: 98,
    pendingUsers: 12,
    blockedUsers: 2,
    publicPages: 35,
    privatePages: 10
  };

  static getDemoUsers() {
    return {
      success: true,
      data: {
        users: this.demoUsers,
        total: this.demoUsers.length,
        page: 1,
        limit: 20
      }
    };
  }

  static getDemoPages() {
    return {
      success: true,
      data: {
        pages: this.demoPages,
        total: this.demoPages.length,
        page: 1,
        limit: 20
      }
    };
  }

  static getDemoStats() {
    return {
      success: true,
      data: this.demoStats
    };
  }

  static getDemoSettings() {
    return {
      success: true,
      data: {
        smtp_host: '',
        smtp_port: '587',
        smtp_username: '',
        smtp_password: '',
        smtp_encryption: 'tls',
        site_url: window.location.origin,
        admin_email: 'admin@texttabs.com',
        user_page_limit: '10',
        premium_page_limit: '0'
      }
    };
  }

  // Проверка доступности API
  static async isApiAvailable(): Promise<boolean> {
    try {
      const response = await fetch('/api/auth.php?action=ping', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.status === 200 || response.status === 400; // 400 тоже означает, что API работает
    } catch {
      return false;
    }
  }

  // Показать уведомление о работе в демо режиме
  static showDemoNotification() {
    console.warn('⚠️ Приложение работает в демо режиме. База данных недоступна.');
  }
}


import { apiService, ApiResponse } from './apiService';
import { API_CONFIG } from '@/config/api';
import { FallbackService } from './fallbackService';

export interface Page {
  id: number;
  user_id: number;
  title: string;
  content: string;
  url_slug: string;
  is_public: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  user?: {
    email: string;
  };
}

export interface CreatePageRequest {
  user_id: number;
  title: string;
  content: string;
  is_public?: boolean;
}

export interface UpdatePageRequest {
  id: number;
  title?: string;
  content?: string;
  is_public?: boolean;
}

export interface PagesResponse {
  pages: Page[];
  total: number;
  page: number;
  limit: number;
}

class PageService {
  // Получение списка страниц с fallback
  async getPages(page = 1, limit = 20, search = '', userId?: number): Promise<ApiResponse<PagesResponse>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        FallbackService.showDemoNotification();
        return FallbackService.getDemoPages() as ApiResponse<PagesResponse>;
      }

      const params: Record<string, string> = {
        action: 'get_all',
        page: page.toString(),
        limit: limit.toString(),
        search
      };

      if (userId) {
        params.user_id = userId.toString();
      }

      return apiService.get<PagesResponse>(API_CONFIG.ENDPOINTS.PAGES, params);
    } catch (error) {
      console.warn('Fallback to demo pages due to:', error);
      FallbackService.showDemoNotification();
      return FallbackService.getDemoPages() as ApiResponse<PagesResponse>;
    }
  }

  // Создание страницы
  async createPage(pageData: CreatePageRequest): Promise<ApiResponse<Page>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        return {
          success: false,
          error: 'API недоступен. Создание страниц в демо режиме отключено.'
        };
      }

      return apiService.post<Page>(API_CONFIG.ENDPOINTS.PAGES, {
        action: 'create',
        ...pageData
      });
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка создания страницы'
      };
    }
  }

  // Обновление страницы
  async updatePage(pageData: UpdatePageRequest): Promise<ApiResponse<Page>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        return {
          success: false,
          error: 'API недоступен. Редактирование в демо режиме отключено.'
        };
      }

      return apiService.put<Page>(API_CONFIG.ENDPOINTS.PAGES, {
        action: 'update',
        ...pageData
      });
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка обновления страницы'
      };
    }
  }

  // Удаление страницы
  async deletePage(pageId: number): Promise<ApiResponse<void>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        return {
          success: false,
          error: 'API недоступен. Удаление в демо режиме отключено.'
        };
      }

      return apiService.delete<void>(`${API_CONFIG.ENDPOINTS.PAGES}?action=delete&id=${pageId}`);
    } catch (error) {
      return {
        success: false,
        error: 'Ошибка удаления страницы'
      };
    }
  }

  // Получение статистики страниц
  async getPageStats(): Promise<ApiResponse<any>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        FallbackService.showDemoNotification();
        return {
          success: true,
          data: {
            totalPages: 45,
            publicPages: 35,
            privatePages: 10,
            totalViews: 2340
          }
        };
      }

      return apiService.get<any>(API_CONFIG.ENDPOINTS.PAGES, {
        action: 'get_stats'
      });
    } catch (error) {
      console.warn('Fallback to demo page stats due to:', error);
      return {
        success: true,
        data: {
          totalPages: 45,
          publicPages: 35,
          privatePages: 10,
          totalViews: 2340
        }
      };
    }
  }
}

export const pageService = new PageService();

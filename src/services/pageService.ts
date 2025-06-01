
import { apiService, ApiResponse } from './apiService';
import { API_CONFIG } from '@/config/api';
import { FallbackService } from './fallbackService';

export interface Page {
  id: number | string;
  user_id: number | string;
  title: string;
  content?: string;
  slug: string;
  is_public: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
  createdAt: string;
  updatedAt: string;
  userEmail?: string;
}

export interface PagesResponse {
  pages: Page[];
  total: number;
  page: number;
  limit: number;
}

export interface PageFilters {
  search?: string;
  user_id?: number;
  is_public?: boolean;
  page?: number;
  limit?: number;
}

export interface CreatePageRequest {
  user_id: number;
  title: string;
  content?: string;
}

class PageService {
  async getPages(filters?: PageFilters): Promise<ApiResponse<PagesResponse>> {
    try {
      const isApiAvailable = await FallbackService.isApiAvailable();
      
      if (!isApiAvailable) {
        FallbackService.showDemoNotification();
        return {
          success: true,
          data: {
            pages: [
              {
                id: 1,
                user_id: 1,
                title: 'Демо страница 1',
                content: 'Это демонстрационная страница',
                slug: 'demo-page-1',
                is_public: true,
                views_count: 150,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                userEmail: 'demo@example.com'
              }
            ],
            total: 1,
            page: 1,
            limit: 10
          }
        };
      }

      const params: Record<string, string> = {};
      if (filters?.search) params.search = filters.search;
      if (filters?.user_id) params.user_id = filters.user_id.toString();

      const response = await apiService.get<any>(API_CONFIG.ENDPOINTS.PAGES, params);
      
      if (response.success && response.data) {
        const pages = Array.isArray(response.data) ? response.data : [];
        
        const normalizedPages = pages.map(page => ({
          id: page.id,
          user_id: page.user_id,
          title: page.title || '',
          content: page.content || '',
          slug: page.slug || '',
          is_public: Boolean(page.is_public),
          views_count: page.views_count || 0,
          created_at: page.created_at || new Date().toISOString(),
          updated_at: page.updated_at || new Date().toISOString(),
          createdAt: page.created_at || new Date().toISOString(),
          updatedAt: page.updated_at || new Date().toISOString(),
          userEmail: page.userEmail || page.user_email || ''
        }));

        return {
          success: true,
          data: {
            pages: normalizedPages,
            total: normalizedPages.length,
            page: 1,
            limit: 10
          }
        };
      }
      
      return {
        success: false,
        error: 'Не удалось получить страницы'
      };
    } catch (error) {
      console.warn('Fallback to demo pages:', error);
      FallbackService.showDemoNotification();
      return {
        success: true,
        data: {
          pages: [],
          total: 0,
          page: 1,
          limit: 10
        }
      };
    }
  }

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
}

export const pageService = new PageService();

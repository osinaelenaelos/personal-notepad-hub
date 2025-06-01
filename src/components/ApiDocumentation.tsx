
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Database, Users, FileText, Shield, Globe } from 'lucide-react';

export const ApiDocumentation = () => {
  const authEndpoints = [
    {
      method: 'POST',
      path: '/auth.php',
      action: 'login',
      description: 'Аутентификация пользователя',
      params: ['email', 'password'],
      response: 'JWT token и данные пользователя'
    },
    {
      method: 'POST',
      path: '/auth.php',
      action: 'register',
      description: 'Регистрация нового пользователя',
      params: ['email', 'password', 'role?'],
      response: 'ID пользователя и токен верификации'
    },
    {
      method: 'POST',
      path: '/auth.php',
      action: 'verify_email',
      description: 'Верификация email',
      params: ['token'],
      response: 'Статус верификации'
    }
  ];

  const userEndpoints = [
    {
      method: 'GET',
      path: '/users.php',
      action: 'get_profile',
      description: 'Получение профиля текущего пользователя',
      auth: true,
      params: [],
      response: 'Данные профиля пользователя'
    },
    {
      method: 'PUT',
      path: '/users.php',
      action: 'update_profile',
      description: 'Обновление профиля пользователя',
      auth: true,
      params: ['email?'],
      response: 'Статус обновления'
    },
    {
      method: 'POST',
      path: '/users.php',
      action: 'upgrade_to_premium',
      description: 'Обновление до премиум аккаунта',
      auth: true,
      params: ['payment_token'],
      response: 'Статус обновления'
    }
  ];

  const pageEndpoints = [
    {
      method: 'GET',
      path: '/pages.php',
      action: 'get_user_pages',
      description: 'Получение страниц пользователя',
      auth: true,
      params: ['page?', 'limit?', 'search?'],
      response: 'Список страниц с пагинацией'
    },
    {
      method: 'POST',
      path: '/pages.php',
      action: 'create_page',
      description: 'Создание новой страницы',
      auth: true,
      params: ['title', 'content'],
      response: 'Данные созданной страницы и URL'
    },
    {
      method: 'PUT',
      path: '/pages.php',
      action: 'update_page',
      description: 'Обновление страницы',
      auth: true,
      params: ['id', 'title?', 'content?'],
      response: 'Статус обновления и новый URL'
    },
    {
      method: 'DELETE',
      path: '/pages.php',
      action: 'delete_page',
      description: 'Удаление страницы',
      auth: true,
      params: ['id'],
      response: 'Статус удаления'
    }
  ];

  const publicEndpoints = [
    {
      method: 'GET',
      path: '/public.php',
      action: 'get_public_pages',
      description: 'Получение публичных страниц',
      auth: false,
      params: ['page?', 'limit?', 'search?'],
      response: 'Список публичных страниц'
    },
    {
      method: 'GET',
      path: '/public.php',
      action: 'get_page_content',
      description: 'Получение содержимого страницы',
      auth: false,
      params: ['slug', 'user'],
      response: 'Содержимое страницы'
    }
  ];

  const roles = [
    {
      name: 'guest',
      title: 'Незарегистрированный пользователь',
      permissions: ['Просмотр публичных страниц', 'Регистрация в системе'],
      limits: 'Только чтение'
    },
    {
      name: 'user',
      title: 'Зарегистрированный пользователь',
      permissions: [
        'Создание и редактирование страниц',
        'Просмотр собственных страниц',
        'Управление профилем'
      ],
      limits: 'До 10 страниц, 100 запросов/час'
    },
    {
      name: 'premium',
      title: 'Премиум пользователь',
      permissions: [
        'Неограниченное создание страниц',
        'Расширенная аналитика',
        'Кастомные домены',
        'Приоритетная поддержка'
      ],
      limits: 'Без ограничений, 1000 запросов/час'
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const EndpointCard = ({ endpoint }: { endpoint: any }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Badge className={getMethodColor(endpoint.method)}>
            {endpoint.method}
          </Badge>
          <code className="text-sm bg-gray-100 px-2 py-1 rounded">
            {endpoint.path}
          </code>
          {endpoint.auth && (
            <Badge variant="outline" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Auth Required
            </Badge>
          )}
        </div>
        <CardTitle className="text-base">{endpoint.description}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <strong className="text-sm">Action:</strong>
            <code className="ml-2 text-sm bg-gray-100 px-1 py-0.5 rounded">
              {endpoint.action}
            </code>
          </div>
          {endpoint.params.length > 0 && (
            <div>
              <strong className="text-sm">Параметры:</strong>
              <div className="flex flex-wrap gap-1 mt-1">
                {endpoint.params.map((param: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {param}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          <div>
            <strong className="text-sm">Ответ:</strong>
            <span className="ml-2 text-sm text-muted-foreground">
              {endpoint.response}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">API Документация</h2>
        <p className="text-muted-foreground">
          Подробная спецификация всех эндпоинтов для интеграции с пользовательским приложением
        </p>
      </div>

      <Tabs defaultValue="auth" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="auth" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Аутентификация
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Пользователи
          </TabsTrigger>
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Страницы
          </TabsTrigger>
          <TabsTrigger value="public" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Публичные
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Роли
          </TabsTrigger>
        </TabsList>

        <TabsContent value="auth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Эндпоинты аутентификации
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {authEndpoints.map((endpoint, index) => (
                  <EndpointCard key={index} endpoint={endpoint} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Управление пользователями
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userEndpoints.map((endpoint, index) => (
                  <EndpointCard key={index} endpoint={endpoint} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Управление страницами
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pageEndpoints.map((endpoint, index) => (
                  <EndpointCard key={index} endpoint={endpoint} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="public" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Публичные эндпоинты
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {publicEndpoints.map((endpoint, index) => (
                  <EndpointCard key={index} endpoint={endpoint} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Роли пользователей
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
                {roles.map((role, index) => (
                  <Card key={index} className="border-2">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{role.title}</CardTitle>
                        <Badge variant="outline">{role.name}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Разрешения:</h4>
                          <ul className="text-sm space-y-1">
                            {role.permissions.map((permission, pIndex) => (
                              <li key={pIndex} className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                                {permission}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-1">Ограничения:</h4>
                          <p className="text-sm text-muted-foreground">{role.limits}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Базовая информация
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Базовый URL:</h4>
            <code className="bg-gray-100 px-3 py-2 rounded block">
              https://yourdomain.com/api/
            </code>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Аутентификация:</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Для защищенных эндпоинтов используйте JWT токен в заголовке:
            </p>
            <code className="bg-gray-100 px-3 py-2 rounded block">
              Authorization: Bearer &lt;your_jwt_token&gt;
            </code>
          </div>

          <div>
            <h4 className="font-medium mb-2">Коды ошибок:</h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <Badge variant="outline">400</Badge>
                <span>Bad Request - Неверные параметры</span>
              </div>
              <div className="flex justify-between">
                <Badge variant="outline">401</Badge>
                <span>Unauthorized - Требуется аутентификация</span>
              </div>
              <div className="flex justify-between">
                <Badge variant="outline">403</Badge>
                <span>Forbidden - Недостаточно прав</span>
              </div>
              <div className="flex justify-between">
                <Badge variant="outline">404</Badge>
                <span>Not Found - Ресурс не найден</span>
              </div>
              <div className="flex justify-between">
                <Badge variant="outline">500</Badge>
                <span>Internal Server Error - Ошибка сервера</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

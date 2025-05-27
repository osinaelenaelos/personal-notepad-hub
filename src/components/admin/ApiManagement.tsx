
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Code, Play, Database, Key, Globe, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ApiManagement = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("ext_live_sk_1234567890abcdef");
  const [testEndpoint, setTestEndpoint] = useState("/api/pages");
  const [testPayload, setTestPayload] = useState('{\n  "title": "Тестовая страница",\n  "content": "Содержимое страницы"\n}');

  const apiEndpoints = [
    { method: "GET", path: "/api/pages", description: "Получить список страниц пользователя", status: "active" },
    { method: "POST", path: "/api/pages", description: "Создать новую страницу", status: "active" },
    { method: "PUT", path: "/api/pages/:id", description: "Обновить существующую страницу", status: "active" },
    { method: "DELETE", path: "/api/pages/:id", description: "Удалить страницу", status: "active" },
    { method: "GET", path: "/api/user/profile", description: "Получить профиль пользователя", status: "active" },
    { method: "POST", path: "/api/auth/login", description: "Авторизация пользователя", status: "active" },
    { method: "GET", path: "/api/sync", description: "Синхронизация данных", status: "maintenance" },
  ];

  const apiUsageStats = [
    { endpoint: "/api/pages", requests: 125420, avgResponse: "120ms", errors: "0.2%" },
    { endpoint: "/api/auth/login", requests: 8940, avgResponse: "340ms", errors: "1.1%" },
    { endpoint: "/api/user/profile", requests: 15680, avgResponse: "85ms", errors: "0.1%" },
    { endpoint: "/api/sync", requests: 45230, avgResponse: "250ms", errors: "0.8%" },
  ];

  const recentApiCalls = [
    { timestamp: "2024-01-20 14:30:25", method: "POST", endpoint: "/api/pages", status: 200, user: "user123", response: "89ms" },
    { timestamp: "2024-01-20 14:29:18", method: "GET", endpoint: "/api/pages", status: 200, user: "user456", response: "45ms" },
    { timestamp: "2024-01-20 14:28:52", method: "PUT", endpoint: "/api/pages/12", status: 200, user: "user789", response: "156ms" },
    { timestamp: "2024-01-20 14:27:33", method: "GET", endpoint: "/api/user/profile", status: 200, user: "user321", response: "72ms" },
    { timestamp: "2024-01-20 14:26:41", method: "POST", endpoint: "/api/auth/login", status: 401, user: "user654", response: "34ms" },
  ];

  const handleTestApi = () => {
    toast({
      title: "API тест выполнен",
      description: `Запрос к ${testEndpoint} выполнен успешно`,
    });
  };

  const generateNewApiKey = () => {
    const newKey = `ext_live_sk_${Math.random().toString(36).substring(2, 18)}`;
    setApiKey(newKey);
    toast({
      title: "Новый API ключ создан",
      description: "API ключ успешно сгенерирован",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Активен</Badge>;
      case "maintenance":
        return <Badge variant="secondary">Обслуживание</Badge>;
      case "deprecated":
        return <Badge variant="destructive">Устарел</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return "text-green-600";
    if (status >= 400 && status < 500) return "text-orange-600";
    if (status >= 500) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Управление</CardTitle>
          <CardDescription>
            Управление API для Chrome расширения и мониторинг использования
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="endpoints" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="endpoints">Эндпоинты</TabsTrigger>
          <TabsTrigger value="testing">Тестирование</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика API</TabsTrigger>
          <TabsTrigger value="logs">Логи запросов</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints">
          <Card>
            <CardHeader>
              <CardTitle>API Эндпоинты</CardTitle>
              <CardDescription>Список доступных API эндпоинтов для расширения</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Метод</TableHead>
                    <TableHead>Путь</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiEndpoints.map((endpoint, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Badge variant="outline">{endpoint.method}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{endpoint.path}</TableCell>
                      <TableCell>{endpoint.description}</TableCell>
                      <TableCell>{getStatusBadge(endpoint.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>API Ключи</CardTitle>
                <CardDescription>Управление ключами доступа к API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Текущий API ключ</label>
                  <div className="flex space-x-2">
                    <Input value={apiKey} readOnly className="font-mono" />
                    <Button variant="outline" onClick={generateNewApiKey}>
                      <Key className="h-4 w-4 mr-2" />
                      Новый
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Используйте этот ключ в заголовке Authorization: Bearer {apiKey}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Тестирование API</CardTitle>
                <CardDescription>Отправка тестовых запросов к API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Эндпоинт</label>
                  <Input
                    value={testEndpoint}
                    onChange={(e) => setTestEndpoint(e.target.value)}
                    placeholder="/api/pages"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payload (JSON)</label>
                  <Textarea
                    value={testPayload}
                    onChange={(e) => setTestPayload(e.target.value)}
                    rows={4}
                    className="font-mono"
                  />
                </div>
                <Button onClick={handleTestApi} className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Выполнить запрос
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Статистика использования API</CardTitle>
              <CardDescription>Производительность и использование API эндпоинтов</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Эндпоинт</TableHead>
                    <TableHead>Запросов</TableHead>
                    <TableHead>Средний отклик</TableHead>
                    <TableHead>Процент ошибок</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiUsageStats.map((stat, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">{stat.endpoint}</TableCell>
                      <TableCell>{stat.requests.toLocaleString()}</TableCell>
                      <TableCell>{stat.avgResponse}</TableCell>
                      <TableCell>{stat.errors}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Последние API запросы</CardTitle>
              <CardDescription>Мониторинг входящих запросов в реальном времени</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Время</TableHead>
                    <TableHead>Метод</TableHead>
                    <TableHead>Эндпоинт</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Пользователь</TableHead>
                    <TableHead>Время отклика</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentApiCalls.map((call, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-sm">{call.timestamp}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{call.method}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{call.endpoint}</TableCell>
                      <TableCell className={getStatusColor(call.status)}>
                        {call.status}
                      </TableCell>
                      <TableCell>{call.user}</TableCell>
                      <TableCell>{call.response}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiManagement;

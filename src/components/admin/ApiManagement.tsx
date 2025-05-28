
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Key, Plus, Trash2, Eye, EyeOff, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface ApiKey {
  id: number;
  name: string;
  key: string;
  status: 'active' | 'inactive';
  permissions: string[];
  created: string;
  lastUsed: string;
  requests: number;
}

interface ApiEndpoint {
  id: number;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  status: 'active' | 'deprecated';
  requests: number;
  responseTime: number;
}

const ApiManagement = () => {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useLocalStorage<ApiKey[]>('api-keys', [
    { id: 1, name: "Chrome Extension API", key: "ck_test_51HyVZ2LeAIgL...", status: "active", permissions: ["read", "write"], created: "2024-01-15", lastUsed: "2024-01-20", requests: 15432 },
    { id: 2, name: "Mobile App API", key: "ck_live_51HyVZ2LeAIgL...", status: "active", permissions: ["read"], created: "2024-01-10", lastUsed: "2024-01-19", requests: 8976 }
  ]);
  
  const [endpoints, setEndpoints] = useLocalStorage<ApiEndpoint[]>('api-endpoints', [
    { id: 1, path: "/api/pages", method: "GET", description: "Получить все страницы пользователя", status: "active", requests: 25634, responseTime: 120 },
    { id: 2, path: "/api/pages", method: "POST", description: "Создать новую страницу", status: "active", requests: 12890, responseTime: 180 },
    { id: 3, path: "/api/users", method: "GET", description: "Получить информацию о пользователе", status: "active", requests: 45123, responseTime: 95 }
  ]);

  const [newApiKey, setNewApiKey] = useState({
    name: "",
    permissions: [] as string[]
  });

  const [showKeys, setShowKeys] = useState<{[key: number]: boolean}>({});

  const generateApiKey = () => {
    return `ck_${Math.random().toString(36).substr(2, 9)}_${Math.random().toString(36).substr(2, 32)}`;
  };

  const handleCreateApiKey = () => {
    if (!newApiKey.name) {
      toast({
        title: "Ошибка",
        description: "Введите название API ключа",
        variant: "destructive"
      });
      return;
    }

    const newKey: ApiKey = {
      id: Date.now(),
      name: newApiKey.name,
      key: generateApiKey(),
      status: "active",
      permissions: newApiKey.permissions,
      created: new Date().toISOString().split('T')[0],
      lastUsed: "Никогда",
      requests: 0
    };

    setApiKeys(prev => [...prev, newKey]);
    setNewApiKey({ name: "", permissions: [] });
    
    toast({
      title: "API ключ создан",
      description: `Новый API ключ "${newApiKey.name}" успешно создан`,
    });
  };

  const handleDeleteApiKey = (keyId: number) => {
    setApiKeys(prev => prev.filter(key => key.id !== keyId));
    toast({
      title: "API ключ удален",
      description: "API ключ успешно удален",
    });
  };

  const handleToggleKeyVisibility = (keyId: number) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Скопировано",
      description: "API ключ скопирован в буфер обмена",
    });
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + "..." + key.substring(key.length - 4);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Управление API</CardTitle>
          <CardDescription>
            Управление API ключами и эндпоинтами для Chrome расширения
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="keys" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="keys">API Ключи</TabsTrigger>
          <TabsTrigger value="endpoints">Эндпоинты</TabsTrigger>
          <TabsTrigger value="docs">Документация</TabsTrigger>
        </TabsList>

        <TabsContent value="keys">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>API Ключи</CardTitle>
                  <CardDescription>Управление ключами доступа к API</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Создать ключ
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Создать новый API ключ</DialogTitle>
                      <DialogDescription>
                        Создайте новый API ключ для доступа к системе
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="keyName">Название ключа</Label>
                        <Input
                          id="keyName"
                          value={newApiKey.name}
                          onChange={(e) => setNewApiKey({...newApiKey, name: e.target.value})}
                          placeholder="Название API ключа"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCreateApiKey}>Создать ключ</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Ключ</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Запросов</TableHead>
                    <TableHead>Последнее использование</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((apiKey) => (
                    <TableRow key={apiKey.id}>
                      <TableCell className="font-medium">{apiKey.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="bg-muted px-2 py-1 rounded text-sm">
                            {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleKeyVisibility(apiKey.id)}
                          >
                            {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyKey(apiKey.key)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={apiKey.status === "active" ? "default" : "secondary"}>
                          {apiKey.status === "active" ? "Активен" : "Неактивен"}
                        </Badge>
                      </TableCell>
                      <TableCell>{apiKey.requests.toLocaleString()}</TableCell>
                      <TableCell>{apiKey.lastUsed}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteApiKey(apiKey.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints">
          <Card>
            <CardHeader>
              <CardTitle>API Эндпоинты</CardTitle>
              <CardDescription>Мониторинг и управление API эндпоинтами</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Метод</TableHead>
                    <TableHead>Путь</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Запросов</TableHead>
                    <TableHead>Время отклика</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {endpoints.map((endpoint) => (
                    <TableRow key={endpoint.id}>
                      <TableCell>
                        <Badge variant={endpoint.method === "GET" ? "default" : endpoint.method === "POST" ? "secondary" : "outline"}>
                          {endpoint.method}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{endpoint.path}</TableCell>
                      <TableCell>{endpoint.description}</TableCell>
                      <TableCell>
                        <Badge variant={endpoint.status === "active" ? "default" : "destructive"}>
                          {endpoint.status === "active" ? "Активен" : "Устарел"}
                        </Badge>
                      </TableCell>
                      <TableCell>{endpoint.requests.toLocaleString()}</TableCell>
                      <TableCell>{endpoint.responseTime}ms</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs">
          <Card>
            <CardHeader>
              <CardTitle>API Документация</CardTitle>
              <CardDescription>Руководство по использованию API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Аутентификация</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Используйте API ключ в заголовке Authorization:
                  </p>
                  <code className="block bg-muted p-2 rounded text-sm">
                    Authorization: Bearer your_api_key_here
                  </code>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Базовые эндпоинты</h3>
                  <div className="space-y-2">
                    <div className="p-3 border rounded">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge>GET</Badge>
                        <code>/api/pages</code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Получить все страницы пользователя
                      </p>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="secondary">POST</Badge>
                        <code>/api/pages</code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Создать новую страницу
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiManagement;

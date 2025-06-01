
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Server, 
  Database, 
  HardDrive, 
  Cpu, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  XCircle 
} from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { settingsService } from '@/services/settingsService';

export const SystemStatus = () => {
  const { data: status, loading, refetch } = useApi(
    () => settingsService.getSystemStatus(),
    []
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800">Работает</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Предупреждение</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Ошибка</Badge>;
      default:
        return <Badge variant="secondary">Неизвестно</Badge>;
    }
  };

  if (loading && !status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Состояние системы
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Загрузка состояния системы...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Состояние системы</h2>
          <p className="text-muted-foreground">
            Мониторинг работоспособности и производительности системы
          </p>
        </div>
        <Button onClick={refetch} disabled={loading} variant="outline">
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
      </div>

      {status && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(status.overall)}
                  Общий статус
                </div>
                {getStatusBadge(status.overall)}
              </CardTitle>
              <CardDescription>
                Последняя проверка: {new Date(status.lastCheck).toLocaleString('ru-RU')}
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  База данных
                </CardTitle>
                <CardDescription>
                  Состояние и статистика базы данных
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Статус</span>
                  {getStatusBadge(status.database.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Время ответа</span>
                  <span className="text-sm text-muted-foreground">
                    {status.database.responseTime}ms
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Пользователи</span>
                  <span className="text-sm text-muted-foreground">
                    {status.database.users}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Страницы</span>
                  <span className="text-sm text-muted-foreground">
                    {status.database.pages}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Сервер
                </CardTitle>
                <CardDescription>
                  Ресурсы и производительность сервера
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <HardDrive className="h-4 w-4" />
                      Использование диска
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {status.server.diskUsage}%
                    </span>
                  </div>
                  <Progress value={status.server.diskUsage} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    Память
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {status.server.memoryUsage}% из {status.server.memoryLimit}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Server, Database, Cpu, HardDrive, Wifi, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TechnicalInfo = () => {
  // Моковые данные мониторинга
  const serverStatus = {
    cpu: 45,
    memory: 67,
    disk: 34,
    network: 12
  };

  const services = [
    { name: "API Server", status: "online", uptime: "99.9%", lastCheck: "30 сек назад" },
    { name: "Database", status: "online", uptime: "99.8%", lastCheck: "1 мин назад" },
    { name: "Redis Cache", status: "online", uptime: "99.9%", lastCheck: "45 сек назад" },
    { name: "Mail Service", status: "warning", uptime: "98.5%", lastCheck: "2 мин назад" },
  ];

  const recentErrors = [
    {
      id: 1,
      time: "2024-01-15 14:30",
      level: "error",
      message: "Database connection timeout",
      count: 3
    },
    {
      id: 2,
      time: "2024-01-15 14:25",
      level: "warning",
      message: "High memory usage detected",
      count: 1
    },
    {
      id: 3,
      time: "2024-01-15 14:20",
      level: "info",
      message: "Scheduled backup completed",
      count: 1
    },
  ];

  const apiMetrics = {
    totalRequests: 156789,
    avgResponseTime: 245,
    errorRate: 0.8,
    activeConnections: 1247
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-100 text-green-800">Онлайн</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Предупреждение</Badge>;
      case "offline":
        return <Badge variant="destructive">Офлайн</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "error":
        return <Badge variant="destructive">Ошибка</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Предупреждение</Badge>;
      case "info":
        return <Badge variant="secondary">Информация</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Статус системы */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Использование CPU</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serverStatus.cpu}%</div>
            <Progress value={serverStatus.cpu} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Использование памяти</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serverStatus.memory}%</div>
            <Progress value={serverStatus.memory} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Использование диска</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serverStatus.disk}%</div>
            <Progress value={serverStatus.disk} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Сетевая нагрузка</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{serverStatus.network} Мб/с</div>
            <p className="text-xs text-muted-foreground">Входящий трафик</p>
          </CardContent>
        </Card>
      </div>

      {/* Статус сервисов */}
      <Card>
        <CardHeader>
          <CardTitle>Статус сервисов</CardTitle>
          <CardDescription>Мониторинг основных компонентов системы</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Сервис</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Время работы</TableHead>
                  <TableHead>Последняя проверка</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>{getStatusBadge(service.status)}</TableCell>
                    <TableCell>{service.uptime}</TableCell>
                    <TableCell>{service.lastCheck}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">Перезапустить</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* API метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Всего запросов</CardTitle>
            <CardDescription>За последние 24 часа</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiMetrics.totalRequests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15% с вчера</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Время ответа</CardTitle>
            <CardDescription>Среднее за час</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiMetrics.avgResponseTime}мс</div>
            <p className="text-xs text-muted-foreground">-5мс с прошлого часа</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Процент ошибок</CardTitle>
            <CardDescription>За последний час</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiMetrics.errorRate}%</div>
            <p className="text-xs text-muted-foreground">В пределах нормы</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Активные соединения</CardTitle>
            <CardDescription>Сейчас</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{apiMetrics.activeConnections}</div>
            <p className="text-xs text-muted-foreground">Пиковое значение: 1500</p>
          </CardContent>
        </Card>
      </div>

      {/* Логи ошибок */}
      <Card>
        <CardHeader>
          <CardTitle>Последние события</CardTitle>
          <CardDescription>Логи ошибок и предупреждений системы</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Время</TableHead>
                  <TableHead>Уровень</TableHead>
                  <TableHead>Сообщение</TableHead>
                  <TableHead>Количество</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentErrors.map((error) => (
                  <TableRow key={error.id}>
                    <TableCell>{error.time}</TableCell>
                    <TableCell>{getLevelBadge(error.level)}</TableCell>
                    <TableCell>{error.message}</TableCell>
                    <TableCell>
                      {error.count > 1 && (
                        <Badge variant="outline">{error.count}</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalInfo;

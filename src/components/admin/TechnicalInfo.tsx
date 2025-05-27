
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Server, Database, Cpu, HardDrive, Wifi, AlertTriangle } from "lucide-react";

const TechnicalInfo = () => {
  const systemStats = {
    serverUptime: "99.9%",
    cpuUsage: 35,
    memoryUsage: 68,
    diskUsage: 45,
    networkLatency: "12ms",
    activeConnections: 1247,
    errorRate: 0.02
  };

  const logs = [
    { id: 1, level: "error", message: "Database connection timeout", timestamp: "2024-01-20 14:30:25" },
    { id: 2, level: "warning", message: "High memory usage detected", timestamp: "2024-01-20 14:25:10" },
    { id: 3, level: "info", message: "User authentication successful", timestamp: "2024-01-20 14:20:05" },
    { id: 4, level: "error", message: "API rate limit exceeded", timestamp: "2024-01-20 14:15:30" },
  ];

  const getLogBadge = (level: string) => {
    switch (level) {
      case "error":
        return <Badge variant="destructive">Ошибка</Badge>;
      case "warning":
        return <Badge variant="secondary">Предупреждение</Badge>;
      case "info":
        return <Badge variant="default">Информация</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Системная статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Время работы сервера</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.serverUptime}</div>
            <p className="text-xs text-muted-foreground">За последние 30 дней</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Загрузка CPU</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.cpuUsage}%</div>
            <Progress value={systemStats.cpuUsage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Использование памяти</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.memoryUsage}%</div>
            <Progress value={systemStats.memoryUsage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные соединения</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.activeConnections}</div>
            <p className="text-xs text-muted-foreground">Сейчас онлайн</p>
          </CardContent>
        </Card>
      </div>

      {/* Производительность */}
      <Card>
        <CardHeader>
          <CardTitle>Производительность системы</CardTitle>
          <CardDescription>Мониторинг ключевых показателей</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Загрузка диска</span>
                <span className="text-sm text-muted-foreground">{systemStats.diskUsage}%</span>
              </div>
              <Progress value={systemStats.diskUsage} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Сетевая задержка</span>
                <span className="text-sm text-muted-foreground">{systemStats.networkLatency}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Уровень ошибок</span>
                <span className="text-sm text-muted-foreground">{systemStats.errorRate}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Логи системы */}
      <Card>
        <CardHeader>
          <CardTitle>Последние события</CardTitle>
          <CardDescription>Системные логи и события</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{log.message}</p>
                    <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                  </div>
                </div>
                {getLogBadge(log.level)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalInfo;


import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Zap, Clock, AlertTriangle, CheckCircle, Settings, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Automation = () => {
  const { toast } = useToast();
  const [newRuleName, setNewRuleName] = useState("");

  const automationRules = [
    {
      id: 1,
      name: "Автоблокировка спама",
      description: "Блокировать пользователей при создании более 50 страниц в час",
      status: "active",
      triggered: 23,
      lastTrigger: "2024-01-20 13:45"
    },
    {
      id: 2,
      name: "Уведомление о превышении лимитов",
      description: "Отправлять уведомления при превышении лимитов сервера",
      status: "active",
      triggered: 8,
      lastTrigger: "2024-01-20 12:30"
    },
    {
      id: 3,
      name: "Автоархивация старых страниц",
      description: "Архивировать страницы неактивных пользователей через 6 месяцев",
      status: "paused",
      triggered: 156,
      lastTrigger: "2024-01-19 23:15"
    },
    {
      id: 4,
      name: "Отчет о производительности",
      description: "Еженедельный отчет о производительности системы",
      status: "active",
      triggered: 47,
      lastTrigger: "2024-01-20 09:00"
    }
  ];

  const scheduledTasks = [
    {
      id: 1,
      task: "Резервное копирование базы данных",
      schedule: "Ежедневно в 02:00",
      nextRun: "2024-01-21 02:00",
      status: "scheduled"
    },
    {
      id: 2,
      task: "Очистка временных файлов",
      schedule: "Еженедельно по воскресеньям",
      nextRun: "2024-01-21 03:00",
      status: "scheduled"
    },
    {
      id: 3,
      task: "Отправка аналитических отчетов",
      schedule: "Ежемесячно 1 числа",
      nextRun: "2024-02-01 10:00",
      status: "scheduled"
    },
    {
      id: 4,
      task: "Проверка безопасности",
      schedule: "Ежедневно в 04:00",
      nextRun: "2024-01-21 04:00",
      status: "running"
    }
  ];

  const alerts = [
    {
      id: 1,
      type: "warning",
      message: "Высокая загрузка процессора (85%)",
      timestamp: "2024-01-20 14:30",
      resolved: false
    },
    {
      id: 2,
      type: "info",
      message: "Завершено резервное копирование",
      timestamp: "2024-01-20 02:00",
      resolved: true
    },
    {
      id: 3,
      type: "error",
      message: "Ошибка подключения к внешнему API",
      timestamp: "2024-01-20 11:15",
      resolved: false
    },
    {
      id: 4,
      type: "success",
      message: "Обновление системы успешно установлено",
      timestamp: "2024-01-19 22:30",
      resolved: true
    }
  ];

  const handleToggleRule = (ruleId: number) => {
    toast({
      title: "Правило обновлено",
      description: `Статус правила ID ${ruleId} изменен`,
    });
  };

  const handleCreateRule = () => {
    if (!newRuleName) {
      toast({
        title: "Ошибка",
        description: "Введите название правила",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Правило создано",
      description: `Правило "${newRuleName}" успешно создано`,
    });
    setNewRuleName("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Активно</Badge>;
      case "paused":
        return <Badge variant="secondary">Приостановлено</Badge>;
      case "scheduled":
        return <Badge variant="outline">Запланировано</Badge>;
      case "running":
        return <Badge variant="default">Выполняется</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "error":
        return <Badge variant="destructive">Ошибка</Badge>;
      case "warning":
        return <Badge variant="secondary">Предупреждение</Badge>;
      case "info":
        return <Badge variant="outline">Информация</Badge>;
      case "success":
        return <Badge variant="default">Успех</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Автоматизация и уведомления</CardTitle>
          <CardDescription>
            Управление автоматическими правилами, задачами и системными уведомлениями
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Правила
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Задачи
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Уведомления
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Создать новое правило</CardTitle>
                <CardDescription>Добавить автоматическое правило для системы</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <Input
                    placeholder="Название правила..."
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleCreateRule}>
                    <Plus className="h-4 w-4 mr-2" />
                    Создать
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Активные правила</CardTitle>
                <CardDescription>Управление автоматическими правилами</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Описание</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Срабатываний</TableHead>
                      <TableHead>Последнее</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {automationRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">{rule.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{rule.description}</TableCell>
                        <TableCell>{getStatusBadge(rule.status)}</TableCell>
                        <TableCell>{rule.triggered}</TableCell>
                        <TableCell className="text-sm">{rule.lastTrigger}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={rule.status === "active"}
                              onCheckedChange={() => handleToggleRule(rule.id)}
                            />
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Запланированные задачи</CardTitle>
              <CardDescription>Автоматические задачи и их расписание</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Задача</TableHead>
                    <TableHead>Расписание</TableHead>
                    <TableHead>Следующий запуск</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.task}</TableCell>
                      <TableCell>{task.schedule}</TableCell>
                      <TableCell className="text-sm">{task.nextRun}</TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Запустить
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Системные уведомления</CardTitle>
              <CardDescription>Последние уведомления и предупреждения системы</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 border rounded-lg ${alert.resolved ? 'opacity-60' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-3">
                        {getAlertBadge(alert.type)}
                        {alert.resolved && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </div>
                      <span className="text-sm text-muted-foreground">{alert.timestamp}</span>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                    {!alert.resolved && (
                      <div className="flex space-x-2 mt-3">
                        <Button variant="outline" size="sm">
                          Отметить решенным
                        </Button>
                        <Button variant="outline" size="sm">
                          Подробнее
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Automation;

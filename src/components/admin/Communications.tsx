
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Bell, MessageCircle, Mail, Users, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const Communications = () => {
  const { toast } = useToast();
  const [notification, setNotification] = useState({
    title: "",
    message: "",
    type: "info"
  });

  const [newsletter, setNewsletter] = useState({
    subject: "",
    content: "",
    recipients: "all"
  });

  // Моковые данные обратной связи
  const feedback = [
    {
      id: 1,
      user: "user1@example.com",
      subject: "Предложение по улучшению",
      message: "Было бы здорово добавить возможность экспорта в PDF...",
      date: "2024-01-15",
      status: "new",
      priority: "medium"
    },
    {
      id: 2,
      user: "user2@example.com",
      subject: "Баг с сохранением",
      message: "Иногда страницы не сохраняются автоматически...",
      date: "2024-01-14",
      status: "in_progress",
      priority: "high"
    },
    {
      id: 3,
      user: "user3@example.com",
      subject: "Отличное расширение!",
      message: "Спасибо за такой удобный инструмент, очень помогает в работе!",
      date: "2024-01-13",
      status: "closed",
      priority: "low"
    },
  ];

  const notifications = [
    {
      id: 1,
      title: "Обновление системы",
      message: "Запланировано техническое обслуживание",
      sent: "2024-01-15",
      delivered: 8432,
      opened: 6421
    },
    {
      id: 2,
      title: "Новые функции",
      message: "Добавлена возможность экспорта в различные форматы",
      sent: "2024-01-10",
      delivered: 8124,
      opened: 7203
    },
  ];

  const sendNotification = () => {
    if (!notification.title || !notification.message) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля уведомления",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Уведомление отправлено",
      description: "Push-уведомление доставлено всем пользователям",
    });
    
    setNotification({ title: "", message: "", type: "info" });
  };

  const sendNewsletter = () => {
    if (!newsletter.subject || !newsletter.content) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля рассылки",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Рассылка отправлена",
      description: "Email рассылка запущена",
    });
    
    setNewsletter({ subject: "", content: "", recipients: "all" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-100 text-blue-800">Новая</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800">В работе</Badge>;
      case "closed":
        return <Badge className="bg-green-100 text-green-800">Закрыта</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Высокий</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Средний</Badge>;
      case "low":
        return <Badge variant="secondary">Низкий</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Коммуникации с пользователями</CardTitle>
          <CardDescription>
            Уведомления, рассылки и обратная связь
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Уведомления
          </TabsTrigger>
          <TabsTrigger value="newsletter" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Рассылки
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Обратная связь
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Отправить уведомление</CardTitle>
                <CardDescription>
                  Push-уведомление в расширении для всех пользователей
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notifTitle">Заголовок</Label>
                  <Input
                    id="notifTitle"
                    value={notification.title}
                    onChange={(e) => setNotification({...notification, title: e.target.value})}
                    placeholder="Заголовок уведомления"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notifMessage">Сообщение</Label>
                  <Textarea
                    id="notifMessage"
                    value={notification.message}
                    onChange={(e) => setNotification({...notification, message: e.target.value})}
                    placeholder="Текст уведомления"
                    rows={3}
                  />
                </div>
                <Button onClick={sendNotification} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Отправить уведомление
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>История уведомлений</CardTitle>
                <CardDescription>Последние отправленные уведомления</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="border rounded-lg p-4">
                      <h4 className="font-medium">{notif.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Отправлено: {notif.sent}</span>
                        <span>Доставлено: {notif.delivered} | Открыто: {notif.opened}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="newsletter">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Создать рассылку</CardTitle>
                <CardDescription>
                  Email рассылка для пользователей
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailSubject">Тема письма</Label>
                  <Input
                    id="emailSubject"
                    value={newsletter.subject}
                    onChange={(e) => setNewsletter({...newsletter, subject: e.target.value})}
                    placeholder="Тема email рассылки"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailContent">Содержание</Label>
                  <Textarea
                    id="emailContent"
                    value={newsletter.content}
                    onChange={(e) => setNewsletter({...newsletter, content: e.target.value})}
                    placeholder="HTML содержание письма"
                    rows={8}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipients">Получатели</Label>
                  <select
                    id="recipients"
                    value={newsletter.recipients}
                    onChange={(e) => setNewsletter({...newsletter, recipients: e.target.value})}
                    className="w-full h-10 px-3 py-2 text-sm border border-input rounded-md"
                  >
                    <option value="all">Все пользователи</option>
                    <option value="active">Только активные</option>
                    <option value="premium">Только Premium</option>
                  </select>
                </div>
                <Button onClick={sendNewsletter} className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Отправить рассылку
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Статистика рассылок</CardTitle>
                <CardDescription>Эффективность email кампаний</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">8,432</div>
                      <p className="text-sm text-muted-foreground">Подписчиков</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">76%</div>
                      <p className="text-sm text-muted-foreground">Open Rate</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">23%</div>
                      <p className="text-sm text-muted-foreground">Click Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">2.1%</div>
                      <p className="text-sm text-muted-foreground">Unsubscribe</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Обратная связь от пользователей</CardTitle>
              <CardDescription>
                Предложения, жалобы и отзывы пользователей
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Пользователь</TableHead>
                      <TableHead>Тема</TableHead>
                      <TableHead>Дата</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Приоритет</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedback.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.user}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {item.subject}
                        </TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Ответить
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Новые обращения</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">За последние 7 дней</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Среднее время ответа</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2ч</div>
                <p className="text-xs text-muted-foreground">Улучшение на 15%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Уровень удовлетворенности</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.7/5</div>
                <p className="text-xs text-muted-foreground">Средняя оценка</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Communications;

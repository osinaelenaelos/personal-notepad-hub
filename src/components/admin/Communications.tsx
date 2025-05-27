
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, MessageSquare, Send, Bell, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Communications = () => {
  const { toast } = useToast();
  const [notification, setNotification] = useState({
    title: "",
    message: "",
    type: "info"
  });

  const [email, setEmail] = useState({
    subject: "",
    body: "",
    recipients: "all"
  });

  const feedbackList = [
    { id: 1, user: "Иван Петров", message: "Отличное расширение! Очень удобно создавать заметки.", date: "2024-01-20", status: "new" },
    { id: 2, user: "Мария Сидорова", message: "Было бы здорово добавить синхронизацию между устройствами.", date: "2024-01-19", status: "reviewed" },
    { id: 3, user: "Алексей Козлов", message: "Иногда расширение тормозит при работе с большими текстами.", date: "2024-01-18", status: "in-progress" },
  ];

  const handleSendNotification = () => {
    if (!notification.title || !notification.message) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля уведомления",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Уведомление отправлено",
      description: "Пуш-уведомление отправлено всем пользователям"
    });

    setNotification({ title: "", message: "", type: "info" });
  };

  const handleSendEmail = () => {
    if (!email.subject || !email.body) {
      toast({
        title: "Ошибка",
        description: "Заполните тему и текст письма",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Email отправлен",
      description: `Письмо отправлено: ${email.recipients === "all" ? "всем пользователям" : "выбранным пользователям"}`
    });

    setEmail({ subject: "", body: "", recipients: "all" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default">Новое</Badge>;
      case "reviewed":
        return <Badge variant="secondary">Просмотрено</Badge>;
      case "in-progress":
        return <Badge variant="outline">В работе</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Коммуникация с пользователями</CardTitle>
          <CardDescription>
            Отправка уведомлений, email-рассылок и управление обратной связью
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="notifications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Уведомления
          </TabsTrigger>
          <TabsTrigger value="emails" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email рассылки
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Обратная связь
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Отправить уведомление</CardTitle>
              <CardDescription>
                Пуш-уведомления в расширении для пользователей
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="notificationTitle" className="text-sm font-medium">
                  Заголовок уведомления
                </label>
                <Input
                  id="notificationTitle"
                  value={notification.title}
                  onChange={(e) => setNotification({...notification, title: e.target.value})}
                  placeholder="Введите заголовок"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="notificationMessage" className="text-sm font-medium">
                  Текст уведомления
                </label>
                <Textarea
                  id="notificationMessage"
                  value={notification.message}
                  onChange={(e) => setNotification({...notification, message: e.target.value})}
                  placeholder="Введите текст уведомления"
                  rows={4}
                />
              </div>

              <Button onClick={handleSendNotification} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Отправить уведомление
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails">
          <Card>
            <CardHeader>
              <CardTitle>Email рассылка</CardTitle>
              <CardDescription>
                Отправка писем пользователям расширения
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="emailSubject" className="text-sm font-medium">
                  Тема письма
                </label>
                <Input
                  id="emailSubject"
                  value={email.subject}
                  onChange={(e) => setEmail({...email, subject: e.target.value})}
                  placeholder="Введите тему письма"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="emailBody" className="text-sm font-medium">
                  Текст письма
                </label>
                <Textarea
                  id="emailBody"
                  value={email.body}
                  onChange={(e) => setEmail({...email, body: e.target.value})}
                  placeholder="Введите текст письма"
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="recipients" className="text-sm font-medium">
                  Получатели
                </label>
                <select
                  id="recipients"
                  value={email.recipients}
                  onChange={(e) => setEmail({...email, recipients: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="all">Все пользователи</option>
                  <option value="active">Только активные</option>
                  <option value="premium">Только Premium</option>
                </select>
              </div>

              <Button onClick={handleSendEmail} className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Отправить рассылку
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Обратная связь</CardTitle>
              <CardDescription>
                Отзывы и предложения от пользователей
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbackList.map((feedback) => (
                  <div key={feedback.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{feedback.user}</h4>
                        <p className="text-sm text-muted-foreground">{feedback.date}</p>
                      </div>
                      {getStatusBadge(feedback.status)}
                    </div>
                    <p className="text-sm">{feedback.message}</p>
                    <div className="flex space-x-2 mt-3">
                      <Button variant="outline" size="sm">
                        Ответить
                      </Button>
                      <Button variant="outline" size="sm">
                        Отметить как выполненное
                      </Button>
                    </div>
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

export default Communications;


import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Mail, Shield, Settings, Key, Server } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const SystemSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // Основные настройки
    maxPagesPerUser: 100,
    maxPageSize: 50000,
    enableRegistration: true,
    enablePublicPages: true,
    
    // Настройки почты
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    smtpSecure: true,
    emailFrom: "noreply@yourapp.com",
    
    // Настройки базы данных
    dbHost: "localhost",
    dbPort: 5432,
    dbName: "extension_db",
    dbUser: "admin",
    dbPassword: "",
    dbConnectionTimeout: 30,
    dbMaxConnections: 20,
    
    // Настройки безопасности
    sessionTimeout: 24,
    enableTwoFactor: false,
    passwordMinLength: 8,
    maxLoginAttempts: 5,
  });

  const handleSave = (section: string) => {
    toast({
      title: "Настройки сохранены",
      description: `Настройки раздела "${section}" успешно обновлены`,
    });
  };

  const testConnection = (type: string) => {
    toast({
      title: "Тестирование соединения",
      description: `Проверка соединения с ${type}...`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Системные настройки</CardTitle>
          <CardDescription>
            Управление основными параметрами системы, почтой и базой данных
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Основные
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Почта
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            База данных
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Безопасность
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Основные настройки</CardTitle>
              <CardDescription>
                Лимиты пользователей и общие параметры системы
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="maxPages">Максимум страниц на пользователя</Label>
                  <Input
                    id="maxPages"
                    type="number"
                    value={settings.maxPagesPerUser}
                    onChange={(e) => setSettings({...settings, maxPagesPerUser: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxSize">Максимальный размер страницы (символов)</Label>
                  <Input
                    id="maxSize"
                    type="number"
                    value={settings.maxPageSize}
                    onChange={(e) => setSettings({...settings, maxPageSize: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="registration">Разрешить регистрацию</Label>
                    <p className="text-sm text-muted-foreground">
                      Новые пользователи могут создавать аккаунты
                    </p>
                  </div>
                  <Switch
                    id="registration"
                    checked={settings.enableRegistration}
                    onCheckedChange={(checked) => setSettings({...settings, enableRegistration: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="publicPages">Публичные страницы</Label>
                    <p className="text-sm text-muted-foreground">
                      Пользователи могут делать страницы публичными
                    </p>
                  </div>
                  <Switch
                    id="publicPages"
                    checked={settings.enablePublicPages}
                    onCheckedChange={(checked) => setSettings({...settings, enablePublicPages: checked})}
                  />
                </div>
              </div>

              <Button onClick={() => handleSave("основные")}>
                Сохранить настройки
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Настройки почты</CardTitle>
              <CardDescription>
                Конфигурация SMTP сервера для отправки уведомлений
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP хост</Label>
                  <Input
                    id="smtpHost"
                    value={settings.smtpHost}
                    onChange={(e) => setSettings({...settings, smtpHost: e.target.value})}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP порт</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) => setSettings({...settings, smtpPort: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP пользователь</Label>
                  <Input
                    id="smtpUser"
                    value={settings.smtpUser}
                    onChange={(e) => setSettings({...settings, smtpUser: e.target.value})}
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP пароль</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => setSettings({...settings, smtpPassword: e.target.value})}
                    placeholder="Пароль приложения"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailFrom">Email отправителя</Label>
                  <Input
                    id="emailFrom"
                    value={settings.emailFrom}
                    onChange={(e) => setSettings({...settings, emailFrom: e.target.value})}
                    placeholder="noreply@yourapp.com"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="smtpSecure">Безопасное соединение (TLS)</Label>
                    <p className="text-sm text-muted-foreground">
                      Использовать шифрованное соединение
                    </p>
                  </div>
                  <Switch
                    id="smtpSecure"
                    checked={settings.smtpSecure}
                    onCheckedChange={(checked) => setSettings({...settings, smtpSecure: checked})}
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <Button onClick={() => handleSave("почты")}>
                  Сохранить настройки
                </Button>
                <Button variant="outline" onClick={() => testConnection("почтовым сервером")}>
                  <Mail className="h-4 w-4 mr-2" />
                  Тест соединения
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Настройки базы данных</CardTitle>
              <CardDescription>
                Конфигурация подключения к базе данных
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dbHost">Хост БД</Label>
                  <Input
                    id="dbHost"
                    value={settings.dbHost}
                    onChange={(e) => setSettings({...settings, dbHost: e.target.value})}
                    placeholder="localhost"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dbPort">Порт БД</Label>
                  <Input
                    id="dbPort"
                    type="number"
                    value={settings.dbPort}
                    onChange={(e) => setSettings({...settings, dbPort: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dbName">Имя БД</Label>
                  <Input
                    id="dbName"
                    value={settings.dbName}
                    onChange={(e) => setSettings({...settings, dbName: e.target.value})}
                    placeholder="extension_db"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dbUser">Пользователь БД</Label>
                  <Input
                    id="dbUser"
                    value={settings.dbUser}
                    onChange={(e) => setSettings({...settings, dbUser: e.target.value})}
                    placeholder="admin"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dbPassword">Пароль БД</Label>
                <Input
                  id="dbPassword"
                  type="password"
                  value={settings.dbPassword}
                  onChange={(e) => setSettings({...settings, dbPassword: e.target.value})}
                  placeholder="Пароль базы данных"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dbTimeout">Таймаут соединения (сек)</Label>
                  <Input
                    id="dbTimeout"
                    type="number"
                    value={settings.dbConnectionTimeout}
                    onChange={(e) => setSettings({...settings, dbConnectionTimeout: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dbMaxConn">Максимум соединений</Label>
                  <Input
                    id="dbMaxConn"
                    type="number"
                    value={settings.dbMaxConnections}
                    onChange={(e) => setSettings({...settings, dbMaxConnections: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <Button onClick={() => handleSave("базы данных")}>
                  Сохранить настройки
                </Button>
                <Button variant="outline" onClick={() => testConnection("базой данных")}>
                  <Database className="h-4 w-4 mr-2" />
                  Тест соединения
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Настройки безопасности</CardTitle>
              <CardDescription>
                Параметры безопасности и аутентификации
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Время сессии (часы)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordLength">Минимальная длина пароля</Label>
                  <Input
                    id="passwordLength"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => setSettings({...settings, passwordMinLength: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxAttempts">Максимум попыток входа</Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => setSettings({...settings, maxLoginAttempts: parseInt(e.target.value)})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="twoFactor">Двухфакторная аутентификация</Label>
                  <p className="text-sm text-muted-foreground">
                    Обязательная 2FA для всех пользователей
                  </p>
                </div>
                <Switch
                  id="twoFactor"
                  checked={settings.enableTwoFactor}
                  onCheckedChange={(checked) => setSettings({...settings, enableTwoFactor: checked})}
                />
              </div>

              <Button onClick={() => handleSave("безопасности")}>
                Сохранить настройки
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettings;

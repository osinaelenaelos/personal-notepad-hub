
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Mail, Send, Save, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  smtpEncryption: string;
  fromEmail: string;
  fromName: string;
}

export const EmailSettings = () => {
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    smtpEncryption: 'tls',
    fromEmail: '',
    fromName: ''
  });

  const [testEmail, setTestEmail] = useState('');
  const [testSubject, setTestSubject] = useState('Тестовое письмо');
  const [testMessage, setTestMessage] = useState('Это тестовое письмо для проверки настроек SMTP.');
  const [loading, setLoading] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Загрузка настроек при монтировании компонента
  useEffect(() => {
    loadEmailConfig();
  }, []);

  const loadEmailConfig = async () => {
    setLoadingConfig(true);
    try {
      const response = await fetch('/api/settings.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'load_email_config'
        })
      });

      const result = await response.json();
      
      if (result.success && result.config) {
        setEmailConfig(result.config);
        console.log('Настройки почты загружены:', result.config);
      } else {
        console.log('Настройки почты не найдены, используются значения по умолчанию');
      }
    } catch (error) {
      console.error('Ошибка при загрузке настроек почты:', error);
      toast({
        title: "Предупреждение",
        description: "Не удалось загрузить сохраненные настройки почты",
        variant: "destructive",
      });
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleInputChange = (field: keyof EmailConfig, value: string | number) => {
    setEmailConfig(prev => ({
      ...prev,
      [field]: value
    }));
    setTestResult(null);
  };

  const saveSettings = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/settings.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'save_email_config',
          config: emailConfig
        })
      });

      const result = await response.json();
      
      toast({
        title: result.success ? "Успех" : "Ошибка",
        description: result.message || (result.success ? "Настройки почты сохранены!" : "Не удалось сохранить настройки"),
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Ошибка при сохранении настроек почты",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail) {
      toast({
        title: "Ошибка",
        description: "Укажите email для отправки тестового письма",
        variant: "destructive",
      });
      return;
    }

    setTestLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/settings.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'send_test_email',
          config: emailConfig,
          testEmail,
          testSubject,
          testMessage
        })
      });

      const result = await response.json();
      
      setTestResult({
        success: result.success,
        message: result.message || (result.success ? 'Письмо успешно отправлено!' : 'Ошибка отправки')
      });

      toast({
        title: result.success ? "Успех" : "Ошибка",
        description: result.message || (result.success ? "Тестовое письмо успешно отправлено!" : "Не удалось отправить тестовое письмо"),
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Ошибка при отправке тестового письма'
      });
      toast({
        title: "Ошибка",
        description: "Ошибка при отправке тестового письма",
        variant: "destructive",
      });
    } finally {
      setTestLoading(false);
    }
  };

  if (loadingConfig) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Настройки SMTP
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Загрузка настроек...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Настройки SMTP
          </CardTitle>
          <CardDescription>
            Конфигурация SMTP сервера для отправки электронной почты
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpHost">SMTP Хост *</Label>
              <Input
                id="smtpHost"
                value={emailConfig.smtpHost}
                onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPort">SMTP Порт</Label>
              <Input
                id="smtpPort"
                type="number"
                value={emailConfig.smtpPort}
                onChange={(e) => handleInputChange('smtpPort', parseInt(e.target.value) || 587)}
                placeholder="587"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpUsername">Имя пользователя</Label>
              <Input
                id="smtpUsername"
                value={emailConfig.smtpUsername}
                onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
                placeholder="your-email@gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPassword">Пароль</Label>
              <Input
                id="smtpPassword"
                type="password"
                value={emailConfig.smtpPassword}
                onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpEncryption">Шифрование</Label>
              <Select value={emailConfig.smtpEncryption} onValueChange={(value) => handleInputChange('smtpEncryption', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип шифрования" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tls">TLS</SelectItem>
                  <SelectItem value="ssl">SSL</SelectItem>
                  <SelectItem value="none">Без шифрования</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromEmail">Отправитель (Email) *</Label>
              <Input
                id="fromEmail"
                value={emailConfig.fromEmail}
                onChange={(e) => handleInputChange('fromEmail', e.target.value)}
                placeholder="noreply@yourdomain.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromName">Отправитель (Имя)</Label>
              <Input
                id="fromName"
                value={emailConfig.fromName}
                onChange={(e) => handleInputChange('fromName', e.target.value)}
                placeholder="Текстовые вкладки"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={loadEmailConfig}
              disabled={loadingConfig}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loadingConfig ? 'animate-spin' : ''}`} />
              Перезагрузить
            </Button>
            
            <Button
              onClick={saveSettings}
              disabled={loading}
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Сохранение...' : 'Сохранить настройки'}
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            * - обязательные поля
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Тестовое письмо
          </CardTitle>
          <CardDescription>
            Отправка тестового письма для проверки настроек SMTP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="testEmail">Email получателя *</Label>
            <Input
              id="testEmail"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="testSubject">Тема письма</Label>
            <Input
              id="testSubject"
              value={testSubject}
              onChange={(e) => setTestSubject(e.target.value)}
              placeholder="Тестовое письмо"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="testMessage">Сообщение</Label>
            <Textarea
              id="testMessage"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Это тестовое письмо для проверки настроек SMTP."
              rows={4}
            />
          </div>

          {testResult && (
            <Alert className={testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {testResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={testResult.success ? "text-green-800" : "text-red-800"}>
                {testResult.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button
              onClick={sendTestEmail}
              disabled={testLoading || !testEmail.trim()}
              variant="outline"
            >
              <Send className="mr-2 h-4 w-4" />
              {testLoading ? 'Отправка...' : 'Отправить тестовое письмо'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

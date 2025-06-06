
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Database, TestTube, Save, AlertCircle, CheckCircle, TableProperties, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DatabaseConfig {
  host: string;
  database: string;
  username: string;
  password: string;
  port: number;
}

export const DatabaseSettings = () => {
  const [dbConfig, setDbConfig] = useState<DatabaseConfig>({
    host: 'localhost',
    database: 'texttabs_admin',
    username: '',
    password: '',
    port: 3306
  });

  const [loading, setLoading] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [createTablesLoading, setCreateTablesLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Загрузка настроек при монтировании компонента
  useEffect(() => {
    loadDatabaseConfig();
  }, []);

  const loadDatabaseConfig = async () => {
    setLoadingConfig(true);
    try {
      const response = await fetch('/api/settings.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'load_db_config'
        })
      });

      const result = await response.json();
      
      if (result.success && result.config) {
        setDbConfig(result.config);
        console.log('Настройки БД загружены:', result.config);
      } else {
        console.log('Настройки БД не найдены, используются значения по умолчанию');
      }
    } catch (error) {
      console.error('Ошибка при загрузке настроек БД:', error);
      toast({
        title: "Предупреждение",
        description: "Не удалось загрузить сохраненные настройки БД",
        variant: "destructive",
      });
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleInputChange = (field: keyof DatabaseConfig, value: string | number) => {
    setDbConfig(prev => ({
      ...prev,
      [field]: value
    }));
    setTestResult(null);
  };

  const testConnection = async () => {
    setTestLoading(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/settings.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'test_db_connection',
          config: dbConfig
        })
      });

      const result = await response.json();
      
      setTestResult({
        success: result.success,
        message: result.message || (result.success ? 'Подключение успешно!' : 'Ошибка подключения')
      });

      toast({
        title: result.success ? "Успех" : "Ошибка",
        description: result.message || (result.success ? "Подключение к базе данных успешно установлено!" : "Не удалось подключиться к базе данных"),
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Ошибка при тестировании подключения'
      });
      toast({
        title: "Ошибка",
        description: "Ошибка при тестировании подключения к базе данных",
        variant: "destructive",
      });
    } finally {
      setTestLoading(false);
    }
  };

  const createTables = async () => {
    setCreateTablesLoading(true);

    try {
      const response = await fetch('/api/settings.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_tables',
          config: dbConfig
        })
      });

      const result = await response.json();
      
      toast({
        title: result.success ? "Успех" : "Ошибка",
        description: result.message || (result.success ? "Таблицы успешно созданы!" : "Не удалось создать таблицы"),
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Ошибка при создании таблиц",
        variant: "destructive",
      });
    } finally {
      setCreateTablesLoading(false);
    }
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
          action: 'save_db_config',
          config: dbConfig
        })
      });

      const result = await response.json();
      
      toast({
        title: result.success ? "Успех" : "Ошибка",
        description: result.message || (result.success ? "Настройки базы данных сохранены!" : "Не удалось сохранить настройки"),
        variant: result.success ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Ошибка при сохранении настроек",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingConfig) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Настройки базы данных
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Настройки базы данных
        </CardTitle>
        <CardDescription>
          Конфигурация подключения к MySQL базе данных
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="host">Хост *</Label>
            <Input
              id="host"
              value={dbConfig.host}
              onChange={(e) => handleInputChange('host', e.target.value)}
              placeholder="localhost"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="port">Порт</Label>
            <Input
              id="port"
              type="number"
              value={dbConfig.port}
              onChange={(e) => handleInputChange('port', parseInt(e.target.value) || 3306)}
              placeholder="3306"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="database">Имя базы данных *</Label>
            <Input
              id="database"
              value={dbConfig.database}
              onChange={(e) => handleInputChange('database', e.target.value)}
              placeholder="texttabs_admin"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Пользователь *</Label>
            <Input
              id="username"
              value={dbConfig.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              placeholder="username"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            value={dbConfig.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="••••••••"
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

        <Separator />

        <div className="flex gap-3 flex-wrap">
          <Button
            onClick={loadDatabaseConfig}
            disabled={loadingConfig}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loadingConfig ? 'animate-spin' : ''}`} />
            Перезагрузить
          </Button>
          
          <Button
            onClick={testConnection}
            disabled={testLoading}
            variant="outline"
          >
            <TestTube className="mr-2 h-4 w-4" />
            {testLoading ? 'Тестирование...' : 'Тестировать подключение'}
          </Button>
          
          <Button
            onClick={createTables}
            disabled={createTablesLoading}
            variant="outline"
          >
            <TableProperties className="mr-2 h-4 w-4" />
            {createTablesLoading ? 'Создание...' : 'Создать таблицы'}
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
  );
};

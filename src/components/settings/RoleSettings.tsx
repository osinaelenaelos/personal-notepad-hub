
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Users, RefreshCw } from 'lucide-react';
import { useApi, useMutation } from '@/hooks/useApi';
import { settingsService, RoleLimit } from '@/services/settingsService';
import { toast } from '@/hooks/use-toast';

export const RoleSettings = () => {
  const [limits, setLimits] = useState<RoleLimit[]>([]);

  const { loading: loadingData, refetch } = useApi(
    () => settingsService.getRoleLimits(),
    [],
    {
      onSuccess: (data) => {
        if (data) {
          setLimits(data);
        } else {
          // Устанавливаем значения по умолчанию
          setLimits([
            { setting_key: 'user_page_limit', setting_value: '10', description: 'Максимальное количество страниц для обычного пользователя' },
            { setting_key: 'premium_page_limit', setting_value: '100', description: 'Максимальное количество страниц для премиум пользователя' },
            { setting_key: 'guest_page_limit', setting_value: '3', description: 'Максимальное количество страниц для гостя' },
            { setting_key: 'max_file_size', setting_value: '5242880', description: 'Максимальный размер файла в байтах (5MB)' },
            { setting_key: 'max_page_content_length', setting_value: '100000', description: 'Максимальная длина содержимого страницы' }
          ]);
        }
      }
    }
  );

  const { mutate: updateLimits, loading } = useMutation(settingsService.updateRoleLimits.bind(settingsService));

  const handleLimitChange = (index: number, field: keyof RoleLimit, value: string) => {
    setLimits(prev => prev.map((limit, i) => 
      i === index ? { ...limit, [field]: value } : limit
    ));
  };

  const addNewLimit = () => {
    setLimits(prev => [...prev, {
      setting_key: '',
      setting_value: '',
      description: ''
    }]);
  };

  const removeLimit = (index: number) => {
    setLimits(prev => prev.filter((_, i) => i !== index));
  };

  const saveRoleLimits = async () => {
    const filteredLimits = limits.filter(limit => limit.setting_key && limit.setting_value);
    const result = await updateLimits(filteredLimits);
    
    if (result) {
      toast({
        title: "Успех",
        description: "Ограничения ролей сохранены!",
      });
    }
  };

  if (loadingData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Ограничения ролей
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Загрузка ограничений...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Ограничения ролей
        </CardTitle>
        <CardDescription>
          Настройка ограничений для различных ролей пользователей
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {limits.map((limit, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`key-${index}`}>Ключ настройки</Label>
                <Input
                  id={`key-${index}`}
                  value={limit.setting_key}
                  onChange={(e) => handleLimitChange(index, 'setting_key', e.target.value)}
                  placeholder="user_page_limit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`value-${index}`}>Значение</Label>
                <Input
                  id={`value-${index}`}
                  value={limit.setting_value}
                  onChange={(e) => handleLimitChange(index, 'setting_value', e.target.value)}
                  placeholder="10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`desc-${index}`}>Описание</Label>
              <Textarea
                id={`desc-${index}`}
                value={limit.description}
                onChange={(e) => handleLimitChange(index, 'description', e.target.value)}
                placeholder="Описание ограничения..."
                rows={2}
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => removeLimit(index)}
              className="text-red-600 hover:text-red-700"
            >
              Удалить
            </Button>
          </div>
        ))}

        <div className="flex gap-3">
          <Button onClick={addNewLimit} variant="outline">
            Добавить ограничение
          </Button>
          
          <Button onClick={() => refetch()} variant="outline" disabled={loadingData}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loadingData ? 'animate-spin' : ''}`} />
            Перезагрузить
          </Button>
          
          <Button onClick={saveRoleLimits} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

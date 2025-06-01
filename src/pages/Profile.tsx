
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface UserProfile {
  id: number;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  lastActive: string;
  pagesCount: number;
  pagesLimit: number;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoadingProfile(true);
    try {
      const response = await fetch('/api/users.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          action: 'get_profile'
        })
      });

      const result = await response.json();
      if (result.success) {
        setProfile(result.data);
        setEmail(result.data.email);
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить профиль",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Ошибка",
        description: "Ошибка при загрузке профиля",
        variant: "destructive",
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  const updateEmail = async () => {
    if (!email.trim()) {
      toast({
        title: "Ошибка",
        description: "Email не может быть пустым",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/users.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          action: 'update_profile',
          email: email.trim()
        })
      });

      const result = await response.json();
      
      toast({
        title: result.success ? "Успех" : "Ошибка",
        description: result.message || (result.success ? "Email обновлен!" : "Не удалось обновить email"),
        variant: result.success ? "default" : "destructive",
      });

      if (result.success) {
        loadProfile();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Ошибка при обновлении email",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Все поля пароля должны быть заполнены",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Новые пароли не совпадают",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Ошибка",
        description: "Пароль должен быть не менее 6 символов",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/users.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          action: 'change_password',
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      const result = await response.json();
      
      toast({
        title: result.success ? "Успех" : "Ошибка",
        description: result.message || (result.success ? "Пароль изменен!" : "Не удалось изменить пароль"),
        variant: result.success ? "default" : "destructive",
      });

      if (result.success) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Ошибка при изменении пароля",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Профиль</h1>
          <p className="text-muted-foreground">
            Управление профилем администратора
          </p>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Загрузка профиля...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Профиль</h1>
        <p className="text-muted-foreground">
          Управление профилем администратора
        </p>
      </div>

      <div className="grid gap-6">
        {/* Информация профиля */}
        {profile && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Информация профиля
              </CardTitle>
              <CardDescription>
                Основная информация о вашем аккаунте
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">ID</Label>
                  <p className="text-sm text-muted-foreground">{profile.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Роль</Label>
                  <p className="text-sm text-muted-foreground">{profile.role}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Статус</Label>
                  <p className="text-sm text-muted-foreground">{profile.status}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Дата регистрации</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(profile.createdAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Количество страниц</Label>
                  <p className="text-sm text-muted-foreground">{profile.pagesCount}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Последняя активность</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(profile.lastActive).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Изменение Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Изменение Email
            </CardTitle>
            <CardDescription>
              Обновите ваш email адрес
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <Button
              onClick={updateEmail}
              disabled={loading || email === profile?.email}
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Сохранение...' : 'Сохранить Email'}
            </Button>
          </CardContent>
        </Card>

        {/* Изменение пароля */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Изменение пароля
            </CardTitle>
            <CardDescription>
              Обновите ваш пароль для входа
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Текущий пароль</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Введите текущий пароль"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Новый пароль</Label>
              <Input
                id="newPassword"
                type={showPasswords ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Введите новый пароль"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <Input
                id="confirmPassword"
                type={showPasswords ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Подтвердите новый пароль"
              />
            </div>
            <Button
              onClick={changePassword}
              disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            >
              <Lock className="mr-2 h-4 w-4" />
              {loading ? 'Изменение...' : 'Изменить пароль'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;


import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Monitor, Moon, Sun, Eye, Layout, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AppearanceSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    // Тема
    theme: "system",
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    darkMode: true,
    
    // Интерфейс
    compactMode: false,
    animationsEnabled: true,
    showAvatars: true,
    sidebarCollapsed: false,
    
    // Брендинг
    appName: "Chrome Extension Admin",
    logoUrl: "",
    faviconUrl: "",
    customCss: "",
    
    // Доступность
    highContrast: false,
    largeText: false,
    reducedMotion: false,
  });

  const handleSave = () => {
    toast({
      title: "Настройки сохранены",
      description: "Настройки внешнего вида успешно обновлены",
    });
  };

  const presetColors = [
    { name: "Синий", value: "#3b82f6" },
    { name: "Зеленый", value: "#10b981" },
    { name: "Фиолетовый", value: "#8b5cf6" },
    { name: "Розовый", value: "#ec4899" },
    { name: "Оранжевый", value: "#f59e0b" },
    { name: "Красный", value: "#ef4444" },
  ];

  const themes = [
    { id: "light", name: "Светлая", icon: Sun },
    { id: "dark", name: "Темная", icon: Moon },
    { id: "system", name: "Системная", icon: Monitor },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Настройки внешнего вида</CardTitle>
          <CardDescription>
            Настройка темы, цветов и интерфейса админ-панели
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="theme" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Тема
          </TabsTrigger>
          <TabsTrigger value="interface" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Интерфейс
          </TabsTrigger>
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Брендинг
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Доступность
          </TabsTrigger>
        </TabsList>

        <TabsContent value="theme">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Цветовая схема</CardTitle>
                <CardDescription>Выберите основную тему приложения</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSettings({...settings, theme: theme.id})}
                      className={`p-4 border rounded-lg flex flex-col items-center space-y-2 hover:bg-accent ${
                        settings.theme === theme.id ? 'border-primary bg-accent' : ''
                      }`}
                    >
                      <theme.icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{theme.name}</span>
                    </button>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Основной цвет</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                        className="font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Предустановленные цвета</Label>
                    <div className="grid grid-cols-6 gap-2">
                      {presetColors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => setSettings({...settings, primaryColor: color.value})}
                          className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400"
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Предварительный просмотр</CardTitle>
                <CardDescription>Как будет выглядеть интерфейс</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 space-y-3 bg-background">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: settings.primaryColor }}></div>
                      <span className="font-medium">Заголовок</span>
                    </div>
                    <Button size="sm" style={{ backgroundColor: settings.primaryColor }}>
                      Кнопка
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-muted rounded w-3/4"></div>
                    <div className="h-2 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="flex-1 h-8 bg-muted rounded"></div>
                    <div className="w-20 h-8 rounded" style={{ backgroundColor: settings.primaryColor }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="interface">
          <Card>
            <CardHeader>
              <CardTitle>Настройки интерфейса</CardTitle>
              <CardDescription>Управление поведением и отображением элементов</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Компактный режим</Label>
                    <p className="text-sm text-muted-foreground">
                      Уменьшенные отступы и размеры элементов
                    </p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => setSettings({...settings, compactMode: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Анимации</Label>
                    <p className="text-sm text-muted-foreground">
                      Плавные переходы и анимации интерфейса
                    </p>
                  </div>
                  <Switch
                    checked={settings.animationsEnabled}
                    onCheckedChange={(checked) => setSettings({...settings, animationsEnabled: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Показывать аватары</Label>
                    <p className="text-sm text-muted-foreground">
                      Отображение аватаров пользователей в списках
                    </p>
                  </div>
                  <Switch
                    checked={settings.showAvatars}
                    onCheckedChange={(checked) => setSettings({...settings, showAvatars: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Свернутая боковая панель</Label>
                    <p className="text-sm text-muted-foreground">
                      Боковая панель будет свернута по умолчанию
                    </p>
                  </div>
                  <Switch
                    checked={settings.sidebarCollapsed}
                    onCheckedChange={(checked) => setSettings({...settings, sidebarCollapsed: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Брендинг приложения</CardTitle>
              <CardDescription>Настройка названия, логотипа и стилей</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Название приложения</Label>
                  <Input
                    value={settings.appName}
                    onChange={(e) => setSettings({...settings, appName: e.target.value})}
                    placeholder="Chrome Extension Admin"
                  />
                </div>

                <div className="space-y-2">
                  <Label>URL логотипа</Label>
                  <Input
                    value={settings.logoUrl}
                    onChange={(e) => setSettings({...settings, logoUrl: e.target.value})}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>URL favicon</Label>
                <Input
                  value={settings.faviconUrl}
                  onChange={(e) => setSettings({...settings, faviconUrl: e.target.value})}
                  placeholder="https://example.com/favicon.ico"
                />
              </div>

              <div className="space-y-2">
                <Label>Дополнительный CSS</Label>
                <textarea
                  value={settings.customCss}
                  onChange={(e) => setSettings({...settings, customCss: e.target.value})}
                  placeholder="/* Добавьте свои стили здесь */"
                  className="w-full h-32 p-3 border rounded-md font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility">
          <Card>
            <CardHeader>
              <CardTitle>Доступность</CardTitle>
              <CardDescription>Настройки для улучшения доступности интерфейса</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Высокий контраст</Label>
                    <p className="text-sm text-muted-foreground">
                      Увеличенный контраст для лучшей читаемости
                    </p>
                  </div>
                  <Switch
                    checked={settings.highContrast}
                    onCheckedChange={(checked) => setSettings({...settings, highContrast: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Крупный шрифт</Label>
                    <p className="text-sm text-muted-foreground">
                      Увеличенный размер шрифта для лучшей читаемости
                    </p>
                  </div>
                  <Switch
                    checked={settings.largeText}
                    onCheckedChange={(checked) => setSettings({...settings, largeText: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Сниженная анимация</Label>
                    <p className="text-sm text-muted-foreground">
                      Уменьшение анимаций для людей с вестибулярными нарушениями
                    </p>
                  </div>
                  <Switch
                    checked={settings.reducedMotion}
                    onCheckedChange={(checked) => setSettings({...settings, reducedMotion: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Сохранить настройки
        </Button>
      </div>
    </div>
  );
};

export default AppearanceSettings;

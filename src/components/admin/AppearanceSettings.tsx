
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Download, Upload, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  fontSize: number;
  darkMode: boolean;
  compactMode: boolean;
}

interface LayoutSettings {
  showSidebar: boolean;
  sidebarWidth: number;
  showToolbar: boolean;
  showStatusBar: boolean;
  showLineNumbers: boolean;
  wordWrap: boolean;
}

const AppearanceSettings = () => {
  const { toast } = useToast();
  
  const [themeSettings, setThemeSettings] = useLocalStorage<ThemeSettings>('theme-settings', {
    primaryColor: "#3b82f6",
    secondaryColor: "#64748b",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    borderRadius: 6,
    fontSize: 14,
    darkMode: false,
    compactMode: false
  });

  const [layoutSettings, setLayoutSettings] = useLocalStorage<LayoutSettings>('layout-settings', {
    showSidebar: true,
    sidebarWidth: 250,
    showToolbar: true,
    showStatusBar: true,
    showLineNumbers: true,
    wordWrap: true
  });

  const colorPresets = [
    { name: "Синий", primary: "#3b82f6", secondary: "#64748b" },
    { name: "Зеленый", primary: "#10b981", secondary: "#6b7280" },
    { name: "Фиолетовый", primary: "#8b5cf6", secondary: "#6b7280" },
    { name: "Розовый", primary: "#ec4899", secondary: "#6b7280" },
    { name: "Оранжевый", primary: "#f59e0b", secondary: "#6b7280" }
  ];

  const handleSaveTheme = () => {
    toast({
      title: "Тема сохранена",
      description: "Настройки темы успешно применены",
    });
  };

  const handleSaveLayout = () => {
    toast({
      title: "Макет сохранен",
      description: "Настройки макета успешно применены",
    });
  };

  const handleResetTheme = () => {
    setThemeSettings({
      primaryColor: "#3b82f6",
      secondaryColor: "#64748b",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      borderRadius: 6,
      fontSize: 14,
      darkMode: false,
      compactMode: false
    });
    toast({
      title: "Тема сброшена",
      description: "Настройки темы возвращены к значениям по умолчанию",
    });
  };

  const handleApplyPreset = (preset: any) => {
    setThemeSettings(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary
    }));
    toast({
      title: "Пресет применен",
      description: `Цветовая схема "${preset.name}" применена`,
    });
  };

  const handleExportTheme = () => {
    const exportData = {
      theme: themeSettings,
      layout: layoutSettings
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'theme-settings.json';
    link.click();
    
    toast({
      title: "Тема экспортирована",
      description: "Файл настроек загружен",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Настройки внешнего вида</CardTitle>
          <CardDescription>
            Персонализация интерфейса Chrome расширения
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="theme" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Тема
          </TabsTrigger>
          <TabsTrigger value="layout">Макет</TabsTrigger>
          <TabsTrigger value="export">Импорт/Экспорт</TabsTrigger>
        </TabsList>

        <TabsContent value="theme">
          <Card>
            <CardHeader>
              <CardTitle>Настройки темы</CardTitle>
              <CardDescription>Цвета, шрифты и общий стиль интерфейса</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Основной цвет</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={themeSettings.primaryColor}
                        onChange={(e) => setThemeSettings(prev => ({...prev, primaryColor: e.target.value}))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={themeSettings.primaryColor}
                        onChange={(e) => setThemeSettings(prev => ({...prev, primaryColor: e.target.value}))}
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Вторичный цвет</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={themeSettings.secondaryColor}
                        onChange={(e) => setThemeSettings(prev => ({...prev, secondaryColor: e.target.value}))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={themeSettings.secondaryColor}
                        onChange={(e) => setThemeSettings(prev => ({...prev, secondaryColor: e.target.value}))}
                        placeholder="#64748b"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fontSize">Размер шрифта</Label>
                    <Input
                      id="fontSize"
                      type="number"
                      min="10"
                      max="20"
                      value={themeSettings.fontSize}
                      onChange={(e) => setThemeSettings(prev => ({...prev, fontSize: parseInt(e.target.value)}))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="borderRadius">Скругление углов</Label>
                    <Input
                      id="borderRadius"
                      type="number"
                      min="0"
                      max="20"
                      value={themeSettings.borderRadius}
                      onChange={(e) => setThemeSettings(prev => ({...prev, borderRadius: parseInt(e.target.value)}))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Цветовые пресеты</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {colorPresets.map((preset) => (
                        <Button
                          key={preset.name}
                          variant="outline"
                          className="justify-start p-3 h-auto"
                          onClick={() => handleApplyPreset(preset)}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              <div 
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: preset.primary }}
                              />
                              <div 
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: preset.secondary }}
                              />
                            </div>
                            <span className="text-sm">{preset.name}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Темная тема</Label>
                        <p className="text-sm text-muted-foreground">
                          Использовать темную цветовую схему
                        </p>
                      </div>
                      <Switch
                        checked={themeSettings.darkMode}
                        onCheckedChange={(checked) => setThemeSettings(prev => ({...prev, darkMode: checked}))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Компактный режим</Label>
                        <p className="text-sm text-muted-foreground">
                          Уменьшенные отступы и размеры элементов
                        </p>
                      </div>
                      <Switch
                        checked={themeSettings.compactMode}
                        onCheckedChange={(checked) => setThemeSettings(prev => ({...prev, compactMode: checked}))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button onClick={handleSaveTheme}>
                  Применить тему
                </Button>
                <Button variant="outline" onClick={handleResetTheme}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Сбросить
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>Настройки макета</CardTitle>
              <CardDescription>Расположение элементов интерфейса</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Показать боковую панель</Label>
                    <p className="text-sm text-muted-foreground">
                      Отображение навигации слева
                    </p>
                  </div>
                  <Switch
                    checked={layoutSettings.showSidebar}
                    onCheckedChange={(checked) => setLayoutSettings(prev => ({...prev, showSidebar: checked}))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Показать панель инструментов</Label>
                    <p className="text-sm text-muted-foreground">
                      Панель с кнопками действий
                    </p>
                  </div>
                  <Switch
                    checked={layoutSettings.showToolbar}
                    onCheckedChange={(checked) => setLayoutSettings(prev => ({...prev, showToolbar: checked}))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Показать строку состояния</Label>
                    <p className="text-sm text-muted-foreground">
                      Информация внизу экрана
                    </p>
                  </div>
                  <Switch
                    checked={layoutSettings.showStatusBar}
                    onCheckedChange={(checked) => setLayoutSettings(prev => ({...prev, showStatusBar: checked}))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Номера строк</Label>
                    <p className="text-sm text-muted-foreground">
                      Показывать номера строк в редакторе
                    </p>
                  </div>
                  <Switch
                    checked={layoutSettings.showLineNumbers}
                    onCheckedChange={(checked) => setLayoutSettings(prev => ({...prev, showLineNumbers: checked}))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Перенос строк</Label>
                    <p className="text-sm text-muted-foreground">
                      Автоматический перенос длинных строк
                    </p>
                  </div>
                  <Switch
                    checked={layoutSettings.wordWrap}
                    onCheckedChange={(checked) => setLayoutSettings(prev => ({...prev, wordWrap: checked}))}
                  />
                </div>

                {layoutSettings.showSidebar && (
                  <div className="space-y-2">
                    <Label htmlFor="sidebarWidth">Ширина боковой панели (px)</Label>
                    <Input
                      id="sidebarWidth"
                      type="number"
                      min="200"
                      max="400"
                      value={layoutSettings.sidebarWidth}
                      onChange={(e) => setLayoutSettings(prev => ({...prev, sidebarWidth: parseInt(e.target.value)}))}
                    />
                  </div>
                )}
              </div>

              <Button onClick={handleSaveLayout}>
                Применить настройки макета
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Импорт и экспорт настроек</CardTitle>
              <CardDescription>Сохранение и загрузка пользовательских тем</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Экспорт настроек</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Сохраните текущие настройки темы и макета в файл
                  </p>
                  <Button onClick={handleExportTheme}>
                    <Download className="h-4 w-4 mr-2" />
                    Экспортировать настройки
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Импорт настроек</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Загрузите ранее сохраненные настройки из файла
                  </p>
                  <div className="flex items-center space-x-2">
                    <Input type="file" accept=".json" className="flex-1" />
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Импортировать
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppearanceSettings;

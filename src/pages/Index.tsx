
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Users, FileText, Settings, Shield, MessageSquare, BarChart3, Code, Zap, Palette, UserCog } from "lucide-react";
import Dashboard from "@/components/admin/Dashboard";
import UserManagement from "@/components/admin/UserManagement";
import ContentManagement from "@/components/admin/ContentManagement";
import SystemSettings from "@/components/admin/SystemSettings";
import TechnicalInfo from "@/components/admin/TechnicalInfo";
import Communications from "@/components/admin/Communications";
import Analytics from "@/components/admin/Analytics";
import ApiManagement from "@/components/admin/ApiManagement";
import Automation from "@/components/admin/Automation";
import AppearanceSettings from "@/components/admin/AppearanceSettings";
import LimitsAndFeatures from "@/components/admin/LimitsAndFeatures";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Админ-панель Chrome Extension
          </h1>
          <p className="text-gray-600">
            Полная система управления расширением для создания текстовых страниц
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-11 lg:w-auto lg:inline-flex">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Дашборд
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Аналитика
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Пользователи
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Контент
            </TabsTrigger>
            <TabsTrigger value="limits" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              Лимиты
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              API
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Автоматизация
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Настройки
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Внешний вид
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Техническая
            </TabsTrigger>
            <TabsTrigger value="communications" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Связь
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>

          <TabsContent value="limits">
            <LimitsAndFeatures />
          </TabsContent>

          <TabsContent value="api">
            <ApiManagement />
          </TabsContent>

          <TabsContent value="automation">
            <Automation />
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>

          <TabsContent value="appearance">
            <AppearanceSettings />
          </TabsContent>

          <TabsContent value="technical">
            <TechnicalInfo />
          </TabsContent>

          <TabsContent value="communications">
            <Communications />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

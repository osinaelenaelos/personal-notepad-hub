
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Mail, Code, Users } from 'lucide-react';
import { DatabaseSettings } from '@/components/settings/DatabaseSettings';
import { EmailSettings } from '@/components/settings/EmailSettings';
import { RoleSettings } from '@/components/settings/RoleSettings';
import { ApiDocumentation } from '@/components/ApiDocumentation';

const Settings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Настройки</h1>
        <p className="text-muted-foreground">
          Управление настройками системы и API документация
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="database" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            База данных
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Почта
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Роли
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            API
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="database">
          <DatabaseSettings />
        </TabsContent>
        
        <TabsContent value="email">
          <EmailSettings />
        </TabsContent>
        
        <TabsContent value="roles">
          <RoleSettings />
        </TabsContent>
        
        <TabsContent value="api">
          <ApiDocumentation />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

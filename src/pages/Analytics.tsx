
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Server } from 'lucide-react';
import { AnalyticsStats } from '@/components/AnalyticsStats';
import { SystemStatus } from '@/components/SystemStatus';

const Analytics = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Аналитика</h1>
        <p className="text-muted-foreground">
          Статистика и мониторинг системы
        </p>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="stats" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            Статистика
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Состояние системы
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats">
          <AnalyticsStats />
        </TabsContent>
        
        <TabsContent value="system">
          <SystemStatus />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;

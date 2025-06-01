
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApi } from '@/hooks/useApi';
import { dashboardService } from '@/services/dashboardService';

export const ActivityChart = () => {
  const { data: dashboardData, loading, error } = useApi(
    () => dashboardService.getDashboardData(),
    []
  );

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-muted-foreground">Загрузка графика...</div>
      </div>
    );
  }

  if (error || !dashboardData?.activityChart) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-muted-foreground">Не удалось загрузить данные активности</div>
      </div>
    );
  }

  const data = dashboardData.activityChart.map(item => ({
    day: new Date(item.date).toLocaleDateString('ru-RU', { weekday: 'short' }),
    pages: parseInt(item.pages?.toString() || '0')
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="day" 
            stroke="#888888"
            fontSize={12}
          />
          <YAxis 
            stroke="#888888"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey="pages" fill="#3b82f6" name="Создано страниц" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

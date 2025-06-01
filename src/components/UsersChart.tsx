
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApi } from '@/hooks/useApi';
import { dashboardService } from '@/services/dashboardService';

export const UsersChart = () => {
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

  if (error || !dashboardData?.usersChart) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-muted-foreground">Не удалось загрузить данные графика</div>
      </div>
    );
  }

  const data = dashboardData.usersChart.map(item => ({
    month: item.month,
    users: parseInt(item.users?.toString() || '0')
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
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
          <Line 
            type="monotone" 
            dataKey="users" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

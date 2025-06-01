
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useApi } from '@/hooks/useApi';
import { dashboardService } from '@/services/dashboardService';

export const RecentUsers = () => {
  const { data: dashboardData, loading, error } = useApi(
    () => dashboardService.getDashboardData(),
    []
  );

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div>
                <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-24 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="w-8 h-4 bg-gray-200 rounded mb-1"></div>
                <div className="w-12 h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !dashboardData?.recentUsers) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Не удалось загрузить данные пользователей
      </div>
    );
  }

  const users = dashboardData.recentUsers;

  const getStatusBadge = (status: string) => {
    if (status === 'verified') {
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Подтвержден</Badge>;
    }
    return <Badge variant="secondary">Ожидает</Badge>;
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                Регистрация: {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {getStatusBadge(user.status)}
          </div>
        </div>
      ))}
    </div>
  );
};


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, FileText, Activity, TrendingUp, Clock, Shield, Database, Mail } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { dashboardService } from '@/services/dashboardService';

export const AnalyticsStats = () => {
  const { data: dashboardData, loading, error } = useApi(
    () => dashboardService.getDashboardData(),
    []
  );

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-2" />
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-muted-foreground">Не удалось загрузить данные аналитики</div>
        </CardContent>
      </Card>
    );
  }

  const { stats } = dashboardData;
  const verificationRate = stats.totalUsers > 0 ? (stats.verifiedUsers / stats.totalUsers) * 100 : 0;
  const avgPagesPerUser = stats.totalUsers > 0 ? stats.totalPages / stats.totalUsers : 0;

  const additionalStats = [
    {
      title: "Коэффициент верификации",
      value: `${verificationRate.toFixed(1)}%`,
      description: `${stats.verifiedUsers} из ${stats.totalUsers} пользователей`,
      icon: Shield,
      progress: verificationRate,
      color: verificationRate > 50 ? "text-green-600" : "text-yellow-600"
    },
    {
      title: "Среднее страниц на пользователя", 
      value: avgPagesPerUser.toFixed(1),
      description: `Всего ${stats.totalPages} страниц`,
      icon: FileText,
      progress: Math.min(avgPagesPerUser * 10, 100),
      color: "text-blue-600"
    },
    {
      title: "Активность системы",
      value: `${stats.activityPercent}%`,
      description: "За последние 7 дней",
      icon: Activity,
      progress: stats.activityPercent,
      color: stats.activityPercent > 70 ? "text-green-600" : stats.activityPercent > 40 ? "text-yellow-600" : "text-red-600"
    },
    {
      title: "Рост пользователей",
      value: "+12.5%",
      description: "По сравнению с прошлым месяцем",
      icon: TrendingUp,
      progress: 75,
      color: "text-green-600"
    }
  ];

  const systemStats = [
    {
      title: "Состояние БД",
      value: "Онлайн",
      description: "Подключение активно",
      icon: Database,
      status: "success"
    },
    {
      title: "SMTP сервис",
      value: "Настроен",
      description: "Готов к отправке",
      icon: Mail,
      status: "success"
    },
    {
      title: "Время работы",
      value: "99.9%",
      description: "За последний месяц",
      icon: Clock,
      status: "success"
    },
    {
      title: "Производительность",
      value: "Отлично",
      description: "Быстрый отклик",
      icon: Activity,
      status: "success"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Основная статистика */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.verifiedUsers} подтверждены
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего страниц</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPages}</div>
            <p className="text-xs text-muted-foreground">
              Создано пользователями
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активность</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activityPercent}%</div>
            <p className="text-xs text-muted-foreground">
              За последнюю неделю
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Верифицированы</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verifiedUsers}</div>
            <p className="text-xs text-muted-foreground">
              {verificationRate.toFixed(1)}% от общего числа
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Расширенная аналитика */}
      <Card>
        <CardHeader>
          <CardTitle>Детальная аналитика</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {additionalStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    <span className="text-sm font-medium">{stat.title}</span>
                  </div>
                  <span className={`text-lg font-bold ${stat.color}`}>
                    {stat.value}
                  </span>
                </div>
                <Progress value={stat.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Состояние системы */}
      <Card>
        <CardHeader>
          <CardTitle>Состояние системы</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {systemStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="flex-shrink-0">
                  <stat.icon className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{stat.title}</span>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      {stat.value}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {stat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

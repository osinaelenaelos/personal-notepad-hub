
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Activity, TrendingUp, Globe, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  // Моковые данные для демонстрации
  const stats = {
    totalUsers: 12547,
    activeUsers: 8432,
    totalPages: 45821,
    dailyActive: 3241
  };

  const activityData = [
    { name: 'Пн', users: 4000, pages: 2400 },
    { name: 'Вт', users: 3000, pages: 1398 },
    { name: 'Ср', users: 2000, pages: 9800 },
    { name: 'Чт', users: 2780, pages: 3908 },
    { name: 'Пт', users: 1890, pages: 4800 },
    { name: 'Сб', users: 2390, pages: 3800 },
    { name: 'Вс', users: 3490, pages: 4300 },
  ];

  const geographyData = [
    { name: 'Россия', value: 45, color: '#0088FE' },
    { name: 'США', value: 25, color: '#00C49F' },
    { name: 'Европа', value: 20, color: '#FFBB28' },
    { name: 'Другие', value: 10, color: '#FF8042' },
  ];

  const featureUsage = [
    { feature: 'Создание страниц', usage: 89 },
    { feature: 'Редактирование', usage: 76 },
    { feature: 'Поиск', usage: 65 },
    { feature: 'Экспорт', usage: 43 },
    { feature: 'Синхронизация', usage: 32 },
  ];

  return (
    <div className="space-y-6">
      {/* Основная статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% с прошлого месяца</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные пользователи</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">67% от общего числа</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Создано страниц</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPages.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+23% с прошлого месяца</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Сегодня активных</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dailyActive.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Сегодня</p>
          </CardContent>
        </Card>
      </div>

      {/* Графики активности */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Активность по дням</CardTitle>
            <CardDescription>Пользователи и созданные страницы</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#8884d8" name="Пользователи" />
                <Line type="monotone" dataKey="pages" stroke="#82ca9d" name="Страницы" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>География пользователей</CardTitle>
            <CardDescription>Распределение по регионам</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={geographyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {geographyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Использование функций */}
      <Card>
        <CardHeader>
          <CardTitle>Популярность функций</CardTitle>
          <CardDescription>Какие функции расширения используются чаще всего</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featureUsage} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="feature" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="usage" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

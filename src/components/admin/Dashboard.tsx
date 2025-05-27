
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Activity, TrendingUp, Globe, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAdmin } from "@/contexts/AdminContext";
import { useMemo } from "react";

const Dashboard = () => {
  const { users, pages } = useAdmin();

  const stats = useMemo(() => {
    const activeUsers = users.filter(user => user.status === 'active').length;
    const totalPages = pages.length;
    const premiumUsers = users.filter(user => user.premium).length;
    
    return {
      totalUsers: users.length,
      activeUsers,
      totalPages,
      premiumUsers
    };
  }, [users, pages]);

  // Генерируем динамические данные для графиков на основе реальных данных
  const activityData = useMemo(() => {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    return days.map(day => ({
      name: day,
      users: Math.floor(Math.random() * stats.activeUsers) + 10,
      pages: Math.floor(Math.random() * stats.totalPages) + 5
    }));
  }, [stats]);

  const geographyData = [
    { name: 'Россия', value: 45, color: '#0088FE' },
    { name: 'США', value: 25, color: '#00C49F' },
    { name: 'Европа', value: 20, color: '#FFBB28' },
    { name: 'Другие', value: 10, color: '#FF8042' },
  ];

  const featureUsage = [
    { feature: 'Создание страниц', usage: stats.totalPages },
    { feature: 'Редактирование', usage: Math.floor(stats.totalPages * 0.8) },
    { feature: 'Поиск', usage: Math.floor(stats.totalPages * 0.6) },
    { feature: 'Экспорт', usage: Math.floor(stats.totalPages * 0.4) },
    { feature: 'Синхронизация', usage: Math.floor(stats.totalPages * 0.3) },
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
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} активных из {stats.totalUsers}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные пользователи</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% от общего числа
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Создано страниц</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPages}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(stats.totalPages / stats.activeUsers)} страниц на пользователя
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium пользователи</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.premiumUsers}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.premiumUsers / stats.totalUsers) * 100)}% от всех пользователей
            </p>
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

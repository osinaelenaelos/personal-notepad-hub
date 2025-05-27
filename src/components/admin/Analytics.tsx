
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Users, FileText, Clock, Globe, Download, Share2 } from "lucide-react";

const Analytics = () => {
  const userGrowthData = [
    { month: 'Янв', newUsers: 1200, activeUsers: 3400, retention: 85 },
    { month: 'Фев', newUsers: 1800, activeUsers: 4200, retention: 87 },
    { month: 'Мар', newUsers: 2200, activeUsers: 5100, retention: 89 },
    { month: 'Апр', newUsers: 1900, activeUsers: 5800, retention: 91 },
    { month: 'Май', newUsers: 2400, activeUsers: 6500, retention: 88 },
    { month: 'Июн', newUsers: 2800, activeUsers: 7200, retention: 92 },
  ];

  const featureUsageData = [
    { feature: 'Создание страниц', daily: 15420, weekly: 89234, monthly: 342156 },
    { feature: 'Редактирование', daily: 12300, weekly: 75621, monthly: 289453 },
    { feature: 'Поиск', daily: 8900, weekly: 52340, monthly: 198765 },
    { feature: 'Экспорт', daily: 4200, weekly: 28790, monthly: 109876 },
    { feature: 'Синхронизация', daily: 3100, weekly: 21450, monthly: 87432 },
  ];

  const performanceData = [
    { time: '00:00', loadTime: 1.2, responseTime: 0.8, errorRate: 0.1 },
    { time: '04:00', loadTime: 1.1, responseTime: 0.7, errorRate: 0.05 },
    { time: '08:00', loadTime: 1.8, responseTime: 1.2, errorRate: 0.2 },
    { time: '12:00', loadTime: 2.1, responseTime: 1.5, errorRate: 0.3 },
    { time: '16:00', loadTime: 1.9, responseTime: 1.3, errorRate: 0.25 },
    { time: '20:00', loadTime: 1.5, responseTime: 1.0, errorRate: 0.15 },
  ];

  const geographyDetailedData = [
    { country: 'Россия', users: 45230, growth: 12.5, color: '#0088FE' },
    { country: 'США', users: 25120, growth: 8.3, color: '#00C49F' },
    { country: 'Германия', users: 12890, growth: 15.2, color: '#FFBB28' },
    { country: 'Франция', users: 9870, growth: 6.7, color: '#FF8042' },
    { country: 'Япония', users: 7650, growth: 22.1, color: '#8884d8' },
  ];

  const keyMetrics = [
    { title: 'Конверсия регистрации', value: '3.24%', change: '+0.12%', trend: 'up' },
    { title: 'Время в приложении', value: '8.5 мин', change: '+1.2 мин', trend: 'up' },
    { title: 'Частота использования', value: '4.2 раза/день', change: '-0.3', trend: 'down' },
    { title: 'Оценка в магазине', value: '4.7/5', change: '+0.1', trend: 'up' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Расширенная аналитика</CardTitle>
          <CardDescription>
            Детальный анализ использования Chrome расширения
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Ключевые метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className={`flex items-center space-x-1 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm font-medium">{metric.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="growth" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="growth">Рост пользователей</TabsTrigger>
          <TabsTrigger value="features">Использование функций</TabsTrigger>
          <TabsTrigger value="performance">Производительность</TabsTrigger>
          <TabsTrigger value="geography">География</TabsTrigger>
        </TabsList>

        <TabsContent value="growth">
          <Card>
            <CardHeader>
              <CardTitle>Динамика роста пользователей</CardTitle>
              <CardDescription>Новые пользователи, активность и удержание</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="newUsers" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} name="Новые пользователи" />
                  <Area type="monotone" dataKey="activeUsers" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} name="Активные пользователи" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Статистика использования функций</CardTitle>
              <CardDescription>Популярность различных функций расширения</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureUsageData.map((feature, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{feature.feature}</h4>
                      <Badge variant="outline">{feature.daily.toLocaleString()} сегодня</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="block font-medium">За день</span>
                        <span>{feature.daily.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="block font-medium">За неделю</span>
                        <span>{feature.weekly.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="block font-medium">За месяц</span>
                        <span>{feature.monthly.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Мониторинг производительности</CardTitle>
              <CardDescription>Время загрузки, отклик и ошибки по времени суток</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="loadTime" stroke="#8884d8" name="Время загрузки (сек)" />
                  <Line type="monotone" dataKey="responseTime" stroke="#82ca9d" name="Время отклика (сек)" />
                  <Line type="monotone" dataKey="errorRate" stroke="#ff7c7c" name="Процент ошибок (%)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography">
          <Card>
            <CardHeader>
              <CardTitle>Географическое распределение</CardTitle>
              <CardDescription>Пользователи по странам с темпами роста</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {geographyDetailedData.map((country, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: country.color }}
                      ></div>
                      <span className="font-medium">{country.country}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-muted-foreground">
                        {country.users.toLocaleString()} пользователей
                      </span>
                      <Badge variant={country.growth > 10 ? "default" : "secondary"}>
                        +{country.growth}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;

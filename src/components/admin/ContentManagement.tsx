
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Trash2, Flag, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const ContentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Моковые данные контента
  const pages = [
    {
      id: 1,
      title: "Мои заметки по проекту",
      author: "user1@example.com",
      created: "2024-01-15",
      words: 1250,
      status: "public",
      reports: 0
    },
    {
      id: 2,
      title: "Список покупок",
      author: "user2@example.com",
      created: "2024-01-14",
      words: 45,
      status: "private",
      reports: 0
    },
    {
      id: 3,
      title: "Подозрительный контент",
      author: "user3@example.com",
      created: "2024-01-13",
      words: 2340,
      status: "flagged",
      reports: 3
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "public":
        return <Badge className="bg-blue-100 text-blue-800">Публичная</Badge>;
      case "private":
        return <Badge variant="secondary">Приватная</Badge>;
      case "flagged":
        return <Badge variant="destructive">Помечена</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Управление контентом</CardTitle>
          <CardDescription>
            Модерация и управление страницами пользователей
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию или автору..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Экспорт данных
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Автор</TableHead>
                  <TableHead>Дата создания</TableHead>
                  <TableHead>Слов</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Жалобы</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {page.title}
                    </TableCell>
                    <TableCell>{page.author}</TableCell>
                    <TableCell>{page.created}</TableCell>
                    <TableCell>{page.words}</TableCell>
                    <TableCell>{getStatusBadge(page.status)}</TableCell>
                    <TableCell>
                      {page.reports > 0 ? (
                        <Badge variant="destructive">{page.reports}</Badge>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Flag className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Статистика контента */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Всего страниц</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,821</div>
            <p className="text-xs text-muted-foreground">+12% за месяц</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Публичные</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,245</div>
            <p className="text-xs text-muted-foreground">7% от общего числа</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Помеченные</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Требуют модерации</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Удаленные</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">За последний месяц</p>
          </CardContent>
        </Card>
      </div>

      {/* Система резервного копирования */}
      <Card>
        <CardHeader>
          <CardTitle>Резервное копирование</CardTitle>
          <CardDescription>
            Управление бэкапами пользовательского контента
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Последний бэкап</p>
                <p className="text-sm text-muted-foreground">15 января 2024, 03:00</p>
              </div>
              <Button>Создать бэкап</Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Автоматическое копирование</p>
                <p className="text-sm text-muted-foreground">Каждые 24 часа</p>
              </div>
              <Button variant="outline">Настроить</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManagement;

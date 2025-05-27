
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText, Eye, Trash2, Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContentManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Моковые данные контента
  const pages = [
    { id: 1, title: "Мои заметки", author: "Иван Петров", created: "2024-01-20", size: 1500, status: "public", reports: 0 },
    { id: 2, title: "Список покупок", author: "Мария Сидорова", created: "2024-01-19", size: 800, status: "private", reports: 0 },
    { id: 3, title: "Рабочие задачи", author: "Алексей Козлов", created: "2024-01-18", size: 2200, status: "public", reports: 1 },
    { id: 4, title: "Идеи для проекта", author: "Елена Романова", created: "2024-01-17", size: 3100, status: "public", reports: 0 },
  ];

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (action: string, pageId: number) => {
    toast({
      title: "Действие выполнено",
      description: `${action} для страницы ID ${pageId}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "public":
        return <Badge variant="default">Публичная</Badge>;
      case "private":
        return <Badge variant="secondary">Приватная</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Управление контентом</CardTitle>
          <CardDescription>
            Просмотр и модерация пользовательского контента
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-96">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию или автору..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Название</TableHead>
                <TableHead>Автор</TableHead>
                <TableHead>Дата создания</TableHead>
                <TableHead>Размер (символы)</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Жалобы</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell>{page.id}</TableCell>
                  <TableCell className="font-medium">{page.title}</TableCell>
                  <TableCell>{page.author}</TableCell>
                  <TableCell>{page.created}</TableCell>
                  <TableCell>{page.size.toLocaleString()}</TableCell>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction("Просмотр", page.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction("Отметить", page.id)}
                      >
                        <Flag className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction("Удалить", page.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManagement;


import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, FileText, Eye, Trash2, Flag, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";

const ContentManagement = () => {
  const { toast } = useToast();
  const { pages, users, addPage, updatePage, deletePage } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [newPage, setNewPage] = useState({
    title: "",
    author: "",
    status: "public" as const,
    size: 0,
    reports: 0,
    created: new Date().toISOString().split('T')[0]
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewContent, setViewContent] = useState<string | null>(null);

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPage = () => {
    if (!newPage.title || !newPage.author) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    addPage({
      ...newPage,
      size: Math.floor(Math.random() * 3000) + 500 // Симулируем размер контента
    });
    
    toast({
      title: "Страница создана",
      description: `Страница "${newPage.title}" успешно создана`,
    });
    
    setNewPage({
      title: "",
      author: "",
      status: "public",
      size: 0,
      reports: 0,
      created: new Date().toISOString().split('T')[0]
    });
    setIsDialogOpen(false);
  };

  const handleToggleStatus = (pageId: number, currentStatus: string) => {
    const newStatus = currentStatus === "public" ? "private" : "public";
    updatePage(pageId, { status: newStatus });
    toast({
      title: "Статус изменен",
      description: `Страница теперь ${newStatus === "public" ? "публичная" : "приватная"}`,
    });
  };

  const handleFlagPage = (pageId: number) => {
    const page = pages.find(p => p.id === pageId);
    if (page) {
      updatePage(pageId, { reports: page.reports + 1 });
      toast({
        title: "Жалоба добавлена",
        description: "Страница отмечена для проверки",
      });
    }
  };

  const handleDeletePage = (pageId: number, pageTitle: string) => {
    deletePage(pageId);
    toast({
      title: "Страница удалена",
      description: `Страница "${pageTitle}" удалена`,
    });
  };

  const handleViewContent = (page: any) => {
    setViewContent(`Название: ${page.title}\nАвтор: ${page.author}\nДата создания: ${page.created}\nРазмер: ${page.size} символов\n\nЭто демонстрационный контент страницы. В реальном приложении здесь будет отображаться полный текст страницы пользователя.`);
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Создать страницу
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Создать новую страницу</DialogTitle>
                  <DialogDescription>
                    Создание новой текстовой страницы
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Название</Label>
                    <Input
                      id="title"
                      value={newPage.title}
                      onChange={(e) => setNewPage({...newPage, title: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="author" className="text-right">Автор</Label>
                    <Select value={newPage.author} onValueChange={(value) => setNewPage({...newPage, author: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Выберите автора" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">Статус</Label>
                    <Select value={newPage.status} onValueChange={(value: any) => setNewPage({...newPage, status: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Публичная</SelectItem>
                        <SelectItem value="private">Приватная</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddPage}>Создать страницу</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                        onClick={() => handleViewContent(page)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFlagPage(page.id)}
                      >
                        <Flag className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(page.id, page.status)}
                      >
                        {page.status === "public" ? "Скрыть" : "Показать"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePage(page.id, page.title)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Модальное окно для просмотра контента */}
          <Dialog open={!!viewContent} onOpenChange={() => setViewContent(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Просмотр содержимого страницы</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Textarea
                  value={viewContent || ""}
                  readOnly
                  rows={10}
                  className="w-full"
                />
              </div>
              <DialogFooter>
                <Button onClick={() => setViewContent(null)}>Закрыть</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManagement;

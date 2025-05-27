
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, UserPlus, Mail, Ban, Shield, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Моковые данные пользователей
  const users = [
    { id: 1, email: "user1@example.com", name: "Иван Петров", status: "active", pages: 15, lastActive: "2024-01-20", premium: true },
    { id: 2, email: "user2@example.com", name: "Мария Сидорова", status: "active", pages: 8, lastActive: "2024-01-19", premium: false },
    { id: 3, email: "user3@example.com", name: "Алексей Козлов", status: "blocked", pages: 3, lastActive: "2024-01-15", premium: false },
    { id: 4, email: "user4@example.com", name: "Елена Романова", status: "inactive", pages: 22, lastActive: "2024-01-10", premium: true },
  ];

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAction = (action: string, userId: number) => {
    toast({
      title: "Действие выполнено",
      description: `${action} для пользователя ID ${userId}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Активен</Badge>;
      case "inactive":
        return <Badge variant="secondary">Неактивен</Badge>;
      case "blocked":
        return <Badge variant="destructive">Заблокирован</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Управление пользователями</CardTitle>
          <CardDescription>
            Просмотр, поиск и управление учетными записями пользователей
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-96">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по email или имени..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Добавить пользователя
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Имя</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Страниц</TableHead>
                <TableHead>Последняя активность</TableHead>
                <TableHead>Premium</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{user.pages}</TableCell>
                  <TableCell>{user.lastActive}</TableCell>
                  <TableCell>
                    {user.premium ? (
                      <Badge variant="default">Premium</Badge>
                    ) : (
                      <Badge variant="outline">Базовый</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction("Просмотр", user.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction("Написать", user.id)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAction("Заблокировать", user.id)}
                      >
                        <Ban className="h-4 w-4" />
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

export default UserManagement;

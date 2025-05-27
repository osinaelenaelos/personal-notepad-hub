
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserPlus, Mail, Ban, Shield, Eye, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";

const UserManagement = () => {
  const { toast } = useToast();
  const { users, addUser, updateUser, deleteUser } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    status: "active" as const,
    premium: false,
    pages: 0,
    lastActive: new Date().toISOString().split('T')[0]
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    addUser(newUser);
    toast({
      title: "Пользователь добавлен",
      description: `Пользователь ${newUser.name} успешно добавлен`,
    });
    
    setNewUser({
      name: "",
      email: "",
      status: "active",
      premium: false,
      pages: 0,
      lastActive: new Date().toISOString().split('T')[0]
    });
    setIsDialogOpen(false);
  };

  const handleToggleStatus = (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    updateUser(userId, { status: newStatus });
    toast({
      title: "Статус изменен",
      description: `Пользователь ${newStatus === "active" ? "разблокирован" : "заблокирован"}`,
    });
  };

  const handleDeleteUser = (userId: number, userName: string) => {
    deleteUser(userId);
    toast({
      title: "Пользователь удален",
      description: `Пользователь ${userName} удален из системы`,
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
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Добавить пользователя
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить нового пользователя</DialogTitle>
                  <DialogDescription>
                    Заполните информацию о новом пользователе
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Имя</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">Статус</Label>
                    <Select value={newUser.status} onValueChange={(value: any) => setNewUser({...newUser, status: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Активен</SelectItem>
                        <SelectItem value="inactive">Неактивен</SelectItem>
                        <SelectItem value="blocked">Заблокирован</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddUser}>Добавить пользователя</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                        onClick={() => handleToggleStatus(user.id, user.status)}
                      >
                        {user.status === "active" ? <Ban className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id, user.name)}
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

export default UserManagement;

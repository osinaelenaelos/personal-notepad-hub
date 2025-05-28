
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Crown, UserCheck, Plus, Edit, Trash2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";

const LimitsAndFeatures = () => {
  const { toast } = useToast();
  const { userLimits, userFeatures, updateUserLimits, updateUserFeatures, addUserFeature, deleteUserFeature } = useAdmin();
  
  const [editingLimits, setEditingLimits] = useState(userLimits);
  const [newFeature, setNewFeature] = useState({
    name: "",
    description: "",
    guest: false,
    registered: false,
    premium: true
  });
  const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false);

  const handleSaveLimits = () => {
    updateUserLimits(editingLimits);
    toast({
      title: "Лимиты обновлены",
      description: "Новые лимиты пользователей сохранены",
    });
  };

  const handleAddFeature = () => {
    if (!newFeature.name) {
      toast({
        title: "Ошибка",
        description: "Укажите название функции",
        variant: "destructive"
      });
      return;
    }

    addUserFeature(newFeature);
    toast({
      title: "Функция добавлена",
      description: `Функция "${newFeature.name}" успешно добавлена`,
    });
    
    setNewFeature({
      name: "",
      description: "",
      guest: false,
      registered: false,
      premium: true
    });
    setIsFeatureDialogOpen(false);
  };

  const handleToggleFeature = (featureId: number, userType: 'guest' | 'registered' | 'premium', currentValue: boolean) => {
    const feature = userFeatures.find(f => f.id === featureId);
    if (feature) {
      const updatedFeature = { ...feature, [userType]: !currentValue };
      updateUserFeatures(featureId, updatedFeature);
      toast({
        title: "Функция обновлена",
        description: `Доступ к функции "${feature.name}" изменен`,
      });
    }
  };

  const handleDeleteFeature = (featureId: number) => {
    const feature = userFeatures.find(f => f.id === featureId);
    if (feature) {
      deleteUserFeature(featureId);
      toast({
        title: "Функция удалена",
        description: `Функция "${feature.name}" удалена`,
      });
    }
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'guest':
        return <Users className="h-4 w-4" />;
      case 'registered':
        return <UserCheck className="h-4 w-4" />;
      case 'premium':
        return <Crown className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getUserTypeBadge = (userType: string) => {
    switch (userType) {
      case 'guest':
        return <Badge variant="secondary">Гость</Badge>;
      case 'registered':
        return <Badge variant="default">Зарегистрирован</Badge>;
      case 'premium':
        return <Badge variant="destructive">Premium</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Лимиты и функции пользователей</CardTitle>
          <CardDescription>
            Управление ограничениями и доступными функциями для разных типов пользователей
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="limits" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="limits" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Лимиты
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Функции
          </TabsTrigger>
        </TabsList>

        <TabsContent value="limits">
          <div className="grid gap-6">
            {/* Гости */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Гости (незарегистрированные)
                </CardTitle>
                <CardDescription>
                  Лимиты для пользователей без регистрации
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guest-pages">Максимум страниц</Label>
                    <Input
                      id="guest-pages"
                      type="number"
                      value={editingLimits.guest.maxPages}
                      onChange={(e) => setEditingLimits({
                        ...editingLimits,
                        guest: { ...editingLimits.guest, maxPages: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guest-storage">Хранилище (MB)</Label>
                    <Input
                      id="guest-storage"
                      type="number"
                      value={editingLimits.guest.storageLimit}
                      onChange={(e) => setEditingLimits({
                        ...editingLimits,
                        guest: { ...editingLimits.guest, storageLimit: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guest-exports">Экспорт в день</Label>
                    <Input
                      id="guest-exports"
                      type="number"
                      value={editingLimits.guest.dailyExports}
                      onChange={(e) => setEditingLimits({
                        ...editingLimits,
                        guest: { ...editingLimits.guest, dailyExports: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Зарегистрированные */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Зарегистрированные пользователи
                </CardTitle>
                <CardDescription>
                  Лимиты для зарегистрированных пользователей
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="registered-pages">Максимум страниц</Label>
                    <Input
                      id="registered-pages"
                      type="number"
                      value={editingLimits.registered.maxPages}
                      onChange={(e) => setEditingLimits({
                        ...editingLimits,
                        registered: { ...editingLimits.registered, maxPages: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registered-storage">Хранилище (MB)</Label>
                    <Input
                      id="registered-storage"
                      type="number"
                      value={editingLimits.registered.storageLimit}
                      onChange={(e) => setEditingLimits({
                        ...editingLimits,
                        registered: { ...editingLimits.registered, storageLimit: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registered-exports">Экспорт в день</Label>
                    <Input
                      id="registered-exports"
                      type="number"
                      value={editingLimits.registered.dailyExports}
                      onChange={(e) => setEditingLimits({
                        ...editingLimits,
                        registered: { ...editingLimits.registered, dailyExports: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Premium пользователи
                </CardTitle>
                <CardDescription>
                  Лимиты для Premium подписчиков
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="premium-pages">Максимум страниц</Label>
                    <Input
                      id="premium-pages"
                      type="number"
                      value={editingLimits.premium.maxPages}
                      onChange={(e) => setEditingLimits({
                        ...editingLimits,
                        premium: { ...editingLimits.premium, maxPages: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="premium-storage">Хранилище (MB)</Label>
                    <Input
                      id="premium-storage"
                      type="number"
                      value={editingLimits.premium.storageLimit}
                      onChange={(e) => setEditingLimits({
                        ...editingLimits,
                        premium: { ...editingLimits.premium, storageLimit: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="premium-exports">Экспорт в день</Label>
                    <Input
                      id="premium-exports"
                      type="number"
                      value={editingLimits.premium.dailyExports}
                      onChange={(e) => setEditingLimits({
                        ...editingLimits,
                        premium: { ...editingLimits.premium, dailyExports: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSaveLimits} className="w-full">
              Сохранить все лимиты
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Управление функциями</CardTitle>
              <CardDescription>
                Определите, какие функции доступны для разных типов пользователей
              </CardDescription>
              <div className="flex justify-end">
                <Dialog open={isFeatureDialogOpen} onOpenChange={setIsFeatureDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Добавить функцию
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Добавить новую функцию</DialogTitle>
                      <DialogDescription>
                        Создайте новую функцию и настройте доступ для разных типов пользователей
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="feature-name">Название функции</Label>
                        <Input
                          id="feature-name"
                          value={newFeature.name}
                          onChange={(e) => setNewFeature({...newFeature, name: e.target.value})}
                          placeholder="Например: Сохранение в облаке"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="feature-description">Описание</Label>
                        <Input
                          id="feature-description"
                          value={newFeature.description}
                          onChange={(e) => setNewFeature({...newFeature, description: e.target.value})}
                          placeholder="Краткое описание функции"
                        />
                      </div>
                      <div className="space-y-4">
                        <Label>Доступ для пользователей</Label>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>Гости</span>
                            </div>
                            <Switch
                              checked={newFeature.guest}
                              onCheckedChange={(checked) => setNewFeature({...newFeature, guest: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <UserCheck className="h-4 w-4" />
                              <span>Зарегистрированные</span>
                            </div>
                            <Switch
                              checked={newFeature.registered}
                              onCheckedChange={(checked) => setNewFeature({...newFeature, registered: checked})}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Crown className="h-4 w-4" />
                              <span>Premium</span>
                            </div>
                            <Switch
                              checked={newFeature.premium}
                              onCheckedChange={(checked) => setNewFeature({...newFeature, premium: checked})}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddFeature}>Добавить функцию</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Функция</TableHead>
                    <TableHead>Описание</TableHead>
                    <TableHead className="text-center">Гости</TableHead>
                    <TableHead className="text-center">Зарегистрированные</TableHead>
                    <TableHead className="text-center">Premium</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userFeatures.map((feature) => (
                    <TableRow key={feature.id}>
                      <TableCell className="font-medium">{feature.name}</TableCell>
                      <TableCell>{feature.description}</TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={feature.guest}
                          onCheckedChange={(checked) => handleToggleFeature(feature.id, 'guest', feature.guest)}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={feature.registered}
                          onCheckedChange={(checked) => handleToggleFeature(feature.id, 'registered', feature.registered)}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={feature.premium}
                          onCheckedChange={(checked) => handleToggleFeature(feature.id, 'premium', feature.premium)}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteFeature(feature.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LimitsAndFeatures;

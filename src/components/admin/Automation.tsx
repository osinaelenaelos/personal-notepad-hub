
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Plus, Play, Pause, Trash2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";

const Automation = () => {
  const { toast } = useToast();
  const { automationRules, addAutomationRule, updateAutomationRule, deleteAutomationRule } = useAdmin();
  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    status: "active" as const,
    triggered: 0,
    lastTrigger: "Никогда"
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateRule = () => {
    if (!newRule.name || !newRule.description) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля",
        variant: "destructive"
      });
      return;
    }

    addAutomationRule(newRule);
    toast({
      title: "Правило создано",
      description: `Правило автоматизации "${newRule.name}" успешно создано`,
    });
    
    setNewRule({
      name: "",
      description: "",
      status: "active",
      triggered: 0,
      lastTrigger: "Никогда"
    });
    setIsDialogOpen(false);
  };

  const handleToggleRule = (ruleId: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    updateAutomationRule(ruleId, { status: newStatus });
    toast({
      title: "Статус изменен",
      description: `Правило ${newStatus === "active" ? "активировано" : "приостановлено"}`,
    });
  };

  const handleDeleteRule = (ruleId: number, ruleName: string) => {
    deleteAutomationRule(ruleId);
    toast({
      title: "Правило удалено",
      description: `Правило "${ruleName}" удалено`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Активно</Badge>;
      case "paused":
        return <Badge variant="secondary">Приостановлено</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Автоматизация</CardTitle>
          <CardDescription>
            Настройка правил автоматизации для управления системой
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активных правил</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {automationRules.filter(rule => rule.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего срабатываний</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {automationRules.reduce((sum, rule) => sum + rule.triggered, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего правил</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automationRules.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Правила автоматизации</CardTitle>
              <CardDescription>Управление автоматическими действиями системы</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Создать правило
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Создать правило автоматизации</DialogTitle>
                  <DialogDescription>
                    Настройте новое правило для автоматического выполнения действий
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="ruleName">Название правила</Label>
                    <Input
                      id="ruleName"
                      value={newRule.name}
                      onChange={(e) => setNewRule({...newRule, name: e.target.value})}
                      placeholder="Введите название правила"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ruleDescription">Описание</Label>
                    <Textarea
                      id="ruleDescription"
                      value={newRule.description}
                      onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                      placeholder="Опишите что делает это правило"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ruleStatus">Статус</Label>
                    <Select value={newRule.status} onValueChange={(value: any) => setNewRule({...newRule, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Активно</SelectItem>
                        <SelectItem value="paused">Приостановлено</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateRule}>Создать правило</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Срабатываний</TableHead>
                <TableHead>Последнее срабатывание</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {automationRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{rule.description}</TableCell>
                  <TableCell>{getStatusBadge(rule.status)}</TableCell>
                  <TableCell>{rule.triggered}</TableCell>
                  <TableCell>{rule.lastTrigger}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleRule(rule.id, rule.status)}
                      >
                        {rule.status === "active" ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRule(rule.id, rule.name)}
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

export default Automation;

import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface User {
  id: number;
  email: string;
  name: string;
  status: 'active' | 'inactive' | 'blocked';
  pages: number;
  lastActive: string;
  premium: boolean;
}

export interface Page {
  id: number;
  title: string;
  author: string;
  created: string;
  size: number;
  status: 'public' | 'private';
  reports: number;
}

export interface AutomationRule {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'paused';
  triggered: number;
  lastTrigger: string;
}

export interface SystemAlert {
  id: number;
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface UserLimits {
  guest: {
    maxPages: number;
    storageLimit: number; // MB
    dailyExports: number;
  };
  registered: {
    maxPages: number;
    storageLimit: number; // MB
    dailyExports: number;
  };
  premium: {
    maxPages: number;
    storageLimit: number; // MB
    dailyExports: number;
  };
}

export interface UserFeature {
  id: number;
  name: string;
  description: string;
  guest: boolean;
  registered: boolean;
  premium: boolean;
}

interface AdminContextType {
  users: User[];
  pages: Page[];
  automationRules: AutomationRule[];
  alerts: SystemAlert[];
  userLimits: UserLimits;
  userFeatures: UserFeature[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: number, updates: Partial<User>) => void;
  deleteUser: (id: number) => void;
  addPage: (page: Omit<Page, 'id'>) => void;
  updatePage: (id: number, updates: Partial<Page>) => void;
  deletePage: (id: number) => void;
  addAutomationRule: (rule: Omit<AutomationRule, 'id'>) => void;
  updateAutomationRule: (id: number, updates: Partial<AutomationRule>) => void;
  deleteAutomationRule: (id: number) => void;
  addAlert: (alert: Omit<SystemAlert, 'id'>) => void;
  resolveAlert: (id: number) => void;
  deleteAlert: (id: number) => void;
  updateUserLimits: (limits: UserLimits) => void;
  updateUserFeatures: (id: number, feature: UserFeature) => void;
  addUserFeature: (feature: Omit<UserFeature, 'id'>) => void;
  deleteUserFeature: (id: number) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const initialUsers: User[] = [
  { id: 1, email: "user1@example.com", name: "Иван Петров", status: "active", pages: 15, lastActive: "2024-01-20", premium: true },
  { id: 2, email: "user2@example.com", name: "Мария Сидорова", status: "active", pages: 8, lastActive: "2024-01-19", premium: false },
  { id: 3, email: "user3@example.com", name: "Алексей Козлов", status: "blocked", pages: 3, lastActive: "2024-01-15", premium: false },
  { id: 4, email: "user4@example.com", name: "Елена Романова", status: "inactive", pages: 22, lastActive: "2024-01-10", premium: true },
];

const initialPages: Page[] = [
  { id: 1, title: "Мои заметки", author: "Иван Петров", created: "2024-01-20", size: 1500, status: "public", reports: 0 },
  { id: 2, title: "Список покупок", author: "Мария Сидорова", created: "2024-01-19", size: 800, status: "private", reports: 0 },
  { id: 3, title: "Рабочие задачи", author: "Алексей Козлов", created: "2024-01-18", size: 2200, status: "public", reports: 1 },
  { id: 4, title: "Идеи для проекта", author: "Елена Романова", created: "2024-01-17", size: 3100, status: "public", reports: 0 },
];

const initialRules: AutomationRule[] = [
  { id: 1, name: "Автоблокировка спама", description: "Блокировать пользователей при создании более 50 страниц в час", status: "active", triggered: 23, lastTrigger: "2024-01-20 13:45" },
  { id: 2, name: "Уведомление о превышении лимитов", description: "Отправлять уведомления при превышении лимитов сервера", status: "active", triggered: 8, lastTrigger: "2024-01-20 12:30" },
  { id: 3, name: "Автоочистка логов", description: "Удалять старые логи старше 30 дней", status: "paused", triggered: 0, lastTrigger: "Никогда" },
];

const initialAlerts: SystemAlert[] = [
  { id: 1, type: "warning", message: "Высокая загрузка процессора (85%)", timestamp: "2024-01-20 14:30", resolved: false },
  { id: 2, type: "info", message: "Завершено резервное копирование", timestamp: "2024-01-20 02:00", resolved: true },
  { id: 3, type: "error", message: "Ошибка подключения к базе данных", timestamp: "2024-01-20 10:15", resolved: false },
  { id: 4, type: "success", message: "Обновление системы успешно установлено", timestamp: "2024-01-19 18:30", resolved: true },
];

const initialUserLimits: UserLimits = {
  guest: {
    maxPages: 5,
    storageLimit: 10, // 10 MB
    dailyExports: 2,
  },
  registered: {
    maxPages: 50,
    storageLimit: 100, // 100 MB
    dailyExports: 10,
  },
  premium: {
    maxPages: 500,
    storageLimit: 1000, // 1 GB
    dailyExports: 100,
  },
};

const initialUserFeatures: UserFeature[] = [
  { id: 1, name: "Создание страниц", description: "Создание и редактирование текстовых страниц", guest: true, registered: true, premium: true },
  { id: 2, name: "Сохранение в облаке", description: "Синхронизация данных в облачном хранилище", guest: false, registered: true, premium: true },
  { id: 3, name: "Экспорт в PDF", description: "Экспорт страниц в формат PDF", guest: false, registered: true, premium: true },
  { id: 4, name: "Расширенный поиск", description: "Поиск по содержимому всех страниц", guest: false, registered: false, premium: true },
  { id: 5, name: "Темы оформления", description: "Кастомизация внешнего вида", guest: false, registered: true, premium: true },
  { id: 6, name: "Совместная работа", description: "Совместное редактирование страниц", guest: false, registered: false, premium: true },
  { id: 7, name: "API доступ", description: "Программный доступ к данным через API", guest: false, registered: false, premium: true },
];

export function AdminProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useLocalStorage<User[]>('admin-users', initialUsers);
  const [pages, setPages] = useLocalStorage<Page[]>('admin-pages', initialPages);
  const [automationRules, setAutomationRules] = useLocalStorage<AutomationRule[]>('admin-rules', initialRules);
  const [alerts, setAlerts] = useLocalStorage<SystemAlert[]>('admin-alerts', initialAlerts);
  const [userLimits, setUserLimits] = useLocalStorage<UserLimits>('admin-user-limits', initialUserLimits);
  const [userFeatures, setUserFeatures] = useLocalStorage<UserFeature[]>('admin-user-features', initialUserFeatures);

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: Date.now() };
    setUsers(prev => [...prev, newUser]);
    
    // Добавить системное уведомление
    addAlert({
      type: 'info',
      message: `Новый пользователь ${user.name} зарегистрирован в системе`,
      timestamp: new Date().toISOString(),
      resolved: false
    });
  };

  const updateUser = (id: number, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => user.id === id ? { ...user, ...updates } : user));
  };

  const deleteUser = (id: number) => {
    const user = users.find(u => u.id === id);
    setUsers(prev => prev.filter(user => user.id !== id));
    
    if (user) {
      addAlert({
        type: 'warning',
        message: `Пользователь ${user.name} удален из системы`,
        timestamp: new Date().toISOString(),
        resolved: false
      });
    }
  };

  const addPage = (page: Omit<Page, 'id'>) => {
    const newPage = { ...page, id: Date.now() };
    setPages(prev => [...prev, newPage]);
  };

  const updatePage = (id: number, updates: Partial<Page>) => {
    setPages(prev => prev.map(page => page.id === id ? { ...page, ...updates } : page));
  };

  const deletePage = (id: number) => {
    setPages(prev => prev.filter(page => page.id !== id));
  };

  const addAutomationRule = (rule: Omit<AutomationRule, 'id'>) => {
    const newRule = { ...rule, id: Date.now() };
    setAutomationRules(prev => [...prev, newRule]);
    
    addAlert({
      type: 'info',
      message: `Создано новое правило автоматизации: ${rule.name}`,
      timestamp: new Date().toISOString(),
      resolved: false
    });
  };

  const updateAutomationRule = (id: number, updates: Partial<AutomationRule>) => {
    setAutomationRules(prev => prev.map(rule => rule.id === id ? { ...rule, ...updates } : rule));
  };

  const deleteAutomationRule = (id: number) => {
    const rule = automationRules.find(r => r.id === id);
    setAutomationRules(prev => prev.filter(rule => rule.id !== id));
    
    if (rule) {
      addAlert({
        type: 'warning',
        message: `Правило автоматизации "${rule.name}" удалено`,
        timestamp: new Date().toISOString(),
        resolved: false
      });
    }
  };

  const addAlert = (alert: Omit<SystemAlert, 'id'>) => {
    const newAlert = { ...alert, id: Date.now() };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const resolveAlert = (id: number) => {
    setAlerts(prev => prev.map(alert => alert.id === id ? { ...alert, resolved: true } : alert));
  };

  const deleteAlert = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const updateUserLimits = (limits: UserLimits) => {
    setUserLimits(limits);
    
    addAlert({
      type: 'info',
      message: 'Лимиты пользователей обновлены',
      timestamp: new Date().toISOString(),
      resolved: false
    });
  };

  const updateUserFeatures = (id: number, feature: UserFeature) => {
    setUserFeatures(prev => prev.map(f => f.id === id ? feature : f));
  };

  const addUserFeature = (feature: Omit<UserFeature, 'id'>) => {
    const newFeature = { ...feature, id: Date.now() };
    setUserFeatures(prev => [...prev, newFeature]);
    
    addAlert({
      type: 'info',
      message: `Добавлена новая функция: ${feature.name}`,
      timestamp: new Date().toISOString(),
      resolved: false
    });
  };

  const deleteUserFeature = (id: number) => {
    const feature = userFeatures.find(f => f.id === id);
    setUserFeatures(prev => prev.filter(f => f.id !== id));
    
    if (feature) {
      addAlert({
        type: 'warning',
        message: `Функция "${feature.name}" удалена`,
        timestamp: new Date().toISOString(),
        resolved: false
      });
    }
  };

  return (
    <AdminContext.Provider value={{
      users,
      pages,
      automationRules,
      alerts,
      userLimits,
      userFeatures,
      addUser,
      updateUser,
      deleteUser,
      addPage,
      updatePage,
      deletePage,
      addAutomationRule,
      updateAutomationRule,
      deleteAutomationRule,
      addAlert,
      resolveAlert,
      deleteAlert,
      updateUserLimits,
      updateUserFeatures,
      addUserFeature,
      deleteUserFeature,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

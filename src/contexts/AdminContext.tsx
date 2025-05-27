
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

interface AdminContextType {
  users: User[];
  pages: Page[];
  automationRules: AutomationRule[];
  alerts: SystemAlert[];
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
];

const initialAlerts: SystemAlert[] = [
  { id: 1, type: "warning", message: "Высокая загрузка процессора (85%)", timestamp: "2024-01-20 14:30", resolved: false },
  { id: 2, type: "info", message: "Завершено резервное копирование", timestamp: "2024-01-20 02:00", resolved: true },
];

export function AdminProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useLocalStorage<User[]>('admin-users', initialUsers);
  const [pages, setPages] = useLocalStorage<Page[]>('admin-pages', initialPages);
  const [automationRules, setAutomationRules] = useLocalStorage<AutomationRule[]>('admin-rules', initialRules);
  const [alerts, setAlerts] = useLocalStorage<SystemAlert[]>('admin-alerts', initialAlerts);

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: Date.now() };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: number, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => user.id === id ? { ...user, ...updates } : user));
  };

  const deleteUser = (id: number) => {
    setUsers(prev => prev.filter(user => user.id !== id));
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
  };

  const updateAutomationRule = (id: number, updates: Partial<AutomationRule>) => {
    setAutomationRules(prev => prev.map(rule => rule.id === id ? { ...rule, ...updates } : rule));
  };

  const deleteAutomationRule = (id: number) => {
    setAutomationRules(prev => prev.filter(rule => rule.id !== id));
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

  return (
    <AdminContext.Provider value={{
      users,
      pages,
      automationRules,
      alerts,
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

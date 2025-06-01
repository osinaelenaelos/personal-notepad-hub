
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { authService } from '@/services/authService';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  role: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoading: boolean; // Добавляем недостающее свойство
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем Supabase авторизацию
    const checkSupabaseAuth = async () => {
      try {
        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        if (supabaseUser) {
          // Получаем данные пользователя из таблицы users
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('id', supabaseUser.id)
            .single();

          if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              role: userData.role,
              status: userData.status
            });
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.log('Supabase auth not available or user not found');
      }

      // Проверяем PHP бэкенд авторизацию
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const result = await authService.verifyToken();
          if (result.success && result.data) {
            setUser({
              id: result.data.user_id.toString(),
              email: result.data.email,
              role: result.data.role,
              status: 'active'
            });
          } else {
            localStorage.removeItem('auth_token');
          }
        }
      } catch (error) {
        console.log('PHP backend auth failed');
        localStorage.removeItem('auth_token');
      }

      setLoading(false);
    };

    checkSupabaseAuth();

    // Слушаем изменения авторизации Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (userData) {
          setUser({
            id: userData.id,
            email: userData.email,
            role: userData.role,
            status: userData.status
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);

      // Пробуем авторизацию через Supabase
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (authData.user && !authError) {
          const { data: userData } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

          if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              role: userData.role,
              status: userData.status
            });
            toast({
              title: "Успех",
              description: "Вы успешно авторизовались через Supabase!",
            });
            return true;
          }
        }
      } catch (supabaseError) {
        console.log('Supabase login failed, trying PHP backend');
      }

      // Если Supabase не сработал, пробуем PHP бэкенд
      const result = await authService.login(email, password);
      
      if (result.success && result.data) {
        localStorage.setItem('auth_token', result.data.token);
        setUser({
          id: result.data.user.id.toString(),
          email: result.data.user.email,
          role: result.data.user.role,
          status: result.data.user.status
        });
        
        toast({
          title: "Успех",
          description: "Вы успешно авторизовались!",
        });
        return true;
      } else {
        toast({
          title: "Ошибка",
          description: result.error || "Неверный email или пароль",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при авторизации",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Выходим из Supabase
      await supabase.auth.signOut();
      
      // Очищаем PHP токен
      localStorage.removeItem('auth_token');
      
      setUser(null);
      
      toast({
        title: "Успех",
        description: "Вы успешно вышли из системы",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    isLoading: loading, // Добавляем алиас для совместимости
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

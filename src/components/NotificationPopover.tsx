
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useApi, useMutation } from '@/hooks/useApi';
import { notificationService } from '@/services/notificationService';

export const NotificationPopover = () => {
  const { data: notifications = [], loading, refetch } = useApi(
    () => notificationService.getNotifications(),
    []
  );

  const { mutate: markAsRead } = useMutation(notificationService.markAsRead.bind(notificationService));

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (id: number) => {
    await markAsRead(id);
    refetch();
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'success': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Уведомления</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary">{unreadCount} новых</Badge>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Загрузка...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Нет уведомлений
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 ${
                  !notification.is_read ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getNotificationTypeColor(notification.type)}`}
                      >
                        {notification.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(notification.created_at).toLocaleString('ru-RU')}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

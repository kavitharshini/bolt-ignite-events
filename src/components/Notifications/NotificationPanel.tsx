import { useState } from "react";
import { Bell, Calendar, Users, DollarSign, CheckCircle, AlertCircle, X, Clock, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  time: string;
  read: boolean;
  icon: typeof Bell;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Payment Received",
    message: "₹15,000 payment received for Tech Conference",
    type: "success",
    time: "2 min ago",
    read: false,
    icon: DollarSign
  },
  {
    id: "2", 
    title: "New Registration",
    message: "5 new attendees registered for Marketing Summit",
    type: "info",
    time: "15 min ago",
    read: false,
    icon: Users
  },
  {
    id: "3",
    title: "Venue Confirmation",
    message: "Please confirm venue booking for Product Launch",
    type: "warning",
    time: "1 hour ago",
    read: true,
    icon: Calendar
  },
  {
    id: "4",
    title: "Payment Failed",
    message: "Failed to process payment for Workshop event",
    type: "error",
    time: "2 hours ago",
    read: true,
    icon: AlertCircle
  },
  {
    id: "5",
    title: "Event Published",
    message: "Annual Conference event has been published successfully",
    type: "success",
    time: "3 hours ago",
    read: true,
    icon: CheckCircle
  }
];

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="w-80 border-0 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-border/50 hover:bg-muted/50 transition-colors ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        notification.type === 'success' ? 'bg-green-100 text-green-600' :
                        notification.type === 'error' ? 'bg-red-100 text-red-600' :
                        notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-medium text-foreground">
                            {notification.title}
                          </p>
                          <div className="flex items-center space-x-1">
                            {!notification.read && (
                              <div className="h-2 w-2 bg-primary rounded-full" />
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{notification.time}</span>
                          </div>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs h-6 px-2"
                            >
                              Mark read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
        <div className="p-3 border-t">
          <Button variant="outline" size="sm" className="w-full text-xs">
            View All Notifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;
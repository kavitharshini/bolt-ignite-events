import { useState } from "react";
import { Bell, Calendar, Users, CheckCircle, AlertCircle, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "event" | "registration" | "payment" | "system";
  time: string;
  read: boolean;
  priority: "low" | "medium" | "high";
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Event Registration",
    message: "John Doe registered for Annual Tech Conference 2024",
    type: "registration",
    time: "2 minutes ago",
    read: false,
    priority: "medium"
  },
  {
    id: "2",
    title: "Payment Received",
    message: "₹2,500 payment confirmed for Product Launch Gala",
    type: "payment",
    time: "15 minutes ago",
    read: false,
    priority: "high"
  },
  {
    id: "3",
    title: "Event Reminder",
    message: "Team Building Workshop starts in 2 hours",
    type: "event",
    time: "1 hour ago",
    read: true,
    priority: "high"
  },
  {
    id: "4",
    title: "System Update",
    message: "New features added to event analytics dashboard",
    type: "system",
    time: "3 hours ago",
    read: true,
    priority: "low"
  },
  {
    id: "5",
    title: "Venue Confirmed",
    message: "Grand Convention Center booking confirmed for March 15",
    type: "event",
    time: "1 day ago",
    read: true,
    priority: "medium"
  }
];

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "event": return <Calendar className="h-4 w-4" />;
      case "registration": return <Users className="h-4 w-4" />;
      case "payment": return <CheckCircle className="h-4 w-4" />;
      case "system": return <Settings className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "event": return "text-secondary";
      case "registration": return "text-primary";
      case "payment": return "text-success";
      case "system": return "text-accent";
      default: return "text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-destructive bg-destructive/5";
      case "medium": return "border-l-accent bg-accent/5";
      case "low": return "border-l-muted bg-muted/5";
      default: return "border-l-muted";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="w-full max-w-md border-0 bg-gradient-to-br from-card to-muted/20">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Mark all read
            </Button>
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4">
          <Button
            variant={filter === "all" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({notifications.length})
          </Button>
          <Button
            variant={filter === "unread" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter("unread")}
          >
            Unread ({unreadCount})
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          {filteredNotifications.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications to show</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                    getPriorityColor(notification.priority)
                  } ${!notification.read ? 'bg-primary/5' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`mt-0.5 ${getTypeColor(notification.type)}`}>
                        {getTypeIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className={`text-sm font-semibold ${
                            !notification.read ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-primary rounded-full" />
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <p className="text-xs text-muted-foreground mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;
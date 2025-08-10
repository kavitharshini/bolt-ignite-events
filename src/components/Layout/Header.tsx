import { useState } from "react";
import { Bell, Calendar, Search, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import emsLogo from "@/assets/ems-logo.png";
import NotificationPanel from "@/components/Notifications/NotificationPanel";

const Header = () => {
  const navigate = useNavigate();
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img src={emsLogo} alt="EMS Logo" className="h-10 w-10 rounded-lg" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Event Management System
            </h1>
          </div>
          
          <div className="relative ml-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search events, venues, guests..." 
              className="pl-10 w-96 bg-muted/50 border-muted focus:bg-background transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => navigate("/events/create")}
            variant="secondary" 
            className="bg-gradient-to-r from-secondary to-secondary-light hover:from-secondary-light hover:to-secondary text-secondary-foreground font-semibold"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
          
          <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full border-2 border-background"></span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
              <NotificationPanel />
            </PopoverContent>
          </Popover>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/login")}
            className="relative"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
import { useState } from "react";
import { Bell, Calendar, Search, User, Plus, Home, ArrowLeft, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import emsLogo from "@/assets/ems-logo.png";
import NotificationPanel from "@/components/Notifications/NotificationPanel";
import SearchCommand from "./SearchCommand";

const Header = ({ showBackButton = false }: { showBackButton?: boolean }) => {
  const navigate = useNavigate();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-2 hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/")}
            className="mr-2 hover:bg-primary/10"
          >
            <Home className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <img src={emsLogo} alt="EMS Logo" className="h-10 w-10 rounded-lg" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Event Management System
            </h1>
          </div>
          
          <div className="relative ml-8">
            <Button
              variant="outline"
              className="relative w-96 justify-start text-muted-foreground"
              onClick={() => setCommandOpen(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Search events, venues, guests...</span>
              <div className="ml-auto flex items-center space-x-1">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </Button>
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
      
      <SearchCommand open={commandOpen} setOpen={setCommandOpen} />
    </header>
  );
};

export default Header;
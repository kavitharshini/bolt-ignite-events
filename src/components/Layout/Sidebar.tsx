import { Home, Calendar, CalendarDays, Users, BarChart3, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: Calendar, label: "Events", path: "/events" },
    { icon: CalendarDays, label: "Calendar", path: "/calendar" },
    { icon: Users, label: "Attendees", path: "/attendees" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="bg-card border-r border-border w-64 flex flex-col">
      <div className="p-6 border-b border-border">
        <Button 
          onClick={() => navigate("/events/create")}
          className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>
      
      <nav className="p-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "text-primary bg-primary/10 border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border mt-auto">
        <div className="bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg p-4 border border-secondary/20">
          <h3 className="text-sm font-semibold text-foreground mb-1">Upgrade to Pro</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Unlock advanced features and unlimited events
          </p>
          <button className="w-full bg-gradient-to-r from-secondary to-secondary-light text-secondary-foreground text-xs font-semibold py-2 px-3 rounded-md hover:shadow-lg transition-all duration-200">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
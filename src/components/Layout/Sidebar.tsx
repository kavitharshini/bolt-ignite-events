import { 
  Calendar, 
  CalendarDays, 
  Users, 
  MapPin, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Home,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home, current: true },
  { name: "Events", href: "/events", icon: Calendar, current: false },
  { name: "Calendar", href: "/calendar", icon: CalendarDays, current: false },
  { name: "Guests", href: "/guests", icon: Users, current: false },
  { name: "Venues", href: "/venues", icon: MapPin, current: false },
  { name: "Payments", href: "/payments", icon: CreditCard, current: false },
  { name: "Reports", href: "/reports", icon: BarChart3, current: false },
  { name: "Templates", href: "/templates", icon: FileText, current: false },
  { name: "Settings", href: "/settings", icon: Settings, current: false },
];

const Sidebar = () => {
  return (
    <aside className="bg-card border-r border-border w-64 flex flex-col">
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group",
                item.current
                  ? "bg-gradient-to-r from-secondary/10 to-secondary/5 text-secondary border-l-4 border-secondary shadow-lg"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-md"
              )}
            >
              <Icon className={cn(
                "mr-3 h-5 w-5 transition-colors",
                item.current ? "text-secondary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              {item.name}
            </a>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-border">
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
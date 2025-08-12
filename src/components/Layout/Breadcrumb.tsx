import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

const Breadcrumb = () => {
  const location = useLocation();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Dashboard", href: "/" }
    ];
    
    // Map path segments to readable labels
    const pathLabels: Record<string, string> = {
      events: "Events",
      create: "Create Event",
      edit: "Edit Event",
      calendar: "Indian Calendar",
      analytics: "Analytics",
      attendees: "Attendees",
      profile: "Profile",
      settings: "Settings",
      login: "Login"
    };
    
    let currentPath = "";
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      breadcrumbs.push({
        label,
        href: currentPath,
        isActive: index === pathSegments.length - 1
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbs = getBreadcrumbs();
  
  if (location.pathname === "/" || location.pathname === "/login") {
    return null;
  }
  
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
      <Home className="h-4 w-4" />
      {breadcrumbs.map((item, index) => (
        <div key={item.href} className="flex items-center space-x-2">
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          {item.isActive ? (
            <span className="text-foreground font-medium">{item.label}</span>
          ) : (
            <Link 
              to={item.href} 
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
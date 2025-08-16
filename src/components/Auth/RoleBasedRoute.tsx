import { ReactNode } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, AlertTriangle } from 'lucide-react';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles?: ('admin' | 'user')[];
  adminOnly?: boolean;
  userOnly?: boolean;
}

const RoleBasedRoute = ({ 
  children, 
  allowedRoles,
  adminOnly = false,
  userOnly = false 
}: RoleBasedRouteProps) => {
  const { user, isLoggedIn } = useUser();

  // Redirect to login if not authenticated
  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  // Determine access
  let hasAccess = true;

  if (adminOnly && !user.isAdmin) {
    hasAccess = false;
  }

  if (userOnly && user.isAdmin) {
    hasAccess = false;
  }

  if (allowedRoles) {
    const userRole = user.isAdmin ? 'admin' : 'user';
    hasAccess = allowedRoles.includes(userRole);
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
              <Lock className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-xl">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <p>You don't have permission to access this page.</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {user.isAdmin ? 
                "This section is for regular users only." :
                "This section requires administrator privileges."
              }
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
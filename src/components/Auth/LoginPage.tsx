import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import emsLogo from "@/assets/ems-logo.png";

const LoginPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'user' | 'admin'>('user');
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userType}!`,
      });
      
      // Store user type in localStorage for demo
      localStorage.setItem('userRole', userType);
      localStorage.setItem('isAuthenticated', 'true');
      
      navigate("/");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Title */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <img src={emsLogo} alt="EMS Logo" className="h-12 w-12 rounded-lg" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Event Management System
            </h1>
          </div>
          <p className="text-muted-foreground">
            Sign in to manage your events
          </p>
        </div>

        {/* User Type Selection */}
        <div className="flex space-x-2 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setUserType('user')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              userType === 'user'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="h-4 w-4 inline mr-2" />
            User Login
          </button>
          <button
            onClick={() => setUserType('admin')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              userType === 'admin'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Lock className="h-4 w-4 inline mr-2" />
            Admin Login
          </button>
        </div>

        {/* Login Form */}
        <Card className="border-0 bg-gradient-to-br from-card to-muted/30">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Sign In
              <Badge variant="secondary" className="ml-2 capitalize">
                {userType}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>

            <div className="text-center space-y-2">
              <button className="text-sm text-secondary hover:text-secondary-light transition-colors">
                Forgot your password?
              </button>
              <p className="text-xs text-muted-foreground">
                Don't have an account?{" "}
                <button className="text-secondary hover:text-secondary-light transition-colors">
                  Contact administrator
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold text-accent mb-2">Demo Credentials</h3>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><strong>User:</strong> user@demo.com / password123</p>
              <p><strong>Admin:</strong> admin@demo.com / admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Home, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import emsLogo from "@/assets/ems-logo.png";
import { z } from "zod";

// Validation schemas
const emailSchema = z.string().trim().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const nameSchema = z.string().trim().min(2, "Name must be at least 2 characters").optional();

type AuthMode = 'login' | 'signup' | 'forgot' | 'reset';

const AuthPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, resetPassword, user, isLoading: authLoading } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>(() => {
    const urlMode = searchParams.get('mode');
    if (urlMode === 'signup') return 'signup';
    if (urlMode === 'forgot') return 'forgot';
    if (urlMode === 'reset') return 'reset';
    return 'login';
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate("/", { replace: true });
    }
  }, [user, authLoading, navigate]);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string; name?: string } = {};
    
    try {
      emailSchema.parse(formData.email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0]?.message;
      }
    }

    if (mode === 'login' || mode === 'signup') {
      try {
        passwordSchema.parse(formData.password);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.password = e.errors[0]?.message;
        }
      }
    }

    if (mode === 'signup' && formData.name) {
      try {
        nameSchema.parse(formData.name);
      } catch (e) {
        if (e instanceof z.ZodError) {
          newErrors.name = e.errors[0]?.message;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message === "Invalid login credentials" 
              ? "Invalid email or password. Please try again."
              : error.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Welcome Back!",
          description: "You have successfully logged in.",
        });
        navigate("/");
        
      } else if (mode === 'signup') {
        const { error } = await signUp(formData.email, formData.password, formData.name);
        
        if (error) {
          let errorMessage = error.message;
          if (error.message.includes("already registered")) {
            errorMessage = "This email is already registered. Please login instead.";
          }
          toast({
            title: "Sign Up Failed",
            description: errorMessage,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Account Created!",
          description: "Please check your email to confirm your account, then login.",
        });
        setMode('login');
        
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(formData.email);
        
        if (error) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Password Reset Email Sent",
          description: "Check your email for a password reset link.",
        });
        setMode('login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      {/* Home Button */}
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 hover:bg-primary/10"
      >
        <Home className="h-5 w-5" />
      </Button>
      
      <div className="w-full max-w-md space-y-6">
        {/* Logo & Title */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <img src={emsLogo} alt="EMS Logo" className="h-12 w-12 rounded-lg" />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Event Management System
            </h1>
          </div>
          <p className="text-muted-foreground">
            {mode === 'login' && "Sign in to manage your events"}
            {mode === 'signup' && "Create an account to get started"}
            {mode === 'forgot' && "Reset your password"}
          </p>
        </div>

        {/* Auth Form */}
        <Card className="border-0 bg-gradient-to-br from-card to-muted/30 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">
              {mode === 'login' && "Welcome Back"}
              {mode === 'signup' && "Create Account"}
              {mode === 'forgot' && "Forgot Password"}
            </CardTitle>
            <CardDescription className="text-center">
              {mode === 'login' && "Enter your credentials to continue"}
              {mode === 'signup' && "Fill in your details to register"}
              {mode === 'forgot' && "Enter your email to receive a reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name field (signup only) */}
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    onKeyPress={handleKeyPress}
                    className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>
            )}

            {/* Email field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  onKeyPress={handleKeyPress}
                  className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            {/* Password field (login/signup only) */}
            {(mode === 'login' || mode === 'signup') && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    onKeyPress={handleKeyPress}
                    className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>
            )}

            {/* Submit Button */}
            <Button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  <span>
                    {mode === 'login' && "Signing In..."}
                    {mode === 'signup' && "Creating Account..."}
                    {mode === 'forgot' && "Sending..."}
                  </span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {mode === 'forgot' ? (
                    <KeyRound className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  <span>
                    {mode === 'login' && "Sign In"}
                    {mode === 'signup' && "Create Account"}
                    {mode === 'forgot' && "Send Reset Link"}
                  </span>
                </div>
              )}
            </Button>

            {/* Mode switching links */}
            <div className="text-center space-y-2 pt-2">
              {mode === 'login' && (
                <>
                  <button 
                    onClick={() => setMode('forgot')}
                    className="text-sm text-secondary hover:text-secondary/80 transition-colors block w-full"
                  >
                    Forgot your password?
                  </button>
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <button 
                      onClick={() => setMode('signup')}
                      className="text-secondary hover:text-secondary/80 transition-colors font-medium"
                    >
                      Sign Up
                    </button>
                  </p>
                </>
              )}
              
              {mode === 'signup' && (
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button 
                    onClick={() => setMode('login')}
                    className="text-secondary hover:text-secondary/80 transition-colors font-medium"
                  >
                    Sign In
                  </button>
                </p>
              )}
              
              {mode === 'forgot' && (
                <button 
                  onClick={() => setMode('login')}
                  className="text-sm text-secondary hover:text-secondary/80 transition-colors"
                >
                  Back to Sign In
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold text-accent mb-2">ℹ️ Getting Started</h3>
            <p className="text-xs text-muted-foreground">
              Create an account to start managing events. After signing up, check your email to confirm your account.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;

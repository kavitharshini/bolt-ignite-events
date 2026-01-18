import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Home, Sparkles, Code, Terminal, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import emsLogo from "@/assets/ems-logo.png";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const AuthPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, signUp, isAuthenticated, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: ""
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    try {
      emailSchema.parse(formData.email);
    } catch (e: any) {
      newErrors.email = e.errors[0].message;
    }

    try {
      passwordSchema.parse(formData.password);
    } catch (e: any) {
      newErrors.password = e.errors[0].message;
    }

    if (isSignUp && !formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await signUp(formData.email, formData.password, formData.fullName);
        
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account Already Exists",
              description: "This email is already registered. Please sign in instead.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Sign Up Failed",
              description: error.message,
              variant: "destructive"
            });
          }
          setIsLoading(false);
          return;
        }

        toast({
          title: "🎉 Account Created!",
          description: "Please check your email to verify your account.",
        });
        
        setIsSignUp(false);
      } else {
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          if (error.message.includes("Invalid login")) {
            toast({
              title: "Invalid Credentials",
              description: "The email or password you entered is incorrect.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Sign In Failed",
              description: error.message,
              variant: "destructive"
            });
          }
          setIsLoading(false);
          return;
        }

        toast({
          title: "Welcome Back!",
          description: "You have successfully signed in.",
        });
        
        navigate("/");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const techCategories = [
    { icon: Code, label: "Python", color: "from-blue-500 to-cyan-500" },
    { icon: Terminal, label: "Java", color: "from-orange-500 to-red-500" },
    { icon: Laptop, label: "HTML/CSS", color: "from-purple-500 to-pink-500" },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl" />
      </div>

      {/* Home Button */}
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 hover:bg-primary/10 z-10"
      >
        <Home className="h-5 w-5" />
      </Button>
      
      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Logo & Title */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <img src={emsLogo} alt="EMS Logo" className="h-14 w-14 rounded-xl shadow-lg" />
            <div className="text-left">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Event Management
              </h1>
              <p className="text-xs text-muted-foreground">Tech Events & Workshops</p>
            </div>
          </div>
          
          {/* Tech Categories Preview */}
          <div className="flex justify-center gap-2 mt-4">
            {techCategories.map((tech, index) => (
              <div 
                key={index}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${tech.color} text-white text-xs font-medium shadow-md`}
              >
                <tech.icon className="h-3.5 w-3.5" />
                {tech.label}
              </div>
            ))}
          </div>
        </div>

        {/* Auth Form */}
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-card to-muted/30 backdrop-blur-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
          <CardHeader className="space-y-2 pb-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <CardTitle className="text-2xl text-center">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </CardTitle>
            </div>
            <CardDescription className="text-center">
              {isSignUp 
                ? "Join our tech community and start creating events" 
                : "Sign in to manage your tech events"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, fullName: e.target.value }));
                      if (errors.fullName) setErrors(prev => ({ ...prev, fullName: "" }));
                    }}
                    className={`pl-10 h-12 ${errors.fullName ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.fullName && <p className="text-destructive text-xs">{errors.fullName}</p>}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, email: e.target.value }));
                    if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                  }}
                  className={`pl-10 h-12 ${errors.email ? "border-destructive" : ""}`}
                />
              </div>
              {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, password: e.target.value }));
                    if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
                  }}
                  className={`pl-10 pr-10 h-12 ${errors.password ? "border-destructive" : ""}`}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-lg font-semibold shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isSignUp ? "Creating Account..." : "Signing In..."}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </Button>

            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button 
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrors({});
                  }}
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {isSignUp ? "Sign In" : "Create one"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                <Sparkles className="h-3 w-3 mr-1" />
                Features
              </Badge>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Create Python, Java & HTML workshops
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                Manage payments & registrations
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                Track attendees in real-time
              </li>
            </ul>
          </CardContent>
        </Card>

        <p className="text-xs text-center text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default AuthPage;

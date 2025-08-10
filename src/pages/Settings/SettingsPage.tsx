import { useState } from "react";
import { Settings, User, Bell, Shield, CreditCard, Globe, Moon, Sun, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";

const SettingsPage = () => {
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@eventms.com",
    phone: "+91 98765 43210",
    organization: "Event Management Pro"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    eventReminders: true,
    marketingEmails: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90"
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleSaveSecurity = () => {
    toast({
      title: "Security Settings Updated",
      description: "Your security preferences have been saved.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage your account and application preferences</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {/* Profile Settings */}
              <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-primary" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="organization">Organization</Label>
                      <Input
                        id="organization"
                        value={profileData.organization}
                        onChange={(e) => setProfileData({...profileData, organization: e.target.value})}
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-primary to-primary-light">
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-secondary" />
                    <span>Notification Preferences</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, emailNotifications: checked})
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                      </div>
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, pushNotifications: checked})
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive text message alerts</p>
                      </div>
                      <Switch
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, smsNotifications: checked})
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Event Reminders</Label>
                        <p className="text-sm text-muted-foreground">Get reminded about upcoming events</p>
                      </div>
                      <Switch
                        checked={notificationSettings.eventReminders}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, eventReminders: checked})
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">Receive promotional content</p>
                      </div>
                      <Switch
                        checked={notificationSettings.marketingEmails}
                        onCheckedChange={(checked) => 
                          setNotificationSettings({...notificationSettings, marketingEmails: checked})
                        }
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveNotifications} className="bg-gradient-to-r from-secondary to-secondary-light">
                    <Save className="h-4 w-4 mr-2" />
                    Save Notifications
                  </Button>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-accent" />
                    <span>Security & Privacy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Switch
                        checked={securitySettings.twoFactorAuth}
                        onCheckedChange={(checked) => 
                          setSecuritySettings({...securitySettings, twoFactorAuth: checked})
                        }
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                        <Input
                          id="sessionTimeout"
                          type="number"
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                        <Input
                          id="passwordExpiry"
                          type="number"
                          value={securitySettings.passwordExpiry}
                          onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleSaveSecurity} className="bg-gradient-to-r from-accent to-accent-light text-accent-foreground">
                    <Save className="h-4 w-4 mr-2" />
                    Save Security Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Appearance Settings */}
              <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <span>Appearance & Language</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">Switch to dark theme</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Sun className="h-4 w-4" />
                        <Switch
                          checked={isDarkMode}
                          onCheckedChange={setIsDarkMode}
                        />
                        <Moon className="h-4 w-4" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <select
                        id="language"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-2"
                      >
                        <option value="en">English</option>
                        <option value="hi">हिंदी (Hindi)</option>
                        <option value="mr">मराठी (Marathi)</option>
                        <option value="ta">தமிழ் (Tamil)</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <select
                        id="timezone"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-2"
                      >
                        <option value="Asia/Kolkata">India Standard Time (IST)</option>
                        <option value="Asia/Dubai">UAE Time</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
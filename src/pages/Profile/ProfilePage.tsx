import React, { useState, useEffect } from "react";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Mail, Phone, User, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

const ProfilePage = () => {
  const { toast } = useToast();
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    location: user?.location || "",
    company: user?.company || "",
    role: user?.role || "",
    joinDate: user?.joinDate || "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        bio: user.bio,
        location: user.location,
        company: user.company,
        role: user.role,
        joinDate: user.joinDate,
      });
    }
  }, [user]);

  const [eventsCreated] = useState([
    {
      id: "1",
      title: "Tech Conference 2024",
      date: new Date("2024-03-15").toLocaleDateString(),
      attendees: 250,
      revenue: "₹12,50,000",
    },
    {
      id: "2", 
      title: "Music Festival",
      date: new Date("2024-04-20").toLocaleDateString(),
      attendees: 1500,
      revenue: "₹1,27,50,000",
    },
    {
      id: "3",
      title: "Business Summit", 
      date: new Date("2024-05-10").toLocaleDateString(),
      attendees: 180,
      revenue: "₹6,30,000",
    },
  ]);

  const handleSave = () => {
    // Update the user context with new data
    updateUser({
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      bio: profileData.bio,
      location: profileData.location,
      company: profileData.company,
      role: profileData.role,
    });
    
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
  };

  const handleImageUpload = () => {
    toast({
      title: "Coming Soon",
      description: "Profile image upload feature will be available soon.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton={true} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Profile</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences</p>
              </div>
              <Button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                variant={isEditing ? "default" : "outline"}
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>

            {/* Profile Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your personal and professional details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar and Basic Info */}
                <div className="flex items-start space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="text-lg font-semibold">
                        {profileData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                      onClick={handleImageUpload}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>

                {/* Professional Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profileData.company}
                      onChange={(e) => setProfileData({...profileData, company: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={profileData.role}
                      onChange={(e) => setProfileData({...profileData, role: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center space-x-6 pt-4 border-t">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Joined {profileData.joinDate}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{eventsCreated.length} Events Created</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Events Created */}
            <Card>
              <CardHeader>
                <CardTitle>Events Created</CardTitle>
                <CardDescription>Events you have organized</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {eventsCreated.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{event.title}</h3>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                          <span>{event.date}</span>
                          <span>•</span>
                          <span>{event.attendees} attendees</span>
                          <span>•</span>
                          <span className="text-success font-medium">{event.revenue}</span>
                        </div>
                      </div>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">Receive updates about your events</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Privacy Settings</h4>
                    <p className="text-sm text-muted-foreground">Control your profile visibility</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Account Security</h4>
                    <p className="text-sm text-muted-foreground">Change password and security settings</p>
                  </div>
                  <Button variant="outline" size="sm">Security</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
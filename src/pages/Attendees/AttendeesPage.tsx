import { useState } from "react";
import { Users, Search, Filter, Mail, Phone, Download, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";

interface Attendee {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventName: string;
  status: "confirmed" | "pending" | "cancelled";
  registeredDate: string;
  avatar?: string;
}

const AttendeesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock attendees data
  const attendees: Attendee[] = [
    {
      id: "1",
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      phone: "+91 98765 43210",
      eventName: "Tech Conference 2024",
      status: "confirmed",
      registeredDate: "2024-03-15"
    },
    {
      id: "2",
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 87654 32109",
      eventName: "Digital Marketing Workshop",
      status: "pending",
      registeredDate: "2024-03-14"
    },
    {
      id: "3",
      name: "Amit Patel",
      email: "amit@example.com",
      phone: "+91 76543 21098",
      eventName: "Product Launch Event",
      status: "confirmed",
      registeredDate: "2024-03-13"
    },
    {
      id: "4",
      name: "Sneha Reddy",
      email: "sneha@example.com",
      phone: "+91 65432 10987",
      eventName: "Leadership Summit",
      status: "cancelled",
      registeredDate: "2024-03-12"
    }
  ];

  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearch = 
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || attendee.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const stats = {
    total: attendees.length,
    confirmed: attendees.filter(a => a.status === "confirmed").length,
    pending: attendees.filter(a => a.status === "pending").length,
    cancelled: attendees.filter(a => a.status === "cancelled").length
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Attendees Management</h1>
                <p className="text-muted-foreground">Manage and track event attendees</p>
              </div>
              <Button className="bg-gradient-to-r from-primary to-primary-light">
                <Download className="h-4 w-4 mr-2" />
                Export List
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Attendees</p>
                      <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Confirmed</p>
                      <p className="text-3xl font-bold text-green-800">{stats.confirmed}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-green-200 flex items-center justify-center">
                      <span className="text-green-800 font-bold">✓</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-gradient-to-br from-yellow-50 to-yellow-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Pending</p>
                      <p className="text-3xl font-bold text-yellow-800">{stats.pending}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-yellow-200 flex items-center justify-center">
                      <span className="text-yellow-800 font-bold">⏳</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-gradient-to-br from-red-50 to-red-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Cancelled</p>
                      <p className="text-3xl font-bold text-red-800">{stats.cancelled}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-red-200 flex items-center justify-center">
                      <span className="text-red-800 font-bold">✗</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card className="border-0 bg-gradient-to-br from-card to-muted/20 mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, or event..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="all">All Status</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attendees List */}
            <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Attendees List ({filteredAttendees.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredAttendees.map((attendee) => (
                    <div key={attendee.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={attendee.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {attendee.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <h3 className="font-semibold text-foreground">{attendee.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {attendee.email}
                            </span>
                            <span className="flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {attendee.phone}
                            </span>
                          </div>
                          <p className="text-sm text-secondary font-medium">{attendee.eventName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge className={`${getStatusColor(attendee.status)} capitalize`}>
                          {attendee.status}
                        </Badge>
                        
                        <div className="text-sm text-muted-foreground">
                          {new Date(attendee.registeredDate).toLocaleDateString()}
                        </div>
                        
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AttendeesPage;
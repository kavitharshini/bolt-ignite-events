import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Calendar, MapPin, Users, Clock, IndianRupee, 
  Edit, Share2, Download, MoreVertical, CheckCircle, 
  XCircle, User, Mail, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import EventScheduleManager from "@/components/Events/EventScheduleManager";
import { useEvents } from "@/hooks/useEvents";
import { format } from "date-fns";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const { getEventById } = useEvents();

  // Get real event data or use fallback mock
  const storedEvent = id ? getEventById(id) : null;
  
  const event = useMemo(() => {
    if (storedEvent) {
      return {
        id: storedEvent.id,
        title: storedEvent.title,
        description: storedEvent.description || "No description provided.",
        date: format(new Date(storedEvent.date), "MMMM d, yyyy"),
        rawDate: storedEvent.date,
        time: `${storedEvent.time} - ${storedEvent.endTime}`,
        startTime: storedEvent.time,
        endTime: storedEvent.endTime,
        venue: storedEvent.venue,
        address: storedEvent.address || "",
        attendees: storedEvent.attendees,
        maxAttendees: parseInt(storedEvent.maxAttendees) || 100,
        ticketPrice: parseFloat(storedEvent.ticketPrice) || 0,
        status: storedEvent.status,
        category: storedEvent.category || "other",
        organizer: {
          name: "Event Organizer",
          email: "organizer@example.com",
          phone: "+91 98765 43210"
        },
        recentAttendees: [
          { name: "John Doe", email: "john@example.com", registeredAt: "2024-03-01" },
          { name: "Jane Smith", email: "jane@example.com", registeredAt: "2024-03-02" },
        ]
      };
    }
    
    // Fallback mock data
    return {
      id: "1",
      title: "Annual Tech Conference 2024",
      description: "Join us for the biggest tech conference of the year!",
      date: "March 15, 2024",
      rawDate: "2024-03-15",
      time: "9:00 AM - 6:00 PM",
      startTime: "9:00 AM",
      endTime: "6:00 PM",
      venue: "Grand Convention Center",
      address: "123 Tech Street, Silicon Valley",
      attendees: 245,
      maxAttendees: 300,
      ticketPrice: 99.99,
      status: "published" as const,
      category: "conference",
      organizer: {
        name: "Sarah Johnson",
        email: "sarah@techconf.com",
        phone: "+1 (555) 123-4567"
      },
      recentAttendees: [
        { name: "John Doe", email: "john@example.com", registeredAt: "2024-03-01" },
        { name: "Jane Smith", email: "jane@example.com", registeredAt: "2024-03-02" },
        { name: "Mike Wilson", email: "mike@example.com", registeredAt: "2024-03-03" },
        { name: "Lisa Chen", email: "lisa@example.com", registeredAt: "2024-03-04" },
      ]
    };
  }, [storedEvent]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-success text-success-foreground";
      case "draft": return "bg-accent text-accent-foreground";
      case "completed": return "bg-primary text-primary-foreground";
      case "cancelled": return "bg-destructive text-destructive-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleAction = (action: string) => {
    toast({
      title: `${action} Action`,
      description: `${action} functionality would be implemented here.`,
    });
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "schedule", label: "Schedule" },
    { id: "attendees", label: "Attendees" },
    { id: "analytics", label: "Analytics" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton={true} />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate(-1)}
                  className="hover:bg-muted"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-foreground">{event.title}</h1>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">Event Details & Management</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleAction("Share")}
                  variant="outline"
                  size="icon"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                
                <Button 
                  onClick={() => handleAction("Download")}
                  variant="outline"
                  size="icon"
                >
                  <Download className="h-4 w-4" />
                </Button>
                
                <Button 
                  onClick={() => navigate(`/events/${id}/edit`)}
                  className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-8 bg-muted p-1 rounded-lg w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Event Image */}
                  <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
                    <CardContent className="p-0">
                      <div className="h-64 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-lg flex items-center justify-center">
                        <Calendar className="h-20 w-20 text-secondary/60" />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Description */}
                  <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
                    <CardHeader>
                      <CardTitle>About This Event</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                    </CardContent>
                  </Card>

                  {/* Organizer Info */}
                  <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
                    <CardHeader>
                      <CardTitle>Organizer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-secondary" />
                        <span>{event.organizer.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-secondary" />
                        <span>{event.organizer.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-secondary" />
                        <span>{event.organizer.phone}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Event Details */}
                  <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
                    <CardHeader>
                      <CardTitle>Event Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-secondary" />
                        <div>
                          <div className="font-medium">{event.date}</div>
                          <div className="text-sm text-muted-foreground">{event.time}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-secondary mt-0.5" />
                        <div>
                          <div className="font-medium">{event.venue}</div>
                          <div className="text-sm text-muted-foreground">{event.address}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-secondary" />
                        <div>
                          <div className="font-medium">{event.attendees}/{event.maxAttendees} Registered</div>
                          <div className="text-sm text-muted-foreground">
                            {Math.round((event.attendees / event.maxAttendees) * 100)}% Capacity
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <IndianRupee className="h-5 w-5 text-accent" />
                        <div>
                          <div className="font-medium">₹{event.ticketPrice.toLocaleString('en-IN')}</div>
                          <div className="text-sm text-muted-foreground">Per ticket</div>
                        </div>
                      </div>

                      {/* Capacity Bar */}
                      <div className="pt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Registration Progress</span>
                          <span>{event.attendees}/{event.maxAttendees}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-secondary to-secondary-light h-3 rounded-full transition-all duration-300"
                            style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => handleAction("View Attendees")}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        View All Attendees
                      </Button>
                      
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => handleAction("Send Update")}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Send Update
                      </Button>
                      
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => handleAction("Clone Event")}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Clone Event
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "attendees" && (
              <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
                <CardHeader>
                  <CardTitle>Recent Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {event.recentAttendees.map((attendee, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-secondary" />
                          </div>
                          <div>
                            <div className="font-medium">{attendee.name}</div>
                            <div className="text-sm text-muted-foreground">{attendee.email}</div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Registered {attendee.registeredAt}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "schedule" && (
              <EventScheduleManager
                category={event.category}
                eventStartTime={event.startTime}
                eventEndTime={event.endTime}
                eventDate={event.date}
                readOnly={false}
              />
            )}

            {activeTab === "analytics" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span className="font-medium">Registration Rate</span>
                    </div>
                    <div className="text-3xl font-bold">{Math.round((event.attendees / event.maxAttendees) * 100)}%</div>
                    <div className="text-sm text-muted-foreground">of capacity filled</div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <IndianRupee className="h-5 w-5 text-accent" />
                      <span className="font-medium">Revenue</span>
                    </div>
                    <div className="text-3xl font-bold">₹{(event.attendees * event.ticketPrice).toLocaleString('en-IN')}</div>
                    <div className="text-sm text-muted-foreground">total collected</div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Users className="h-5 w-5 text-secondary" />
                      <span className="font-medium">Attendees</span>
                    </div>
                    <div className="text-3xl font-bold">{event.attendees}</div>
                    <div className="text-sm text-muted-foreground">registered</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EventDetails;
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Grid, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import Breadcrumb from "@/components/Layout/Breadcrumb";

// Mock events data
const mockEvents = [
  {
    id: "1",
    title: "Tech Conference 2024",
    date: "2024-03-15",
    time: "9:00 AM",
    status: "published",
    attendees: 245,
    color: "from-primary to-primary-light"
  },
  {
    id: "2",
    title: "Product Launch",
    date: "2024-03-22",
    time: "7:00 PM",
    status: "draft",
    attendees: 89,
    color: "from-secondary to-secondary-light"
  },
  {
    id: "3",
    title: "Team Workshop",
    date: "2024-04-05",
    time: "10:00 AM",
    status: "published",
    attendees: 42,
    color: "from-accent to-accent-light"
  },
  {
    id: "4",
    title: "Marketing Summit",
    date: "2024-04-12",
    time: "8:00 AM",
    status: "published",
    attendees: 156,
    color: "from-primary to-primary-light"
  }
];

const CalendarView = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (date: Date, day: number | null) => {
    if (!day) return [];
    
    const eventDate = new Date(date.getFullYear(), date.getMonth(), day);
    const dateString = eventDate.toISOString().split('T')[0];
    
    return mockEvents.filter(event => event.date === dateString);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton={true} />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Calendar</h1>
                <p className="text-muted-foreground">View and manage your events calendar</p>
              </div>
              
              <Button 
                onClick={() => navigate("/events/create")}
                className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary mt-4 md:mt-0"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Event
              </Button>
            </div>

            {/* Calendar Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateMonth("prev")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <h2 className="text-xl font-semibold min-w-[200px] text-center">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateMonth("next")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  onClick={goToToday}
                >
                  Today
                </Button>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant={viewMode === "month" ? "default" : "outline"}
                  onClick={() => setViewMode("month")}
                  size="sm"
                >
                  <Grid className="h-4 w-4 mr-2" />
                  Month
                </Button>
                
                <Button
                  variant={viewMode === "week" ? "default" : "outline"}
                  onClick={() => setViewMode("week")}
                  size="sm"
                >
                  <List className="h-4 w-4 mr-2" />
                  Week
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
              <CardContent className="p-6">
                {/* Days of week header */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    const dayEvents = getEventsForDate(currentDate, day);
                    const today = isToday(day);
                    
                    return (
                      <div
                        key={index}
                        className={`min-h-[120px] p-2 border border-border/50 rounded-lg transition-all duration-200 hover:bg-muted/50 ${
                          day ? "cursor-pointer" : ""
                        } ${today ? "bg-primary/10 border-primary/30" : ""}`}
                        onClick={() => day && navigate("/events/create")}
                      >
                        {day && (
                          <>
                            <div className={`text-sm font-medium mb-2 ${today ? "text-primary" : "text-foreground"}`}>
                              {day}
                              {today && (
                                <div className="h-1 w-6 bg-primary rounded-full mt-1" />
                              )}
                            </div>
                            
                            <div className="space-y-1">
                              {dayEvents.slice(0, 2).map((event) => (
                                <div
                                  key={event.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/events/${event.id}`);
                                  }}
                                  className={`p-1 rounded text-xs font-medium text-white cursor-pointer hover:opacity-80 transition-opacity bg-gradient-to-r ${event.color}`}
                                >
                                  <div className="truncate">{event.title}</div>
                                  <div className="text-xs opacity-90">{event.time}</div>
                                </div>
                              ))}
                              
                              {dayEvents.length > 2 && (
                                <div className="text-xs text-muted-foreground p-1">
                                  +{dayEvents.length - 2} more
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-gradient-to-r from-primary to-primary-light" />
                <span className="text-sm text-muted-foreground">Published Events</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-gradient-to-r from-secondary to-secondary-light" />
                <span className="text-sm text-muted-foreground">Draft Events</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded bg-gradient-to-r from-accent to-accent-light" />
                <span className="text-sm text-muted-foreground">Workshops</span>
              </div>
            </div>

            {/* Upcoming Events Sidebar */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockEvents.slice(0, 4).map((event) => (
                  <Card 
                    key={event.id} 
                    className="border-0 bg-gradient-to-br from-card to-muted/20 cursor-pointer hover:shadow-lg transition-all duration-300"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Badge>
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${event.color}`} />
                      </div>
                      
                      <h4 className="font-medium text-sm text-foreground mb-1 truncate">
                        {event.title}
                      </h4>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{event.time}</span>
                        <span>{event.attendees} attendees</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CalendarView;
import { Calendar, Users, MapPin, TrendingUp, DollarSign, CheckCircle } from "lucide-react";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import EventCard from "@/components/Dashboard/EventCard";
import StatsCard from "@/components/Dashboard/StatsCard";

const mockEvents = [
  {
    id: "1",
    title: "Annual Tech Conference 2024",
    date: "March 15, 2024",
    time: "9:00 AM - 6:00 PM",
    venue: "Grand Convention Center",
    attendees: 245,
    maxAttendees: 300,
    status: "published" as const,
  },
  {
    id: "2",
    title: "Product Launch Gala",
    date: "March 22, 2024",
    time: "7:00 PM - 11:00 PM",
    venue: "Luxury Hotel Ballroom",
    attendees: 89,
    maxAttendees: 150,
    status: "draft" as const,
  },
  {
    id: "3",
    title: "Team Building Workshop",
    date: "April 5, 2024",
    time: "10:00 AM - 4:00 PM",
    venue: "Corporate Training Center",
    attendees: 42,
    maxAttendees: 50,
    status: "published" as const,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, Sarah! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your events today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Events"
              value="24"
              change="+12% from last month"
              changeType="positive"
              icon={Calendar}
              gradient="primary"
            />
            <StatsCard
              title="Total Attendees"
              value="1,247"
              change="+18% from last month"
              changeType="positive"
              icon={Users}
              gradient="secondary"
            />
            <StatsCard
              title="Revenue"
              value="$45,230"
              change="+8% from last month"
              changeType="positive"
              icon={DollarSign}
              gradient="accent"
            />
            <StatsCard
              title="Success Rate"
              value="94%"
              change="+2% from last month"
              changeType="positive"
              icon={CheckCircle}
              gradient="success"
            />
          </div>

          {/* Upcoming Events */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Upcoming Events</h2>
              <button 
                onClick={() => window.location.href = "/events"}
                className="text-secondary hover:text-secondary-light font-medium transition-colors"
              >
                View All Events →
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-card to-muted/30 rounded-lg p-6 border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => window.location.href = "/events/create"}
                className="p-4 bg-gradient-to-r from-secondary/10 to-secondary-light/10 border border-secondary/20 rounded-lg hover:from-secondary/20 hover:to-secondary-light/20 transition-all duration-200 text-left group"
              >
                <Calendar className="h-8 w-8 text-secondary mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-foreground mb-1">Create New Event</h4>
                <p className="text-sm text-muted-foreground">Start planning your next event</p>
              </button>
              
              <button 
                onClick={() => window.location.href = "/calendar"}
                className="p-4 bg-gradient-to-r from-accent/10 to-accent-light/10 border border-accent/20 rounded-lg hover:from-accent/20 hover:to-accent-light/20 transition-all duration-200 text-left group"
              >
                <MapPin className="h-8 w-8 text-accent mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-foreground mb-1">View Calendar</h4>
                <p className="text-sm text-muted-foreground">Check event schedules</p>
              </button>
              
              <button 
                onClick={() => window.location.href = "/analytics"}
                className="p-4 bg-gradient-to-r from-primary/10 to-primary-light/10 border border-primary/20 rounded-lg hover:from-primary/20 hover:to-primary-light/20 transition-all duration-200 text-left group"
              >
                <TrendingUp className="h-8 w-8 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-foreground mb-1">View Analytics</h4>
                <p className="text-sm text-muted-foreground">Track event performance</p>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;

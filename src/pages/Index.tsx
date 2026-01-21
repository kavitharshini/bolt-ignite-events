import { Calendar, Users, MapPin, TrendingUp, IndianRupee, CheckCircle, Ticket, Plus, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import EventCard from "@/components/Dashboard/EventCard";
import BookingCard from "@/components/Dashboard/BookingCard";
import StatsCard from "@/components/Dashboard/StatsCard";
import useKeyboardShortcuts from "@/hooks/useKeyboardShortcuts";
import { useUser } from "@/contexts/UserContext";
import { useEvents } from "@/hooks/useEvents";
import { Button } from "@/components/ui/button";
import techConferenceImg from "@/assets/event-tech-conference.jpg";
import productLaunchImg from "@/assets/event-product-launch.jpg";
import teamBuildingImg from "@/assets/event-team-building.jpg";

// Sample events for first-time users
const sampleEvents = [
  {
    id: "sample_1",
    title: "Annual Tech Conference 2024",
    date: "2024-03-15",
    time: "09:00",
    endTime: "18:00",
    venue: "Grand Convention Center",
    attendees: 245,
    maxAttendees: "300",
    status: "published" as const,
    image: techConferenceImg,
  },
  {
    id: "sample_2",
    title: "Product Launch Gala",
    date: "2024-03-22",
    time: "19:00",
    endTime: "23:00",
    venue: "Luxury Hotel Ballroom",
    attendees: 89,
    maxAttendees: "150",
    status: "draft" as const,
    image: productLaunchImg,
  },
  {
    id: "sample_3",
    title: "Team Building Workshop",
    date: "2024-04-05",
    time: "10:00",
    endTime: "16:00",
    venue: "Corporate Training Center",
    attendees: 42,
    maxAttendees: "50",
    status: "published" as const,
    image: teamBuildingImg,
  },
];

const mockBookings = [
  {
    id: "1",
    eventTitle: "Annual Tech Conference 2024",
    eventDate: new Date("2024-03-15").toLocaleDateString(),
    eventTime: "09:00 AM - 06:00 PM",
    venue: "Grand Convention Center",
    ticketType: "VIP Pass",
    price: "₹2,500",
    status: "confirmed" as const,
    attendees: 2,
    image: techConferenceImg,
  },
  {
    id: "2",
    eventTitle: "Product Launch Gala",
    eventDate: new Date("2024-03-22").toLocaleDateString(),
    eventTime: "07:00 PM - 11:00 PM",
    venue: "Luxury Hotel Ballroom",
    ticketType: "Standard",
    price: "₹1,800",
    status: "pending" as const,
    attendees: 1,
    image: productLaunchImg,
  },
];

const Index = () => {
  const navigate = useNavigate();
  useKeyboardShortcuts();
  const { user } = useUser();
  const { events, loading, getEventStats } = useEvents();
  
  const stats = getEventStats();
  
  // Map stored events
  const storedEventsDisplay = events.map(e => ({
    id: e.id,
    title: e.title,
    date: e.date ? new Date(e.date).toLocaleDateString() : '',
    time: e.time && e.endTime ? `${e.time} - ${e.endTime}` : e.time || '',
    venue: e.venue,
    attendees: e.attendees || 0,
    maxAttendees: parseInt(e.maxAttendees) || 100,
    status: e.status,
    image: e.coverImage || undefined
  }));

  // Map sample events
  const sampleEventsDisplay = sampleEvents.map(e => ({
    ...e,
    date: new Date(e.date).toLocaleDateString(),
    time: `${e.time} - ${e.endTime}`,
    maxAttendees: parseInt(e.maxAttendees)
  }));

  // Always show both stored and sample events (newly booked + past/upcoming)
  const displayEvents = [...storedEventsDisplay, ...sampleEventsDisplay];

  const totalEvents = stats.total + sampleEvents.length;
  const totalRevenue = `₹${(stats.totalRevenue + 45000).toLocaleString('en-IN')}`;
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back, {user?.name || 'User'}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your events today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Events"
              value={totalEvents.toString()}
              change="+12% from last month"
              changeType="positive"
              icon={Calendar}
              gradient="primary"
            />
            <StatsCard
              title="Total Attendees"
              value={events.length > 0 ? events.reduce((sum, e) => sum + (e.attendees || 0), 0).toLocaleString() : "376"}
              change="+18% from last month"
              changeType="positive"
              icon={Users}
              gradient="secondary"
            />
            <StatsCard
              title="Revenue"
              value={totalRevenue}
              change="+8% from last month"
              changeType="positive"
              icon={IndianRupee}
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

          {/* Recent Bookings */}
          {!user?.isAdmin && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground flex items-center space-x-2">
                  <Ticket className="h-6 w-6 text-secondary" />
                  <span>My Recent Bookings</span>
                </h2>
                <button 
                  onClick={() => window.location.href = "/bookings"}
                  className="text-secondary hover:text-secondary-light font-medium transition-colors"
                >
                  View All Bookings →
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </div>
          )}

          {/* Events Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {user?.isAdmin ? "Manage Events" : "Your Events"}
                </h2>
                {events.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {stats.published} published, {stats.draft} drafts
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => navigate("/events/create")}
                  size="sm"
                  className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  <Plus className="h-4 w-4" />
                  Create Event
                </Button>
                <button 
                  onClick={() => navigate("/events")}
                  className="text-secondary hover:text-secondary-light font-medium transition-colors"
                >
                  View All →
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-80 bg-muted/50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : displayEvents.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-br from-card to-muted/30 rounded-xl border">
                <Sparkles className="h-12 w-12 text-primary/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Events Yet</h3>
                <p className="text-muted-foreground mb-6">Create your first event to get started!</p>
                <Button
                  onClick={() => navigate("/events/create")}
                  className="gap-2 bg-gradient-to-r from-primary to-secondary"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Event
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayEvents.slice(0, 3).map((event) => (
                  <div key={event.id} onClick={() => navigate(`/events/${event.id}`)} className="cursor-pointer">
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-card to-muted/30 rounded-lg p-6 border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => navigate("/events/create")}
                className="p-4 bg-gradient-to-r from-secondary/10 to-secondary-light/10 border border-secondary/20 rounded-lg hover:from-secondary/20 hover:to-secondary-light/20 transition-all duration-200 text-left group"
              >
                <Calendar className="h-8 w-8 text-secondary mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-foreground mb-1">Create New Event</h4>
                <p className="text-sm text-muted-foreground">Start planning your next event</p>
              </button>
              
              <button 
                onClick={() => navigate("/calendar")}
                className="p-4 bg-gradient-to-r from-accent/10 to-accent-light/10 border border-accent/20 rounded-lg hover:from-accent/20 hover:to-accent-light/20 transition-all duration-200 text-left group"
              >
                <MapPin className="h-8 w-8 text-accent mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-semibold text-foreground mb-1">View Calendar</h4>
                <p className="text-sm text-muted-foreground">Check event schedules</p>
              </button>
              
              <button 
                onClick={() => navigate("/analytics")}
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

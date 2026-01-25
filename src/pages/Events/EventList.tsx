import { useState, useMemo } from "react";
import { Plus, Search, Filter, Calendar, Grid, List, Sparkles, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import Breadcrumb from "@/components/Layout/Breadcrumb";
import EventCard from "@/components/Dashboard/EventCard";
import { useEvents } from "@/hooks/useEvents";
import { useToast } from "@/hooks/use-toast";
import techConferenceImg from "@/assets/event-tech-conference.jpg";
import productLaunchImg from "@/assets/event-product-launch.jpg";
import teamBuildingImg from "@/assets/event-team-building.jpg";

// Sample events for first-time users
const sampleEvents = [
  {
    id: "sample_1",
    title: "Annual Tech Conference 2024",
    date: "March 15, 2024",
    time: "9:00 AM - 6:00 PM",
    venue: "Grand Convention Center",
    attendees: 245,
    maxAttendees: 300,
    status: "published" as const,
    image: techConferenceImg,
  },
  {
    id: "sample_2",
    title: "Product Launch Gala",
    date: "March 22, 2024",
    time: "7:00 PM - 11:00 PM",
    venue: "Luxury Hotel Ballroom",
    attendees: 89,
    maxAttendees: 150,
    status: "draft" as const,
    image: productLaunchImg,
  },
  {
    id: "sample_3",
    title: "Team Building Workshop",
    date: "April 5, 2024",
    time: "10:00 AM - 4:00 PM",
    venue: "Corporate Training Center",
    attendees: 42,
    maxAttendees: 50,
    status: "published" as const,
    image: teamBuildingImg,
  },
];

const EventList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { events, loading, deleteEvent, updateEvent, getEventStats } = useEvents();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handleEditEvent = (id: string) => {
    navigate(`/events/${id}/edit`);
  };

  const handleCancelEvent = (id: string) => {
    updateEvent(id, { status: "cancelled" });
    toast({
      title: "Event Cancelled",
      description: "The event has been cancelled. Attendees will be notified.",
    });
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    toast({
      title: "Event Deleted",
      description: "The event has been permanently removed.",
    });
  };

  // Combine stored events with sample events
  const allEvents = useMemo(() => {
    const storedEvents = events.map(e => ({
      id: e.id,
      title: e.title,
      date: e.date ? new Date(e.date).toLocaleDateString('en-IN', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      }) : '',
      time: e.time && e.endTime ? `${e.time} - ${e.endTime}` : e.time || '',
      venue: e.venue,
      attendees: e.attendees || 0,
      maxAttendees: parseInt(e.maxAttendees) || 100,
      status: e.status,
      image: e.coverImage || undefined,
      isStored: true
    }));
    
    // Only show sample events if no real events exist
    if (storedEvents.length === 0) {
      return sampleEvents.map(e => ({ ...e, isStored: false }));
    }
    
    return storedEvents;
  }, [events]);

  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.venue.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || event.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [allEvents, searchTerm, statusFilter]);

  const stats = getEventStats();
  const statusCounts = {
    all: allEvents.length,
    published: events.length > 0 ? stats.published : sampleEvents.filter(e => e.status === "published").length,
    draft: events.length > 0 ? stats.draft : sampleEvents.filter(e => e.status === "draft").length,
    completed: events.length > 0 ? stats.completed : 0,
    cancelled: events.length > 0 ? stats.cancelled : 0,
  };


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
                <h1 className="text-3xl font-bold text-foreground mb-2">Events</h1>
                <p className="text-muted-foreground">Manage all your events from one place</p>
              </div>
              
              <Button 
                onClick={() => navigate("/events/create")}
                className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary mt-4 md:mt-0"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Event
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    statusFilter === status 
                      ? "bg-primary/10 border-primary text-primary" 
                      : "bg-card hover:bg-muted/50 border-border"
                  }`}
                >
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm capitalize">{status === "all" ? "Total" : status}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search events by title or venue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Events Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-80 bg-muted/50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-br from-card to-muted/30 rounded-xl border">
                <Sparkles className="h-16 w-16 text-primary/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No events found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm || statusFilter !== "all" 
                    ? "Try adjusting your search or filters" 
                    : "Create your first event to get started"}
                </p>
                <Button 
                  onClick={() => navigate("/events/create")}
                  className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </div>
            ) : (
              <>
                <div className={
                  viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                    : "space-y-4"
                }>
                  {filteredEvents.map((event) => (
                    <EventCard 
                      key={event.id} 
                      event={event}
                      onEdit={handleEditEvent}
                      onCancel={handleCancelEvent}
                      onDelete={handleDeleteEvent}
                    />
                  ))}
                </div>
                <div className="mt-8 text-center text-muted-foreground">
                  Showing {filteredEvents.length} of {allEvents.length} events
                  {events.length > 0 && (
                    <span className="ml-2 text-success">• {events.length} created by you</span>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EventList;
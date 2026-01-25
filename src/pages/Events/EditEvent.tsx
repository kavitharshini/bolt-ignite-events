import { useState, useEffect } from "react";
import { 
  Calendar, MapPin, Users, ArrowLeft, Save, 
  Camera, UtensilsCrossed, Music, Palette, Car, Shield, Sparkles, 
  Building, ImageIcon, Edit
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";
import Breadcrumb from "@/components/Layout/Breadcrumb";
import { useEvents, StoredEvent } from "@/hooks/useEvents";

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { getEventById, updateEvent, loading } = useEvents();
  
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    endTime: "",
    venue: "",
    address: "",
    maxAttendees: "",
    ticketPrice: "",
    category: "",
    eventType: "",
    status: "draft" as "draft" | "published" | "completed" | "cancelled",
    services: [] as string[],
    coverImage: "",
    tags: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id && !loading) {
      const event = getEventById(id);
      if (event) {
        setEventData({
          title: event.title || "",
          description: event.description || "",
          date: event.date || "",
          time: event.time || "",
          endTime: event.endTime || "",
          venue: event.venue || "",
          address: event.address || "",
          maxAttendees: event.maxAttendees || "",
          ticketPrice: event.ticketPrice || "",
          category: event.category || "",
          eventType: event.eventType || "",
          status: event.status || "draft",
          services: event.services || [],
          coverImage: event.coverImage || "",
          tags: event.tags || []
        });
      } else {
        toast({
          title: "Event Not Found",
          description: "The event you're trying to edit doesn't exist.",
          variant: "destructive"
        });
        navigate("/events");
      }
    }
  }, [id, loading, getEventById, navigate, toast]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!eventData.title.trim()) newErrors.title = "Event title is required";
    if (!eventData.date) newErrors.date = "Date is required";
    if (!eventData.time) newErrors.time = "Start time is required";
    if (!eventData.venue.trim()) newErrors.venue = "Venue is required";
    if (!eventData.maxAttendees || parseInt(eventData.maxAttendees) <= 0) {
      newErrors.maxAttendees = "Valid attendee count required";
    }
    if (!eventData.category) newErrors.category = "Please select a category";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !id) return;
    
    setIsSaving(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    updateEvent(id, eventData);
    
    setIsSaving(false);
    
    toast({
      title: "✓ Event Updated",
      description: `"${eventData.title}" has been updated successfully.`,
    });
    
    navigate(`/events/${id}`);
  };

  const updateField = (field: string, value: string | string[]) => {
    setEventData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const toggleService = (service: string) => {
    setEventData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const services = [
    { id: "catering", label: "Catering & Food", icon: UtensilsCrossed, color: "from-orange-500 to-amber-500" },
    { id: "photography", label: "Photography", icon: Camera, color: "from-purple-500 to-violet-500" },
    { id: "music", label: "Audio/Music", icon: Music, color: "from-green-500 to-emerald-500" },
    { id: "decoration", label: "Decoration", icon: Palette, color: "from-pink-500 to-rose-500" },
    { id: "transport", label: "Transportation", icon: Car, color: "from-blue-500 to-cyan-500" },
    { id: "security", label: "Security", icon: Shield, color: "from-red-500 to-rose-500" }
  ];

  const categories = [
    { value: "conference", label: "Conference", icon: Building },
    { value: "workshop", label: "Workshop", icon: Users },
    { value: "seminar", label: "Seminar", icon: Calendar },
    { value: "networking", label: "Networking", icon: Users },
    { value: "wedding", label: "Wedding", icon: Sparkles },
    { value: "corporate", label: "Corporate", icon: Building },
    { value: "social", label: "Social", icon: Users },
    { value: "other", label: "Other", icon: Calendar }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading event...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Header showBackButton={true} />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-4xl mx-auto">
            <Breadcrumb />
            
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-secondary via-secondary-light to-accent p-8 mb-8">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLThoLTJ2LTRoMnY0em0tNiA0aC00djJoNHYtMnptLTYgMGgtNHYyaDR2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => navigate(-1)}
                    className="bg-white/10 hover:bg-white/20 text-white"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Edit className="h-5 w-5 text-white/80" />
                      <span className="text-white/80 font-medium text-sm">Edit Mode</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">Edit Event</h1>
                    <p className="text-white/80 mt-1">{eventData.title || "Loading..."}</p>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white border-0">
                  {eventData.status.charAt(0).toUpperCase() + eventData.status.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="space-y-6">
              {/* Event Details */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/10">
                <div className="h-1 bg-gradient-to-r from-secondary via-accent to-primary" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-secondary" />
                    </div>
                    Event Information
                  </CardTitle>
                  <CardDescription>Update your event details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-foreground mb-2 block">
                        Event Title <span className="text-destructive">*</span>
                      </label>
                      <Input
                        value={eventData.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        placeholder="Enter event title"
                        className={`h-12 text-lg ${errors.title ? "border-destructive" : ""}`}
                      />
                      {errors.title && <p className="text-destructive text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-sm font-semibold text-foreground mb-2 block">Description</label>
                      <textarea
                        value={eventData.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        placeholder="Describe your event..."
                        rows={4}
                        className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">
                        Date <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="date"
                        value={eventData.date}
                        onChange={(e) => updateField("date", e.target.value)}
                        className={`h-12 ${errors.date ? "border-destructive" : ""}`}
                      />
                      {errors.date && <p className="text-destructive text-sm mt-1">{errors.date}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-semibold text-foreground mb-2 block">
                          Start Time <span className="text-destructive">*</span>
                        </label>
                        <Input
                          type="time"
                          value={eventData.time}
                          onChange={(e) => updateField("time", e.target.value)}
                          className={`h-12 ${errors.time ? "border-destructive" : ""}`}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-foreground mb-2 block">End Time</label>
                        <Input
                          type="time"
                          value={eventData.endTime}
                          onChange={(e) => updateField("endTime", e.target.value)}
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">
                        Venue <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          value={eventData.venue}
                          onChange={(e) => updateField("venue", e.target.value)}
                          placeholder="Venue name"
                          className={`h-12 pl-10 ${errors.venue ? "border-destructive" : ""}`}
                        />
                      </div>
                      {errors.venue && <p className="text-destructive text-sm mt-1">{errors.venue}</p>}
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">Address</label>
                      <Input
                        value={eventData.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        placeholder="Full address"
                        className="h-12"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">
                        Max Attendees <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="number"
                          value={eventData.maxAttendees}
                          onChange={(e) => updateField("maxAttendees", e.target.value)}
                          placeholder="100"
                          className={`h-12 pl-10 ${errors.maxAttendees ? "border-destructive" : ""}`}
                        />
                      </div>
                      {errors.maxAttendees && <p className="text-destructive text-sm mt-1">{errors.maxAttendees}</p>}
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">Ticket Price (₹)</label>
                      <Input
                        type="number"
                        value={eventData.ticketPrice}
                        onChange={(e) => updateField("ticketPrice", e.target.value)}
                        placeholder="0 for free"
                        className="h-12"
                      />
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-3 block">
                      Category <span className="text-destructive">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => updateField("category", cat.value)}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                            eventData.category === cat.value
                              ? "border-secondary bg-secondary/10 shadow-md"
                              : "border-border hover:border-secondary/50"
                          }`}
                        >
                          <cat.icon className={`h-6 w-6 ${eventData.category === cat.value ? "text-secondary" : "text-muted-foreground"}`} />
                          <span className={`text-sm font-medium ${eventData.category === cat.value ? "text-secondary" : ""}`}>
                            {cat.label}
                          </span>
                        </button>
                      ))}
                    </div>
                    {errors.category && <p className="text-destructive text-sm mt-2">{errors.category}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Sparkles className="h-5 w-5 text-accent" />
                    </div>
                    Additional Services
                  </CardTitle>
                  <CardDescription>Select services for your event</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService(service.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          eventData.services.includes(service.id)
                            ? "border-secondary bg-secondary/10"
                            : "border-border hover:border-secondary/50"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center mb-3`}>
                          <service.icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-medium text-sm">{service.label}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Cover Image */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-card to-muted/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <ImageIcon className="h-5 w-5 text-primary" />
                    </div>
                    Cover Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    value={eventData.coverImage}
                    onChange={(e) => updateField("coverImage", e.target.value)}
                    placeholder="Enter image URL"
                    className="h-12"
                  />
                  {eventData.coverImage && (
                    <div className="mt-4 rounded-lg overflow-hidden">
                      <img 
                        src={eventData.coverImage} 
                        alt="Cover preview" 
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 bg-gradient-to-r from-secondary to-secondary-light hover:from-secondary-light hover:to-secondary"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditEvent;

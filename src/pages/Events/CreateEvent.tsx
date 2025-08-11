import { useState } from "react";
import { Calendar, MapPin, Users, Clock, DollarSign, ArrowLeft, Save, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    maxAttendees: "",
    ticketPrice: "",
    category: "",
    status: "draft"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!eventData.title.trim()) newErrors.title = "Title is required";
    if (!eventData.date) newErrors.date = "Date is required";
    if (!eventData.time) newErrors.time = "Time is required";
    if (!eventData.venue.trim()) newErrors.venue = "Venue is required";
    if (!eventData.maxAttendees || parseInt(eventData.maxAttendees) <= 0) {
      newErrors.maxAttendees = "Valid attendee count required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (status: "draft" | "published") => {
    if (!validateForm()) return;
    
    const finalEventData = { ...eventData, status };
    console.log("Creating event:", finalEventData);
    
    toast({
      title: status === "draft" ? "Event Saved as Draft" : "Event Published",
      description: `"${eventData.title}" has been ${status === "draft" ? "saved" : "published"} successfully.`,
    });
    
    navigate("/events");
  };

  const updateField = (field: string, value: string) => {
    setEventData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate(-1)}
                className="hover:bg-muted"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Create New Event</h1>
                <p className="text-muted-foreground">Fill in the details to create your event</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span>Event Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Event Title *</label>
                      <Input
                        value={eventData.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        placeholder="Enter event title"
                        className={errors.title ? "border-destructive" : ""}
                      />
                      {errors.title && <p className="text-destructive text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
                      <textarea
                        value={eventData.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        placeholder="Describe your event..."
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Date *</label>
                        <Input
                          type="date"
                          value={eventData.date}
                          onChange={(e) => updateField("date", e.target.value)}
                          className={errors.date ? "border-destructive" : ""}
                        />
                        {errors.date && <p className="text-destructive text-sm mt-1">{errors.date}</p>}
                      </div>

                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Time *</label>
                        <Input
                          type="time"
                          value={eventData.time}
                          onChange={(e) => updateField("time", e.target.value)}
                          className={errors.time ? "border-destructive" : ""}
                        />
                        {errors.time && <p className="text-destructive text-sm mt-1">{errors.time}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-secondary" />
                      <span>Venue & Capacity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Venue *</label>
                      <Input
                        value={eventData.venue}
                        onChange={(e) => updateField("venue", e.target.value)}
                        placeholder="Event venue or location"
                        className={errors.venue ? "border-destructive" : ""}
                      />
                      {errors.venue && <p className="text-destructive text-sm mt-1">{errors.venue}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">Max Attendees *</label>
                        <Input
                          type="number"
                          value={eventData.maxAttendees}
                          onChange={(e) => updateField("maxAttendees", e.target.value)}
                          placeholder="100"
                          min="1"
                          className={errors.maxAttendees ? "border-destructive" : ""}
                        />
                        {errors.maxAttendees && <p className="text-destructive text-sm mt-1">{errors.maxAttendees}</p>}
                      </div>

                       <div>
                         <label className="text-sm font-medium text-foreground mb-2 block">Ticket Price ($)</label>
                         <div className="relative">
                           <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                           <Input
                             type="number"
                             value={eventData.ticketPrice}
                             onChange={(e) => updateField("ticketPrice", e.target.value)}
                             placeholder="0.00"
                             min="0"
                             step="0.01"
                             className="pl-8"
                           />
                         </div>
                       </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                      <select
                        value={eventData.category}
                        onChange={(e) => updateField("category", e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select category</option>
                        <option value="conference">Conference</option>
                        <option value="workshop">Workshop</option>
                        <option value="seminar">Seminar</option>
                        <option value="networking">Networking</option>
                        <option value="social">Social</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Preview */}
              <div className="space-y-6">
                <Card className="border-0 bg-gradient-to-br from-card to-muted/20 sticky top-8">
                  <CardHeader>
                    <CardTitle>Event Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-40 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-lg flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-secondary/60" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg">{eventData.title || "Event Title"}</h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        {eventData.description || "Event description will appear here..."}
                      </p>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-secondary" />
                        <span>{eventData.date || "Select date"}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-secondary" />
                        <span>{eventData.time || "Select time"}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-secondary" />
                        <span className="truncate">{eventData.venue || "Venue location"}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-secondary" />
                        <span>0/{eventData.maxAttendees || "0"} attendees</span>
                      </div>
                      
                       {eventData.ticketPrice && (
                         <div className="flex items-center space-x-2">
                           <DollarSign className="h-4 w-4 text-accent" />
                           <span>${eventData.ticketPrice}</span>
                         </div>
                       )}
                    </div>

                    {eventData.category && (
                      <Badge variant="secondary" className="capitalize">
                        {eventData.category}
                      </Badge>
                    )}
                  </CardContent>
                </Card>

                 {/* Action Buttons */}
                 <div className="space-y-3">
                   <Button 
                     onClick={() => {
                       if (validateForm()) {
                         // Show confirmation before publishing
                         const confirmed = window.confirm("Are you sure you want to publish this event? Once published, it will be visible to all users.");
                         if (confirmed) {
                           handleSubmit("published");
                         }
                       }
                     }}
                     className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary"
                     size="lg"
                   >
                     <Send className="h-4 w-4 mr-2" />
                     Confirm & Publish Event
                   </Button>
                   
                   <Button 
                     onClick={() => handleSubmit("draft")}
                     variant="outline"
                     className="w-full"
                     size="lg"
                   >
                     <Save className="h-4 w-4 mr-2" />
                     Save as Draft
                   </Button>
                 </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateEvent;
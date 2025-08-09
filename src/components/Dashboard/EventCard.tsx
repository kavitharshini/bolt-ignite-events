import { Calendar, MapPin, Users, Clock, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    date: string;
    time: string;
    venue: string;
    attendees: number;
    maxAttendees: number;
    status: "draft" | "published" | "completed" | "cancelled";
    image?: string;
  };
}

const EventCard = ({ event }: EventCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-success text-success-foreground";
      case "draft":
        return "bg-accent text-accent-foreground";
      case "completed":
        return "bg-primary text-primary-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/30 hover:from-card hover:to-muted/50">
      <CardContent className="p-0">
        <div className="relative">
          <div className="h-48 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-t-lg flex items-center justify-center">
            <Calendar className="h-16 w-16 text-secondary/60" />
          </div>
          <div className="absolute top-3 right-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 hover:bg-background">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute top-3 left-3">
            <Badge className={getStatusColor(event.status)}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </Badge>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors">
            {event.title}
          </h3>
          
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-secondary" />
              <span>{event.date}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-secondary" />
              <span>{event.time}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-secondary" />
              <span className="truncate">{event.venue}</span>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-secondary" />
                <span>{event.attendees}/{event.maxAttendees}</span>
              </div>
              <div className="w-20 bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-secondary to-secondary-light h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2 mt-4">
            <Button size="sm" className="flex-1 bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary">
              View Details
            </Button>
            <Button variant="outline" size="sm" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
              Edit
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
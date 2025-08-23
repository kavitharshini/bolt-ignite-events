import { Calendar, MapPin, Clock, Users, Star, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BookingCardProps {
  booking: {
    id: string;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    venue: string;
    ticketType: string;
    price: string;
    status: "confirmed" | "pending" | "cancelled";
    attendees: number;
    image?: string;
  };
}

const BookingCard = ({ booking }: BookingCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-accent text-accent-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <Star className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/30 hover:from-card hover:to-muted/50">
      <CardContent className="p-0">
        <div className="relative">
          {booking.image ? (
            <div className="h-32 overflow-hidden rounded-t-lg">
              <img 
                src={booking.image} 
                alt={booking.eventTitle}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="h-32 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-t-lg flex items-center justify-center">
              <Calendar className="h-12 w-12 text-secondary/60" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge className={getStatusColor(booking.status)}>
              <div className="flex items-center space-x-1">
                {getStatusIcon(booking.status)}
                <span className="text-xs">{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
              </div>
            </Badge>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors">
            {booking.eventTitle}
          </h3>
          
          <div className="space-y-2 text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-secondary" />
              <span>{booking.eventDate}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-secondary" />
              <span>{booking.eventTime}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-secondary" />
              <span className="truncate">{booking.venue}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-secondary" />
              <span>{booking.attendees} attendee{booking.attendees > 1 ? 's' : ''}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Ticket Type</p>
              <p className="font-medium text-foreground">{booking.ticketType}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="font-bold text-lg text-primary">{booking.price}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button size="sm" className="flex-1 bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary">
              View Details
            </Button>
            {booking.status === "confirmed" && (
              <Button variant="outline" size="sm" className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground">
                Download Ticket
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
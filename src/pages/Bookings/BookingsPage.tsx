import { useState } from "react";
import { Calendar, MapPin, Clock, Users, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Layout/Header";
import Sidebar from "@/components/Layout/Sidebar";

const BookingsPage = () => {
  const { toast } = useToast();
  
  const [bookings] = useState([
    {
      id: "1",
      eventTitle: "Tech Conference 2024",
      eventDate: "2024-12-25",
      eventTime: "09:00 AM",
      location: "Mumbai Convention Center",
      status: "confirmed",
      attendees: 1,
      bookingDate: "2024-12-15",
      ticketType: "General",
      price: "₹2,500"
    },
    {
      id: "2", 
      eventTitle: "Workshop: React Advanced",
      eventDate: "2024-12-30",
      eventTime: "02:00 PM",
      location: "Tech Hub, Pune",
      status: "pending",
      attendees: 1,
      bookingDate: "2024-12-16",
      ticketType: "Early Bird",
      price: "₹1,800"
    },
    {
      id: "3",
      eventTitle: "Music Festival",
      eventDate: "2024-12-20",
      eventTime: "06:00 PM", 
      location: "Marine Drive, Mumbai",
      status: "cancelled",
      attendees: 2,
      bookingDate: "2024-12-10",
      ticketType: "VIP",
      price: "₹5,000"
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    toast({
      title: "Booking Cancelled",
      description: "Your booking has been cancelled successfully.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header showBackButton={true} />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
              <p className="text-muted-foreground">View and manage your event bookings</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 bg-gradient-to-br from-card to-green-50 dark:to-green-950/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-500/10 rounded-full">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Confirmed</p>
                      <p className="text-2xl font-bold">1</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-card to-yellow-50 dark:to-yellow-950/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-yellow-500/10 rounded-full">
                      <AlertCircle className="h-6 w-6 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold">1</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-gradient-to-br from-card to-red-50 dark:to-red-950/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-red-500/10 rounded-full">
                      <XCircle className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cancelled</p>
                      <p className="text-2xl font-bold">1</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bookings List */}
            <div className="space-y-6">
              {bookings.map((booking) => (
                <Card key={booking.id} className="border-0 bg-gradient-to-br from-card to-muted/20">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{booking.eventTitle}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(booking.status)}
                        <Badge variant={getStatusVariant(booking.status)} className="capitalize">
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{new Date(booking.eventDate).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">Date</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-secondary" />
                        <div>
                          <p className="text-sm font-medium">{booking.eventTime}</p>
                          <p className="text-xs text-muted-foreground">Time</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        <div>
                          <p className="text-sm font-medium">{booking.location}</p>
                          <p className="text-xs text-muted-foreground">Venue</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{booking.attendees} {booking.attendees === 1 ? 'Person' : 'People'}</p>
                          <p className="text-xs text-muted-foreground">Attendees</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm font-medium">Ticket Type: {booking.ticketType}</p>
                          <p className="text-lg font-bold text-primary">{booking.price}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {booking.status === 'confirmed' && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BookingsPage;
import { Calendar, MapPin, Users, Clock, MoreVertical, Edit, XCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
    isStored?: boolean;
  };
  onEdit?: (id: string) => void;
  onCancel?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const EventCard = ({ event, onEdit, onCancel, onDelete }: EventCardProps) => {
  const navigate = useNavigate();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(event.id);
    } else {
      navigate(`/events/${event.id}/edit`);
    }
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCancelDialogOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    onCancel?.(event.id);
    setCancelDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    onDelete?.(event.id);
    setDeleteDialogOpen(false);
  };

  const isSampleEvent = event.id.startsWith("sample_");
  const isCancelled = event.status === "cancelled";

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/30 hover:from-card hover:to-muted/50">
        <CardContent className="p-0">
          <div className="relative">
            {event.image ? (
              <div className="h-48 overflow-hidden rounded-t-lg">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${isCancelled ? 'grayscale opacity-60' : ''}`}
                />
              </div>
            ) : (
              <div className={`h-48 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-t-lg flex items-center justify-center ${isCancelled ? 'opacity-60' : ''}`}>
                <Calendar className="h-16 w-16 text-secondary/60" />
              </div>
            )}
            
            {/* Actions Menu */}
            {!isSampleEvent && (
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 hover:bg-background">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Event
                    </DropdownMenuItem>
                    {!isCancelled && (
                      <DropdownMenuItem onClick={handleCancelClick} className="text-amber-600">
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Event
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDeleteClick} className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Event
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            
            {/* Sample event indicator */}
            {isSampleEvent && (
              <div className="absolute top-3 right-3">
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 hover:bg-background cursor-default">
                  <MoreVertical className="h-4 w-4 opacity-30" />
                </Button>
              </div>
            )}
            
            <div className="absolute top-3 left-3">
              <Badge className={getStatusColor(event.status)}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Badge>
            </div>
          </div>
          
          <div className={`p-6 ${isCancelled ? 'opacity-70' : ''}`}>
            <h3 className={`text-lg font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors ${isCancelled ? 'line-through' : ''}`}>
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
              <Button 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-primary to-primary-light hover:from-primary-light hover:to-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/events/${event.id}`);
                }}
              >
                View Details
              </Button>
              {!isSampleEvent && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                  onClick={handleEdit}
                >
                  Edit
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel "{event.title}"? This will notify all attendees and the event will be marked as cancelled. You can still view the event details but it won't be visible to new attendees.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Event</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmCancel}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Yes, Cancel Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete "{event.title}"? This action cannot be undone and all event data will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Event</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Yes, Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EventCard;

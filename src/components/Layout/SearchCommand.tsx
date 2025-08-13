import { useState, useEffect } from "react";
import { Search, Calendar, Users, BarChart3, Settings, Plus, MapPin, Clock, User, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

// Mock data for search results
const mockEvents = [
  { id: "1", title: "Annual Tech Conference 2024", type: "event", venue: "Grand Convention Center", date: "2024-03-15" },
  { id: "2", title: "Product Launch Gala", type: "event", venue: "Luxury Hotel Ballroom", date: "2024-03-22" },
  { id: "3", title: "Team Building Workshop", type: "event", venue: "Corporate Training Center", date: "2024-04-05" },
  { id: "4", title: "Marketing Summit", type: "event", venue: "Business Center", date: "2024-04-12" },
];

const mockAttendees = [
  { id: "1", name: "Bug Hunters", type: "attendee", email: "bughunters@company.com", events: 3 },
  { id: "2", name: "Priya Patel", type: "attendee", email: "priya@company.com", events: 2 },
  { id: "3", name: "Rahul Kumar", type: "attendee", email: "rahul@company.com", events: 5 },
];

const mockVenues = [
  { id: "1", name: "Grand Convention Center", type: "venue", location: "Mumbai", capacity: 500 },
  { id: "2", name: "Luxury Hotel Ballroom", type: "venue", location: "Delhi", capacity: 200 },
  { id: "3", name: "Corporate Training Center", type: "venue", location: "Bangalore", capacity: 100 },
];

interface SearchCommandProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SearchCommand = ({ open, setOpen }: SearchCommandProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const addToRecentSearches = (term: string) => {
    const updated = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const runCommand = (command: () => void, searchTerm?: string) => {
    setOpen(false);
    if (searchTerm) {
      addToRecentSearches(searchTerm);
    }
    command();
  };

  // Filter results based on search term
  const filteredEvents = mockEvents.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAttendees = mockAttendees.filter(attendee =>
    attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVenues = mockVenues.filter(venue =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    venue.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Search events, attendees, venues..." 
        value={searchTerm}
        onValueChange={setSearchTerm}
      />
      <CommandList>
        <CommandEmpty>
          <div className="text-center py-6">
            <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No results found for "{searchTerm}"</p>
            <p className="text-sm text-muted-foreground mt-1">Try searching for events, attendees, or venues</p>
          </div>
        </CommandEmpty>

        {!searchTerm && recentSearches.length > 0 && (
          <CommandGroup heading="Recent Searches">
            {recentSearches.map((term, index) => (
              <CommandItem 
                key={index} 
                onSelect={() => {
                  setSearchTerm(term);
                }}
              >
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{term}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {!searchTerm && (
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => runCommand(() => navigate("/events/create"))}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Create New Event</span>
              <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">Ctrl+N</kbd>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/calendar"))}>
              <Calendar className="mr-2 h-4 w-4" />
              <span>View Indian Calendar</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/analytics"))}>
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>View Analytics</span>
            </CommandItem>
          </CommandGroup>
        )}

        {searchTerm && filteredEvents.length > 0 && (
          <CommandGroup heading="Events">
            {filteredEvents.map((event) => (
              <CommandItem 
                key={event.id} 
                onSelect={() => runCommand(() => navigate(`/events/${event.id}`), event.title)}
              >
                <Calendar className="mr-2 h-4 w-4 text-primary" />
                <div className="flex flex-col">
                  <span>{event.title}</span>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{event.venue}</span>
                    <span>•</span>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="ml-auto">Event</Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {searchTerm && filteredAttendees.length > 0 && (
          <CommandGroup heading="Attendees">
            {filteredAttendees.map((attendee) => (
              <CommandItem 
                key={attendee.id} 
                onSelect={() => runCommand(() => navigate("/attendees"), attendee.name)}
              >
                <User className="mr-2 h-4 w-4 text-secondary" />
                <div className="flex flex-col">
                  <span>{attendee.name}</span>
                  <span className="text-xs text-muted-foreground">{attendee.email}</span>
                </div>
                <Badge variant="outline" className="ml-auto">{attendee.events} events</Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {searchTerm && filteredVenues.length > 0 && (
          <CommandGroup heading="Venues">
            {filteredVenues.map((venue) => (
              <CommandItem 
                key={venue.id} 
                onSelect={() => runCommand(() => navigate("/events"), venue.name)}
              >
                <MapPin className="mr-2 h-4 w-4 text-accent" />
                <div className="flex flex-col">
                  <span>{venue.name}</span>
                  <span className="text-xs text-muted-foreground">{venue.location}</span>
                </div>
                <Badge variant="outline" className="ml-auto">Cap: {venue.capacity}</Badge>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {!searchTerm && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
                <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">Alt+D</kbd>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/events"))}>
                <Calendar className="mr-2 h-4 w-4" />
                <span>Events</span>
                <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">Alt+E</kbd>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/attendees"))}>
                <Users className="mr-2 h-4 w-4" />
                <span>Attendees</span>
                <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">Alt+A</kbd>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/profile"))}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
                <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">Alt+P</kbd>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => navigate("/settings"))}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">Alt+S</kbd>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default SearchCommand;
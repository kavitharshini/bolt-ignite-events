import { useState, useEffect } from "react";
import { Search, Calendar, Users, BarChart3, Settings, Plus } from "lucide-react";
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

interface SearchCommandProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SearchCommand = ({ open, setOpen }: SearchCommandProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => runCommand(() => navigate("/events/create"))}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Create New Event</span>
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
        
        <CommandSeparator />
        
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/events"))}>
            <Calendar className="mr-2 h-4 w-4" />
            <span>Events</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/attendees"))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Attendees</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/profile"))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default SearchCommand;
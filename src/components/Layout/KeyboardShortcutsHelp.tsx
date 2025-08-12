import { useState } from "react";
import { Keyboard, X, Command, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const KeyboardShortcutsHelp = () => {
  const shortcuts = [
    {
      category: "Navigation",
      shortcuts: [
        { keys: ["Alt", "D"], description: "Go to Dashboard" },
        { keys: ["Alt", "E"], description: "Go to Events" },
        { keys: ["Alt", "A"], description: "Go to Attendees" },
        { keys: ["Alt", "P"], description: "Go to Profile" },
        { keys: ["Alt", "S"], description: "Go to Settings" },
        { keys: ["Alt", "C"], description: "Go to Calendar" },
      ]
    },
    {
      category: "Actions",
      shortcuts: [
        { keys: ["Ctrl/Cmd", "K"], description: "Open search" },
        { keys: ["Ctrl/Cmd", "N"], description: "Create new event" },
        { keys: ["Escape"], description: "Close modals/search" },
      ]
    },
    {
      category: "Search",
      shortcuts: [
        { keys: ["Ctrl/Cmd", "K"], description: "Open command palette" },
        { keys: ["↑", "↓"], description: "Navigate search results" },
        { keys: ["Enter"], description: "Select search result" },
      ]
    }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-primary/10">
          <Keyboard className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Keyboard className="h-5 w-5" />
            <span>Keyboard Shortcuts</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {shortcuts.map((category) => (
            <div key={category.category}>
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.shortcuts.map((shortcut, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="text-foreground">{shortcut.description}</span>
                    <div className="flex items-center space-x-1">
                      {shortcut.keys.map((key, keyIndex) => (
                        <Badge 
                          key={keyIndex} 
                          variant="secondary" 
                          className="font-mono text-xs"
                        >
                          {key}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground text-center">
              Press <Badge variant="outline" className="mx-1">Ctrl/Cmd + K</Badge> 
              to open the command palette from anywhere in the app.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsHelp;
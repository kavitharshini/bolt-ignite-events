import { useState, useEffect } from "react";
import { 
  Clock, Plus, Trash2, Edit2, Save, X, 
  RefreshCw, GripVertical, Wand2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  ScheduleItem, 
  generateSchedule, 
  createCustomScheduleItem 
} from "@/utils/scheduleGenerator";

interface EventScheduleManagerProps {
  category: string;
  eventStartTime: string;
  eventEndTime: string;
  eventDate: string;
  onScheduleChange?: (schedule: ScheduleItem[]) => void;
  initialSchedule?: ScheduleItem[];
  readOnly?: boolean;
}

const EventScheduleManager = ({
  category,
  eventStartTime,
  eventEndTime,
  eventDate,
  onScheduleChange,
  initialSchedule,
  readOnly = false,
}: EventScheduleManagerProps) => {
  const { toast } = useToast();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    startTime: "",
    duration: 30,
    description: "",
  });

  useEffect(() => {
    if (initialSchedule && initialSchedule.length > 0) {
      setSchedule(initialSchedule);
    } else {
      regenerateSchedule();
    }
  }, [category, eventStartTime, eventEndTime]);

  const regenerateSchedule = () => {
    const generated = generateSchedule({
      category,
      eventStartTime,
      eventEndTime,
      eventDate,
    });
    setSchedule(generated);
    onScheduleChange?.(generated);
    toast({
      title: "Schedule Generated",
      description: `Created ${generated.length} schedule items for ${category} event.`,
    });
  };

  const handleUpdateSchedule = (updatedSchedule: ScheduleItem[]) => {
    setSchedule(updatedSchedule);
    onScheduleChange?.(updatedSchedule);
  };

  const handleDeleteItem = (id: string) => {
    const updated = schedule.filter(item => item.id !== id);
    handleUpdateSchedule(updated);
    toast({
      title: "Item Removed",
      description: "Schedule item has been deleted.",
    });
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    
    const updated = schedule.map(item => 
      item.id === editingItem.id ? editingItem : item
    );
    handleUpdateSchedule(updated);
    setEditingItem(null);
    toast({
      title: "Item Updated",
      description: "Schedule item has been saved.",
    });
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.startTime) {
      toast({
        title: "Missing Information",
        description: "Please provide event name and start time.",
        variant: "destructive",
      });
      return;
    }

    const item = createCustomScheduleItem(
      newItem.name,
      newItem.startTime,
      newItem.duration,
      newItem.description
    );

    // Insert in chronological order
    const updated = [...schedule, item].sort((a, b) => {
      const timeA = a.startTime.replace(/[^0-9:]/g, '');
      const timeB = b.startTime.replace(/[^0-9:]/g, '');
      return timeA.localeCompare(timeB);
    });

    handleUpdateSchedule(updated);
    setIsAddDialogOpen(false);
    setNewItem({ name: "", startTime: "", duration: 30, description: "" });
    toast({
      title: "Item Added",
      description: "New schedule item has been added.",
    });
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <Card className="border-0 bg-gradient-to-br from-card to-muted/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-secondary" />
            Event Schedule
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {category.charAt(0).toUpperCase() + category.slice(1)} • {eventDate} • {eventStartTime} - {eventEndTime}
          </p>
        </div>
        {!readOnly && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={regenerateSchedule}
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Auto-Generate
            </Button>
            <Button
              size="sm"
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-primary to-primary-light"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {schedule.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No schedule items yet.</p>
            {!readOnly && (
              <Button
                className="mt-4"
                variant="outline"
                onClick={regenerateSchedule}
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Schedule
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead className="min-w-[200px]">Event Name</TableHead>
                  <TableHead className="w-[120px]">Start Time</TableHead>
                  <TableHead className="w-[120px]">End Time</TableHead>
                  <TableHead className="w-[100px]">Duration</TableHead>
                  <TableHead className="min-w-[200px]">Description</TableHead>
                  {!readOnly && <TableHead className="w-[100px] text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((item, index) => (
                  <TableRow key={item.id} className="group">
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      {editingItem?.id === item.id ? (
                        <Input
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          className="h-8"
                        />
                      ) : (
                        <span className="font-medium">{item.name}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {item.startTime}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {item.endTime}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDuration(item.duration)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {editingItem?.id === item.id ? (
                        <Input
                          value={editingItem.description || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                          className="h-8"
                          placeholder="Add description..."
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {item.description || "—"}
                        </span>
                      )}
                    </TableCell>
                    {!readOnly && (
                      <TableCell className="text-right">
                        {editingItem?.id === item.id ? (
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={handleSaveEdit}
                            >
                              <Save className="h-4 w-4 text-success" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setEditingItem(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setEditingItem(item)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Timeline View */}
        {schedule.length > 0 && (
          <div className="mt-8">
            <h4 className="text-sm font-medium mb-4 text-muted-foreground">Timeline View</h4>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary via-accent to-primary" />
              <div className="space-y-4">
                {schedule.map((item, index) => (
                  <div key={item.id} className="relative flex items-start gap-4 pl-10">
                    <div className="absolute left-2.5 w-3 h-3 rounded-full bg-secondary border-2 border-background" />
                    <div className="flex-1 bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{item.name}</span>
                        <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20">
                          {item.startTime} - {item.endTime}
                        </Badge>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Schedule Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Event Name *</label>
              <Input
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="e.g., Coffee Break"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Time *</label>
                <Input
                  value={newItem.startTime}
                  onChange={(e) => setNewItem({ ...newItem, startTime: e.target.value })}
                  placeholder="e.g., 10:30 AM"
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Duration (minutes)</label>
                <Input
                  type="number"
                  value={newItem.duration}
                  onChange={(e) => setNewItem({ ...newItem, duration: parseInt(e.target.value) || 30 })}
                  min={5}
                  step={5}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Optional description..."
                className="mt-1"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem} className="bg-gradient-to-r from-primary to-primary-light">
              Add Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EventScheduleManager;

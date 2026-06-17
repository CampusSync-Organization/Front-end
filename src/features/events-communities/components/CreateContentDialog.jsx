import { useState } from "react";
import { Plus, Calendar, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function CreateContentDialog({
  open,
  onOpenChange,
  onSubmitEvent,
  onSubmitCommunity,
}) {
  const [activeTab, setActiveTab] = useState("event");

  const [eventData, setEventData] = useState({
    name: "",
    description: "",
    date: undefined,
    time: "",
    place: "",
    capacity: "",
  });

  const [communityData, setCommunityData] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!eventData.name.trim()) newErrors.name = "Event name is required";
    if (!eventData.description.trim()) newErrors.description = "Description is required";
    if (!eventData.date) newErrors.date = "Event date is required";
    if (eventData.date && eventData.date < new Date()) newErrors.date = "Event date must be in the future";
    if (!eventData.time.trim()) newErrors.time = "Event time is required";
    if (!eventData.place.trim()) newErrors.place = "Location is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmitEvent({
      ...eventData,
      date: eventData.date instanceof Date ? eventData.date.toISOString().split("T")[0] : eventData.date,
      capacity: eventData.capacity ? Number(eventData.capacity) : null,
    });
    resetForms();
  };

  const handleCommunitySubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    const newErrors = {};
    if (!communityData.name.trim()) newErrors.name = "Community name is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmitCommunity(communityData);
    } finally {
      setIsSubmitting(false);
      resetForms();
    }
  };

  const resetForms = () => {
    setEventData({
      name: "",
      description: "",
      date: undefined,
      time: "",
      place: "",
      capacity: "",
    });
    setCommunityData({
      name: "",
      description: "",
    });
    setErrors({});
  };

  const formatDate = (date) => {
    if (!date) return "Select date";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl">Create New Content</DialogTitle>
          <DialogDescription>
            Choose between creating a new event or community. All fields marked with * are
            required.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2 h-14 bg-muted p-1 rounded-xl">
            <TabsTrigger
              value="event"
              className="flex items-center gap-2 data-[state=active]:bg-secondary data-[state=active]:text-primary rounded-lg h-12"
            >
              <Calendar className="h-4 w-4" />
              <span>Event</span>
            </TabsTrigger>
            <TabsTrigger
              value="community"
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg h-12"
            >
              <Users className="h-4 w-4" />
              <span>Community</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="event" className="mt-6">
            <form onSubmit={handleEventSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Event Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., AI Workshop 2025"
                  value={eventData.name}
                  onChange={(e) => {
                    setEventData({ ...eventData, name: e.target.value });
                    setErrors({ ...errors, name: "" });
                  }}
                  className={`h-12 ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the event..."
                  value={eventData.description}
                  onChange={(e) => {
                    setEventData({ ...eventData, description: e.target.value });
                    setErrors({ ...errors, description: "" });
                  }}
                  className={errors.description ? "border-red-500" : ""}
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date <span className="text-red-500">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left h-12 ${
                          errors.date ? "border-red-500" : ""
                        }`}
                      >
                        {formatDate(eventData.date)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={eventData.date}
                        onSelect={(date) => {
                          setEventData({ ...eventData, date });
                          setErrors({ ...errors, date: "" });
                        }}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && (
                    <p className="text-sm text-red-500">{errors.date}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">
                    Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={eventData.time}
                    onChange={(e) => {
                      setEventData({ ...eventData, time: e.target.value });
                      setErrors({ ...errors, time: "" });
                    }}
                    className={`h-12 ${errors.time ? "border-red-500" : ""}`}
                  />
                  {errors.time && (
                    <p className="text-sm text-red-500">{errors.time}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="place">
                  Place <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="place"
                  placeholder="e.g., Ibrahim Farg Building, Room 301"
                  value={eventData.place}
                  onChange={(e) => {
                    setEventData({ ...eventData, place: e.target.value });
                    setErrors({ ...errors, place: "" });
                  }}
                  className={`h-12 ${errors.place ? "border-red-500" : ""}`}
                />
                {errors.place && (
                  <p className="text-sm text-red-500">{errors.place}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="e.g., 100"
                  value={eventData.capacity}
                  onChange={(e) =>
                    setEventData({ ...eventData, capacity: e.target.value })
                  }
                  className="h-12"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                    resetForms();
                  }}
                  className="h-12 px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-secondary hover:bg-secondary/90 text-primary h-12 px-6"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="community" className="mt-6">
            <form onSubmit={handleCommunitySubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Community Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Data Science Club"
                  value={communityData.name}
                  onChange={(e) => {
                    setCommunityData({ ...communityData, name: e.target.value });
                    setErrors({ ...errors, name: "" });
                  }}
                  className={`h-12 ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="community-description">
                  Description
                </Label>
                <Textarea
                  id="community-description"
                  placeholder="Describe the community's mission and activities..."
                  value={communityData.description}
                  onChange={(e) => {
                    setCommunityData({ ...communityData, description: e.target.value });
                  }}
                  rows={4}
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                    resetForms();
                  }}
                  className="h-12 px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 text-white h-12 px-6"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Creating..." : "Create Community"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

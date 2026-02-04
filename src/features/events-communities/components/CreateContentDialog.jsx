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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function CreateContentDialog({
  open,
  onOpenChange,
  onSubmitEvent,
  onSubmitCommunity,
}) {
  const [activeTab, setActiveTab] = useState("event");

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    eventDate: undefined,
    eventTime: "",
    location: "",
    club: "",
    maxParticipants: "",
    tags: "",
  });

  const [communityData, setCommunityData] = useState({
    name: "",
    description: "",
    category: "",
    meetingSchedule: "",
    tags: "",
  });

  const [errors, setErrors] = useState({});

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!eventData.title.trim()) newErrors.title = "Event title is required";
    if (!eventData.description.trim()) newErrors.description = "Description is required";
    if (!eventData.eventDate) newErrors.eventDate = "Event date is required";
    if (eventData.eventDate && eventData.eventDate < new Date())
      newErrors.eventDate = "Event date must be in the future";
    if (!eventData.eventTime.trim()) newErrors.eventTime = "Event time is required";
    if (!eventData.location.trim()) newErrors.location = "Location is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmitEvent(eventData);
    resetForms();
  };

  const handleCommunitySubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!communityData.name.trim()) newErrors.name = "Community name is required";
    if (!communityData.description.trim())
      newErrors.description = "Description is required";
    if (!communityData.category) newErrors.category = "Category is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmitCommunity(communityData);
    resetForms();
  };

  const resetForms = () => {
    setEventData({
      title: "",
      description: "",
      eventDate: undefined,
      eventTime: "",
      location: "",
      club: "",
      maxParticipants: "",
      tags: "",
    });
    setCommunityData({
      name: "",
      description: "",
      category: "",
      meetingSchedule: "",
      tags: "",
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
                <Label htmlFor="title">
                  Event Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., AI Workshop 2025"
                  value={eventData.title}
                  onChange={(e) => {
                    setEventData({ ...eventData, title: e.target.value });
                    setErrors({ ...errors, title: "" });
                  }}
                  className={`h-12 ${errors.title ? "border-red-500" : ""}`}
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
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
                  <Label>Event Date <span className="text-red-500">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left h-12 ${
                          errors.eventDate ? "border-red-500" : ""
                        }`}
                      >
                        {formatDate(eventData.eventDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={eventData.eventDate}
                        onSelect={(date) => {
                          setEventData({ ...eventData, eventDate: date });
                          setErrors({ ...errors, eventDate: "" });
                        }}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.eventDate && (
                    <p className="text-sm text-red-500">{errors.eventDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventTime">
                    Event Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="eventTime"
                    placeholder="e.g., 10:00 AM - 4:00 PM"
                    value={eventData.eventTime}
                    onChange={(e) => {
                      setEventData({ ...eventData, eventTime: e.target.value });
                      setErrors({ ...errors, eventTime: "" });
                    }}
                    className={`h-12 ${errors.eventTime ? "border-red-500" : ""}`}
                  />
                  {errors.eventTime && (
                    <p className="text-sm text-red-500">{errors.eventTime}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Ibrahim Farg Building, Room 301"
                  value={eventData.location}
                  onChange={(e) => {
                    setEventData({ ...eventData, location: e.target.value });
                    setErrors({ ...errors, location: "" });
                  }}
                  className={`h-12 ${errors.location ? "border-red-500" : ""}`}
                />
                {errors.location && (
                  <p className="text-sm text-red-500">{errors.location}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="club">Club / Organization</Label>
                  <Input
                    id="club"
                    placeholder="e.g., AI Club"
                    value={eventData.club}
                    onChange={(e) => setEventData({ ...eventData, club: e.target.value })}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    placeholder="e.g., 100"
                    value={eventData.maxParticipants}
                    onChange={(e) =>
                      setEventData({ ...eventData, maxParticipants: e.target.value })
                    }
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-tags">Tags (comma-separated)</Label>
                <Input
                  id="event-tags"
                  placeholder="e.g., AI, Workshop, Tech"
                  value={eventData.tags}
                  onChange={(e) => setEventData({ ...eventData, tags: e.target.value })}
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
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="community-description"
                  placeholder="Describe the community's mission and activities..."
                  value={communityData.description}
                  onChange={(e) => {
                    setCommunityData({ ...communityData, description: e.target.value });
                    setErrors({ ...errors, description: "" });
                  }}
                  className={errors.description ? "border-red-500" : ""}
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={communityData.category}
                  onValueChange={(value) => {
                    setCommunityData({ ...communityData, category: value });
                    setErrors({ ...errors, category: "" });
                  }}
                >
                  <SelectTrigger
                    className={`h-12 ${errors.category ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Research">Research</SelectItem>
                    <SelectItem value="Creative">Creative</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">{errors.category}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetingSchedule">Meeting Schedule</Label>
                <Input
                  id="meetingSchedule"
                  placeholder="e.g., Every Monday at 6:00 PM"
                  value={communityData.meetingSchedule}
                  onChange={(e) =>
                    setCommunityData({ ...communityData, meetingSchedule: e.target.value })
                  }
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="community-tags">Tags (comma-separated)</Label>
                <Input
                  id="community-tags"
                  placeholder="e.g., Data Science, ML, Python"
                  value={communityData.tags}
                  onChange={(e) =>
                    setCommunityData({ ...communityData, tags: e.target.value })
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
                  className="bg-primary hover:bg-primary/90 text-white h-12 px-6"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Community
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

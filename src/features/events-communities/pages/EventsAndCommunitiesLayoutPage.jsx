import { useState } from "react";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { Home, Compass, Plus, UserCog } from "lucide-react";
import { EventsAndCommunitiesPage } from "../components/EventsAndCommunitiesPage";
import { CommunityDetailsPage } from "../components/CommunityDetailsPage";
import { AdminDashboard } from "../components/AdminDashboard";
import { CreateContentDialog } from "../components/CreateContentDialog";
import { mockEvents, mockCommunities, mockCurrentUser } from "../data/mockData";

export default function EventsAndCommunitiesLayoutPage() {
  const [events, setEvents] = useState(mockEvents);
  const [communities, setCommunities] = useState(mockCommunities);
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [userRole, setUserRole] = useState(
    mockCurrentUser.role === "admin" ? "admin" : "student"
  );

  const handleCreateEvent = (data) => {
    const newEvent = {
      id: `event-${Date.now()}`,
      type: "event",
      title: data.title,
      description: data.description,
      organizerName: mockCurrentUser.name,
      organizerId: mockCurrentUser.id,
      eventDate: data.eventDate,
      eventTime: data.eventTime,
      location: data.location,
      club: data.club || undefined,
      maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants, 10) : undefined,
      currentParticipants: 0,
      tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
      createdAt: new Date(),
    };
    setEvents([newEvent, ...events]);
    setIsCreateDialogOpen(false);
    toast.success("Event created successfully!", {
      description: "Your event has been posted to the platform.",
    });
  };

  const handleCreateCommunity = (data) => {
    const newCommunity = {
      id: `community-${Date.now()}`,
      type: "community",
      name: data.name,
      description: data.description,
      category: data.category,
      organizerName: mockCurrentUser.name,
      organizerId: mockCurrentUser.id,
      memberCount: 0,
      meetingSchedule: data.meetingSchedule || undefined,
      tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : [],
      createdAt: new Date(),
    };
    setCommunities([newCommunity, ...communities]);
    setIsCreateDialogOpen(false);
    toast.success("Community created successfully!", {
      description: "Your community has been posted to the platform.",
    });
  };

  const handleJoinEvent = (id) => {
    const event = events.find((e) => e.id === id);
    if (event) {
      setEvents(
        events.map((e) =>
          e.id === id
            ? { ...e, currentParticipants: e.currentParticipants + 1 }
            : e
        )
      );
      toast.success("Successfully joined!", {
        description: `You're now registered for "${event.title}".`,
      });
    }
  };

  const handleJoinCommunity = (id) => {
    const community = communities.find((c) => c.id === id);
    if (community) {
      setCommunities(
        communities.map((c) =>
          c.id === id ? { ...c, memberCount: c.memberCount + 1 } : c
        )
      );
      toast.success("Successfully joined!", {
        description: `You're now a member of "${community.name}".`,
      });
    }
  };

  const handleEditEvent = (id) => {
    toast.info("Edit functionality", {
      description: "Edit feature would be implemented here.",
    });
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((e) => e.id !== id));
    toast.success("Event deleted", {
      description: "The event has been removed from the platform.",
    });
  };

  const handleEditCommunity = (id) => {
    toast.info("Edit functionality", {
      description: "Edit feature would be implemented here.",
    });
  };

  const handleDeleteCommunity = (id) => {
    setCommunities(communities.filter((c) => c.id !== id));
    toast.success("Community deleted", {
      description: "The community has been removed from the platform.",
    });
  };

  const handleCommunityClick = (id) => {
    setSelectedCommunity(id);
  };

  const handleBackToCommunities = () => {
    setSelectedCommunity(null);
  };

  const getCommunityEvents = (communityId) => {
    const community = communities.find((c) => c.id === communityId);
    if (!community) return [];
    return events.filter((e) => e.club === community.name);
  };

  const handleToggleRole = () => {
    const newRole = userRole === "admin" ? "student" : "admin";
    setUserRole(newRole);
    toast.success(`Switched to ${newRole} view`, {
      description:
        newRole === "admin"
          ? "You can now create and manage content"
          : "You can now view and join content",
    });
  };

  const renderContent = () => {
    if (selectedCommunity) {
      const community = communities.find((c) => c.id === selectedCommunity);
      if (community) {
        return (
          <CommunityDetailsPage
            community={community}
            communityEvents={getCommunityEvents(selectedCommunity)}
            onBack={handleBackToCommunities}
            onJoinCommunity={handleJoinCommunity}
            onJoinEvent={handleJoinEvent}
            currentUserRole={userRole}
          />
        );
      }
    }

    switch (activeTab) {
      case "home":
        if (userRole === "admin") {
          return (
            <AdminDashboard
              events={events}
              communities={communities}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              onEditCommunity={handleEditCommunity}
              onDeleteCommunity={handleDeleteCommunity}
              onCreateClick={() => setIsCreateDialogOpen(true)}
            />
          );
        }
        return (
          <EventsAndCommunitiesPage
            events={events}
            communities={communities}
            onJoinEvent={handleJoinEvent}
            onJoinCommunity={handleJoinCommunity}
            onCommunityClick={handleCommunityClick}
            currentUserRole={userRole}
          />
        );
      case "events":
      case "communities":
      case "explore":
        return (
          <EventsAndCommunitiesPage
            events={events}
            communities={communities}
            onJoinEvent={handleJoinEvent}
            onJoinCommunity={handleJoinCommunity}
            onCommunityClick={handleCommunityClick}
            currentUserRole={userRole}
            initialTab={
              activeTab === "events"
                ? "events"
                : activeTab === "communities"
                  ? "communities"
                  : "events"
            }
          />
        );
      default:
        return (
          <EventsAndCommunitiesPage
            events={events}
            communities={communities}
            onJoinEvent={handleJoinEvent}
            onJoinCommunity={handleJoinCommunity}
            onCommunityClick={handleCommunityClick}
            currentUserRole={userRole}
          />
        );
    }
  };

  const eventsSubNav = (
    <div className="sticky top-16 z-40 -mt-16 flex items-center justify-between gap-4 border-b border-border bg-white px-4 py-3 shadow-sm md:px-6 lg:px-8">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setActiveTab("home")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "home"
              ? "bg-primary text-white"
              : "text-foreground hover:bg-muted"
          }`}
        >
          <Home className="h-4 w-4" />
          Home
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("explore")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "explore"
              ? "bg-primary text-white"
              : "text-foreground hover:bg-muted"
          }`}
        >
          <Compass className="h-4 w-4" />
          Explore
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleToggleRole}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          <UserCog className="h-4 w-4" />
          <span className="hidden sm:inline">{userRole === "admin" ? "Admin" : "Student"}</span>
        </button>
        {userRole === "admin" && (
          <button
            type="button"
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-primary hover:bg-secondary/90"
          >
            <Plus className="h-4 w-4" />
            Create
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {!selectedCommunity && eventsSubNav}

      <div className="relative z-10">{renderContent()}</div>

      <CreateContentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmitEvent={handleCreateEvent}
        onSubmitCommunity={handleCreateCommunity}
      />

      <Toaster richColors position="top-right" />
    </div>
  );
}

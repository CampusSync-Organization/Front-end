import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { Home, Compass, Plus, UserCog, CalendarDays } from "lucide-react";
import { EventsAndCommunitiesPage } from "../components/EventsAndCommunitiesPage";
import { CommunityDetailsPage } from "../components/CommunityDetailsPage";
import { AdminDashboard } from "../components/AdminDashboard";
import { CreateContentDialog } from "../components/CreateContentDialog";
import { mockCurrentUser } from "../data/mockData";
import { useEventStore } from "../store/useEventStore";
import { useNavigate } from "react-router-dom";

export default function EventsAndCommunitiesLayoutPage() {
  const navigate = useNavigate();
  const { 
    events, 
    communities, 
    fetchEvents, 
    fetchCommunities, 
    createEvent, 
    rsvpEvent, 
    cancelRsvpEvent,
    isLoadingEvents,
    isLoadingCommunities
  } = useEventStore();

  const [activeTab, setActiveTab] = useState("explore");
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [userRole, setUserRole] = useState(mockCurrentUser.role === "admin" ? "admin" : "student");

  // Fetch initial data
  useEffect(() => {
    fetchEvents();
    fetchCommunities();
  }, [fetchEvents, fetchCommunities]);

  const handleCreateEvent = async (data) => {
    await createEvent(data);
    setIsCreateDialogOpen(false);
  };

  const handleCreateCommunity = (data) => {
    // Optimistic or store logic for communities
    // Right now communities are static in this iteration, but can be added to store later
    toast.success("Community created successfully!", {
      description: "Your community has been posted to the platform.",
    });
    setIsCreateDialogOpen(false);
  };

  const handleJoinEvent = async (id) => {
    const event = events.find((e) => e.id === id);
    if (event) {
      if (event.attendees?.includes(mockCurrentUser.id)) {
        await cancelRsvpEvent(id);
      } else {
        await rsvpEvent(id);
      }
    }
  };

  const handleJoinCommunity = (id) => {
    toast.success("Successfully joined community!");
  };

  const handleEditEvent = (id) => {
    toast.info("Edit functionality", { description: "Edit feature would be implemented here." });
  };

  const handleDeleteEvent = (id) => {
    toast.success("Event deleted", { description: "The event has been removed from the platform." });
  };

  const handleEditCommunity = (id) => {
    toast.info("Edit functionality", { description: "Edit feature would be implemented here." });
  };

  const handleDeleteCommunity = (id) => {
    toast.success("Community deleted", { description: "The community has been removed from the platform." });
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
      description: newRole === "admin" ? "You can now create and manage content" : "You can now view and join content",
    });
  };

  const handleEventClick = (id) => {
    navigate(`/events/${id}`);
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
            isLoading={isLoadingEvents || isLoadingCommunities}
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
              isLoading={isLoadingEvents || isLoadingCommunities}
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
            onEventClick={handleEventClick}
            currentUserRole={userRole}
            isLoading={isLoadingEvents || isLoadingCommunities}
            currentUserId={mockCurrentUser.id}
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
            onEventClick={handleEventClick}
            currentUserRole={userRole}
            initialTab={
              activeTab === "events"
                ? "events"
                : activeTab === "communities"
                  ? "communities"
                  : "events"
            }
            isLoading={isLoadingEvents || isLoadingCommunities}
            currentUserId={mockCurrentUser.id}
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
            onEventClick={handleEventClick}
            currentUserRole={userRole}
            isLoading={isLoadingEvents || isLoadingCommunities}
            currentUserId={mockCurrentUser.id}
          />
        );
    }
  };

  const eventsSubNav = (
    <div className="sticky top-16 z-40 -mt-16 flex items-center justify-between gap-4 border-b border-border bg-white px-4 py-3 shadow-sm md:px-6 lg:px-8">
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex-shrink-0 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "home" ? "bg-primary text-white" : "text-foreground hover:bg-muted"
          }`}
        >
          <Home className="h-4 w-4" />
          Home
        </button>
        <button
          onClick={() => setActiveTab("explore")}
          className={`flex-shrink-0 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "explore" ? "bg-primary text-white" : "text-foreground hover:bg-muted"
          }`}
        >
          <Compass className="h-4 w-4" />
          Explore
        </button>
        <button
          onClick={() => navigate("/my-events")}
          className={`flex-shrink-0 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors text-foreground hover:bg-muted`}
        >
          <CalendarDays className="h-4 w-4" />
          My Events
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleToggleRole}
          className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          <UserCog className="h-4 w-4" />
          <span className="hidden sm:inline">{userRole === "admin" ? "Admin" : "Student"}</span>
        </button>
        {userRole === "admin" && (
          <button
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

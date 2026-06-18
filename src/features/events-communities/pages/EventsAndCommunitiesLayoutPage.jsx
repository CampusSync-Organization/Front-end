import { useState, useEffect } from "react";
import { Home, Compass, Plus, CalendarDays } from "lucide-react";
import { EventsAndCommunitiesPage } from "../components/EventsAndCommunitiesPage";
import { CommunityDetailsPage } from "../components/CommunityDetailsPage";
import { AdminDashboard } from "../components/AdminDashboard";
import { CreateContentDialog } from "../components/CreateContentDialog";
import EditEventDialog from "../components/EditEventDialog";
import { useEventStore } from "../store/useEventStore";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function EventsAndCommunitiesLayoutPage() {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth?.user);
  const {
    events,
    communities,
    fetchEvents,
    fetchCommunities,
    createEvent,
    createCommunity,
    rsvpEvent,
    cancelRsvpEvent,
    updateEvent,
    deleteEvent,
    deleteCommunity,
    updateCommunity,
    fetchCommunity,
    fetchCommunityMemberView,
    isLoadingEvents,
    isLoadingCommunities
  } = useEventStore();

  const [activeTab, setActiveTab] = useState("explore");
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const isModerator = authUser?.role === "moderator" || authUser?.role === "admin";
  const userRole = isModerator ? "admin" : "student";

  // Fetch initial data
  useEffect(() => {
    fetchEvents();
    fetchCommunities();
  }, [fetchEvents, fetchCommunities]);

  const handleCreateEvent = async (data) => {
    await createEvent(data);
    setIsCreateDialogOpen(false);
  };

  const handleCreateCommunity = async (data) => {
    try {
      await createCommunity({ name: data.name, description: data.description });
      setIsCreateDialogOpen(false);
    } catch {
      // error toast is handled by the store
    }
  };

  const handleJoinEvent = async (id) => {
    const event = events.find((e) => e.id === id);
    if (event) {
      if (event.isAttending) {
        await cancelRsvpEvent(id);
      } else {
        await rsvpEvent(id);
      }
    }
  };

  const handleJoinCommunity = async (id) => {
    const community = communities.find((c) => c.id === id);
    if (community?.isJoined) {
      await useEventStore.getState().leaveCommunity(id);
    } else {
      await useEventStore.getState().joinCommunity(id);
    }
  };

  const handleEditEvent = (id) => {
    const event = events.find((e) => e.id === id);
    if (event) setEditingEvent(event);
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await deleteEvent(id);
  };

  const handleEditCommunity = async (id, data) => {
    try {
      await updateCommunity(id, data);
    } catch {
      // error toast is handled by the store
    }
  };

  const handleDeleteCommunity = async (id) => {
    try {
      await deleteCommunity(id);
      if (selectedCommunity === id) {
        setSelectedCommunity(null);
      }
    } catch {
      // error toast is handled by the store
    }
  };

  const handleCommunityClick = async (id) => {
    setSelectedCommunity(id);
    try {
      await fetchCommunityMemberView(id);
    } catch {
      // Not a member/moderator — load public view instead
      try {
        await fetchCommunity(id);
      } catch {
        // Keep whatever data is already in the store
      }
    }
  };

  const handleBackToCommunities = () => {
    setSelectedCommunity(null);
  };

  const getCommunityEvents = (communityId) => {
    const community = communities.find((c) => c.id === communityId);
    if (!community) return [];
    return events.filter((e) => e.club === community.name);
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
            currentUserId={authUser?.userID ?? authUser?.id}
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
            currentUserId={authUser?.userID ?? authUser?.id}
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
            currentUserId={authUser?.userID ?? authUser?.id}
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
      {isModerator && (
        <button
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-primary hover:bg-secondary/90"
        >
          <Plus className="h-4 w-4" />
          Create
        </button>
      )}
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

      {editingEvent && (
        <EditEventDialog
          event={editingEvent}
          open={!!editingEvent}
          onOpenChange={(v) => { if (!v) setEditingEvent(null); }}
          onSave={async (data) => {
            await updateEvent(editingEvent.id, data);
            setEditingEvent(null);
          }}
        />
      )}
    </div>
  );
}

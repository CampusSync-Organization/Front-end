import { useState, useEffect } from "react";
import { useEventStore } from "../store/useEventStore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, CalendarDays, LayoutList, 
  CalendarCheck, CalendarPlus
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { EventCard, EventCardSkeleton } from "../components/EventCard";

export default function MyEventsPage() {
  const navigate = useNavigate();
  const { 
    events, 
    fetchEvents, 
    rsvpEvent, 
    cancelRsvpEvent, 
    isLoadingEvents,
    currentUser 
  } = useEventStore();
  
  const [activeTab, setActiveTab] = useState("attending");

  useEffect(() => {
    if (events.length === 0) {
      fetchEvents();
    }
  }, [events.length, fetchEvents]);

  // Derived state
  const attendingEvents = events.filter(e => e.attendees?.includes(currentUser.id));
  const createdEvents = events.filter(e => e.organizerId === currentUser.id);

  const handleJoinEvent = async (id) => {
    const event = events.find((e) => e.id === id);
    if (event) {
      if (event.attendees?.includes(currentUser.id)) {
        await cancelRsvpEvent(id);
      } else {
        await rsvpEvent(id);
      }
    }
  };

  const handleEventClick = (id) => {
    navigate(`/events/${id}`);
  };

  const renderEventGrid = (eventList, emptyMessage, emptySubMessage, EmptyIcon) => {
    return (
      <AnimatePresence mode="wait">
        {isLoadingEvents ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {eventList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventList.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <EventCard
                      event={event}
                      currentUserId={currentUser.id}
                      currentUserRole={currentUser.role === "admin" ? "admin" : "student"}
                      onJoinEvent={handleJoinEvent}
                      onEventClick={handleEventClick}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 bg-white rounded-3xl border border-border mt-4"
              >
                <EmptyIcon className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="text-xl mb-2 font-medium">{emptyMessage}</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                  {emptySubMessage}
                </p>
                <Button onClick={() => navigate("/events-communities")} variant="outline">
                  Browse Events
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-foreground -ml-2 rounded-xl"
            onClick={() => navigate("/events-communities")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2 text-primary font-medium">
            <CalendarDays className="h-5 w-5" />
            My Events
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-foreground">
            Manage Your Calendar
          </h1>
          <p className="text-lg text-muted-foreground">
            View the events you're attending and manage those you've organized.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="mb-8">
            <TabsList className="inline-flex h-14 items-center justify-center rounded-2xl bg-white border border-border p-1 shadow-sm">
              <TabsTrigger
                value="attending"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <CalendarCheck className="h-4 w-4 mr-2" />
                Attending
                <span className="ml-2 bg-muted text-muted-foreground data-[state=active]:bg-white/20 data-[state=active]:text-white py-0.5 px-2 rounded-md text-xs">
                  {attendingEvents.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="created"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <CalendarPlus className="h-4 w-4 mr-2" />
                Organizing
                <span className="ml-2 bg-muted text-muted-foreground data-[state=active]:bg-white/20 data-[state=active]:text-white py-0.5 px-2 rounded-md text-xs">
                  {createdEvents.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="attending" className="mt-0 outline-none">
            {renderEventGrid(
              attendingEvents, 
              "No upcoming events", 
              "You haven't RSVP'd to any events yet. Explore the campus calendar to find what's happening.",
              LayoutList
            )}
          </TabsContent>

          <TabsContent value="created" className="mt-0 outline-none">
            {renderEventGrid(
              createdEvents, 
              "You haven't organized any events", 
              "Events you create as an admin or organization leader will appear here.",
              CalendarPlus
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

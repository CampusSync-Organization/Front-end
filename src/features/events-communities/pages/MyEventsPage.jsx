import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useEventStore } from "../store/useEventStore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CalendarDays, LayoutList,
  CalendarCheck, CalendarPlus, Edit2, Trash2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { EventCard, EventCardSkeleton } from "../components/EventCard";
import EditEventDialog from "../components/EditEventDialog";

export default function MyEventsPage() {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth?.user);
  const currentUserId = authUser?.userID ?? authUser?.id;
  const isModerator = authUser?.role === "moderator" || authUser?.role === "admin";

  const { events, fetchEvents, rsvpEvent, cancelRsvpEvent, updateEvent, deleteEvent, isLoadingEvents } = useEventStore();

  const [activeTab, setActiveTab] = useState("attending");
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const attendingEvents = events.filter((e) => e.isAttending);
  const createdEvents = events.filter((e) => Number(e.organizerId) === Number(currentUserId));

  const handleJoinEvent = async (id) => {
    const event = events.find((e) => e.id === id);
    if (!event) return;
    if (event.isAttending) await cancelRsvpEvent(id);
    else await rsvpEvent(id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await deleteEvent(id);
  };

  const handleEditSave = async (data) => {
    if (!editingEvent) return;
    await updateEvent(editingEvent.id, data);
    setEditingEvent(null);
  };

  const renderAttendingGrid = (eventList, emptyMessage, emptySubMessage, EmptyIcon) => (
    <AnimatePresence mode="wait">
      {isLoadingEvents ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <EventCardSkeleton key={i} />)}
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
                <motion.div key={event.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                  <EventCard
                    event={event}
                    currentUserId={currentUserId}
                    currentUserRole="student"
                    onJoinEvent={handleJoinEvent}
                    onEventClick={(id) => navigate(`/events/${id}`)}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white rounded-3xl border border-border mt-4">
              <EmptyIcon className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-xl mb-2 font-medium">{emptyMessage}</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">{emptySubMessage}</p>
              <Button onClick={() => navigate("/events-communities")} variant="outline">Browse Events</Button>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderOrganizerGrid = (eventList) => (
    <AnimatePresence mode="wait">
      {isLoadingEvents ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <EventCardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div
          key="created"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {eventList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventList.map((event) => (
                <motion.div key={event.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="relative group">
                  <EventCard
                    event={event}
                    currentUserId={currentUserId}
                    currentUserRole="admin"
                    onJoinEvent={() => {}}
                    onEventClick={(id) => navigate(`/events/${id}`)}
                  />
                  {/* Edit/Delete overlay buttons */}
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingEvent(event); }}
                      className="w-8 h-8 rounded-lg bg-white shadow-md flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(event.id); }}
                      className="w-8 h-8 rounded-lg bg-white shadow-md flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-white rounded-3xl border border-border mt-4">
              <CalendarPlus className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-xl mb-2 font-medium">No events organized yet</h3>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                Events you create will appear here.
              </p>
              {isModerator && (
                <Button onClick={() => navigate("/events-communities")} variant="outline">Create an Event</Button>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground -ml-2 rounded-xl" onClick={() => navigate("/events-communities")}>
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
                <span className="ml-2 bg-muted text-muted-foreground py-0.5 px-2 rounded-md text-xs">
                  {attendingEvents.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="created"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <CalendarPlus className="h-4 w-4 mr-2" />
                Organizing
                <span className="ml-2 bg-muted text-muted-foreground py-0.5 px-2 rounded-md text-xs">
                  {createdEvents.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="attending" className="mt-0 outline-none">
            {renderAttendingGrid(
              attendingEvents,
              "No upcoming events",
              "You haven't RSVP'd to any events yet. Explore the campus calendar to find what's happening.",
              LayoutList
            )}
          </TabsContent>

          <TabsContent value="created" className="mt-0 outline-none">
            {renderOrganizerGrid(createdEvents)}
          </TabsContent>
        </Tabs>
      </div>

      {editingEvent && (
        <EditEventDialog
          event={editingEvent}
          open={!!editingEvent}
          onOpenChange={(v) => { if (!v) setEditingEvent(null); }}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}

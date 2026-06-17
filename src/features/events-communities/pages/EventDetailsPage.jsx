import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEventStore } from "../store/useEventStore";
import { motion } from "framer-motion";
import {
  Calendar, Clock, MapPin, ArrowLeft,
  Share2, AlertCircle, User, Edit2, Trash2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import EditEventDialog from "../components/EditEventDialog";

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth?.user);
  const currentUserId = authUser?.userID ?? authUser?.id;
  const isModerator = authUser?.role === "moderator" || authUser?.role === "admin";

  const {
    events,
    fetchEvents,
    fetchEventById,
    rsvpEvent,
    cancelRsvpEvent,
    updateEvent,
    deleteEvent,
    isLoadingEvents,
  } = useEventStore();

  const [localEvent, setLocalEvent] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const load = async () => {
      setIsFetching(true);
      // Try fetching fresh from API first
      const fresh = await fetchEventById(eventId);
      if (fresh) {
        setLocalEvent(fresh);
      } else {
        // Fall back to store
        if (events.length === 0) await fetchEvents();
        const found = events.find((e) => String(e.id) === String(eventId));
        setLocalEvent(found ?? null);
      }
      setIsFetching(false);
    };
    load();
  }, [eventId]);

  // Keep local state in sync when store updates (e.g. after RSVP)
  useEffect(() => {
    const storeEvent = events.find((e) => String(e.id) === String(eventId));
    if (storeEvent) setLocalEvent(storeEvent);
  }, [events, eventId]);

  const event = localEvent;
  const isAttending = event?.isAttending ?? false;
  const isFull = event?.maxParticipants ? event.currentParticipants >= event.maxParticipants : false;
  const capacityPercentage = event?.maxParticipants
    ? (event.currentParticipants / event.maxParticipants) * 100
    : 0;
  const isOrganizer = event && (isModerator || Number(event.organizerId) === Number(currentUserId));

  if (isFetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <AlertCircle className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
        <h2 className="text-2xl font-semibold mb-2">Event Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/events-communities")} variant="outline" className="rounded-xl">
          Back to Events
        </Button>
      </div>
    );
  }

  const handleRsvpClick = async () => {
    if (isAttending) {
      await cancelRsvpEvent(event.id);
    } else if (!isFull) {
      await rsvpEvent(event.id);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    setIsDeleting(true);
    await deleteEvent(event.id);
    navigate("/events-communities");
  };

  const handleEditSave = async (data) => {
    await updateEvent(event.id, data);
    setIsEditOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Nav */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-[1000px] mx-auto px-6 h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            className="flex items-center gap-2 -ml-3 text-muted-foreground hover:text-foreground rounded-xl"
            onClick={() => navigate("/events-communities")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Events</span>
          </Button>

          <div className="flex items-center gap-2">
            {isOrganizer && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-black/5 text-muted-foreground"
                  onClick={() => setIsEditOpen(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isDeleting}
                  className="rounded-full hover:bg-red-50 text-muted-foreground hover:text-red-600"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-black/5 text-muted-foreground"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 py-10 lg:py-16">
        {/* Title & Meta */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0 rounded-lg px-3 py-1 font-medium shadow-none">
              EVENT
            </Badge>
            {event.club && (
              <Badge className="bg-secondary/10 text-secondary border-0 rounded-lg px-3 py-1 font-medium shadow-none">
                {event.club}
              </Badge>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
            {event.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-muted-foreground font-medium text-[15px]">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>
                {event.eventDate
                  ? new Date(event.eventDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </span>
            </div>
            {event.eventTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>{event.eventTime}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="w-full aspect-[16/9] bg-gradient-to-br from-muted/50 to-muted rounded-[32px] overflow-hidden flex flex-col items-center justify-center border border-border/50 shadow-sm"
            >
              <Calendar className="h-24 w-24 text-muted-foreground/20" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-2xl font-semibold mb-6 text-foreground">About This Event</h2>
              <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {event.description}
              </p>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4 space-y-6 lg:sticky lg:top-28"
          >
            {/* RSVP Card */}
            <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-black/5 border border-border/50">
              {event.maxParticipants && (
                <div className="mb-6">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[15px] font-semibold text-foreground">Capacity</span>
                    <span className="text-sm font-medium text-muted-foreground">
                      {event.currentParticipants} / {event.maxParticipants}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${capacityPercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${capacityPercentage >= 95 ? "bg-red-500" : "bg-primary"}`}
                    />
                  </div>
                </div>
              )}

              {!isOrganizer && (
                <Button
                  onClick={handleRsvpClick}
                  disabled={!isAttending && isFull}
                  variant={isAttending ? "outline" : "default"}
                  className={`w-full h-14 text-base font-semibold rounded-2xl transition-all ${
                    isAttending
                      ? "border-border text-foreground hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                  }`}
                >
                  {isAttending ? "Cancel RSVP" : isFull ? "Event Full" : "RSVP Now"}
                </Button>
              )}

              {isOrganizer && (
                <Button
                  onClick={() => setIsEditOpen(true)}
                  className="w-full h-14 text-base font-semibold rounded-2xl bg-secondary hover:bg-secondary/90 text-primary"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Event
                </Button>
              )}
            </div>

            {/* Organizer */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-border/50 flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xl font-bold text-primary">
                  {event.organizerName?.charAt(0) ?? "?"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Organized by</p>
                <p className="text-base font-semibold text-foreground">{event.organizerName}</p>
                {event.club && <p className="text-sm text-primary font-medium">{event.club}</p>}
              </div>
            </div>

            {/* Attendees */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Attendees</h3>
                <span className="text-sm font-medium border border-border rounded-full px-3 py-1 bg-muted/30">
                  {event.currentParticipants}
                </span>
              </div>

              {Array.isArray(event.attendees) && event.attendees.length > 0 ? (
                <div className="space-y-2">
                  {event.attendees.slice(0, 8).map((a, i) => (
                    <div key={a.id ?? i} className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {(a.name ?? "?").charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{a.name ?? `User ${a.id}`}</span>
                    </div>
                  ))}
                  {event.attendees.length > 8 && (
                    <p className="text-xs text-muted-foreground pt-1">
                      +{event.attendees.length - 8} more
                    </p>
                  )}
                </div>
              ) : event.currentParticipants > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: Math.min(event.currentParticipants, 14) }).map((_, i) => (
                    <div
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-white bg-muted flex items-center justify-center shadow-sm"
                    >
                      <User className="h-4 w-4 text-muted-foreground/50" />
                    </div>
                  ))}
                  {event.currentParticipants > 14 && (
                    <div className="h-10 w-10 rounded-full border-2 border-white bg-background flex items-center justify-center shadow-sm border-dashed">
                      <span className="text-xs font-semibold text-muted-foreground">
                        +{event.currentParticipants - 14}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Be the first to RSVP!</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {isEditOpen && (
        <EditEventDialog
          event={event}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          onSave={handleEditSave}
        />
      )}
    </div>
  );
}

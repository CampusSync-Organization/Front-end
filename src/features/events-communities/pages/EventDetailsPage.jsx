import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEventStore } from "../store/useEventStore";
import { getEventAttendees } from "../api/eventApi";
import { motion } from "framer-motion";
import {
  Calendar, Clock, MapPin, ArrowLeft,
  Share2, AlertCircle, Users, Edit2, Trash2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import EditEventDialog from "../components/EditEventDialog";

function AttendeeAvatar({ name, id }) {
  const label = name ? name.charAt(0).toUpperCase() : "?";
  const displayName = name ?? `User ${id ?? "?"}`;
  return (
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <span className="text-xs font-bold text-primary">{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground">{displayName}</span>
    </div>
  );
}

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
  } = useEventStore();

  const [localEvent, setLocalEvent] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [attendees, setAttendees] = useState(null);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const load = async () => {
      setIsFetching(true);
      const fresh = await fetchEventById(eventId);
      if (fresh) {
        setLocalEvent(fresh);
      } else {
        if (events.length === 0) await fetchEvents();
        const found = events.find((e) => String(e.id) === String(eventId));
        setLocalEvent(found ?? null);
      }
      setIsFetching(false);

      setLoadingAttendees(true);
      try {
        const data = await getEventAttendees(eventId);
        setAttendees(Array.isArray(data) ? data : data?.attendees ?? null);
      } catch {
        setAttendees(null);
      } finally {
        setLoadingAttendees(false);
      }
    };
    load();
  }, [eventId]);

  useEffect(() => {
    const storeEvent = events.find((e) => String(e.id) === String(eventId));
    if (storeEvent) setLocalEvent(storeEvent);
  }, [events, eventId]);

  const event = localEvent;
  const isAttending = event?.isAttending ?? false;
  const isFull = event?.maxParticipants ? event.currentParticipants >= event.maxParticipants : false;
  const capacityPercentage = event?.maxParticipants
    ? Math.min((event.currentParticipants / event.maxParticipants) * 100, 100)
    : 0;
  const isOrganizer = event && (isModerator || Number(event.organizerId) === Number(currentUserId));

  const displayAttendees = attendees ?? (Array.isArray(event?.attendees) && event.attendees.some((a) => a?.name) ? event.attendees : null);
  const attendeeCount = attendees?.length ?? event?.currentParticipants ?? 0;

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

  const formattedDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex flex-wrap gap-2 mb-5">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0 rounded-lg px-3 py-1 font-medium shadow-none">
              EVENT
            </Badge>
            {event.club && (
              <Badge className="bg-secondary/10 text-secondary border-0 rounded-lg px-3 py-1 font-medium shadow-none">
                {event.club}
              </Badge>
            )}
            {event.tags?.map((tag) => (
              <Badge key={tag} className="bg-muted text-muted-foreground border-0 rounded-lg px-3 py-1 font-medium shadow-none">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
            {event.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-muted-foreground font-medium text-[15px]">
            {formattedDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>{formattedDate}</span>
              </div>
            )}
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Banner image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="w-full aspect-[16/9] rounded-[28px] overflow-hidden border border-border/50 shadow-sm bg-muted"
            >
              {event.imageUrl ? (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/8 to-secondary/10">
                  <Calendar className="h-16 w-16 text-primary/20 mb-3" />
                  {formattedDate && (
                    <span className="text-sm font-semibold text-muted-foreground/60">{formattedDate}</span>
                  )}
                </div>
              )}
            </motion.div>

            {/* Description */}
            {event.description && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">About This Event</h2>
                <p className="text-[16px] leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {event.description}
                </p>
              </motion.div>
            )}

            {/* Location detail */}
            {event.location && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Location</h2>
                <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-border/50">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-[15px] text-foreground font-medium">{event.location}</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4 space-y-5 lg:sticky lg:top-28"
          >
            {/* RSVP Card */}
            <div className="bg-white rounded-[28px] p-6 shadow-xl shadow-black/5 border border-border/50">
              {event.maxParticipants && (
                <div className="mb-5">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[14px] font-semibold text-foreground">Spots</span>
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
                  {isFull && (
                    <p className="text-xs text-red-500 font-semibold mt-1.5">This event is full</p>
                  )}
                </div>
              )}

              {!isOrganizer ? (
                <Button
                  onClick={handleRsvpClick}
                  disabled={!isAttending && isFull}
                  variant={isAttending ? "outline" : "default"}
                  className={`w-full h-13 text-base font-semibold rounded-2xl transition-all ${
                    isAttending
                      ? "border-border text-foreground hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                  }`}
                >
                  {isAttending ? "Cancel RSVP" : isFull ? "Event Full" : "RSVP Now"}
                </Button>
              ) : (
                <Button
                  onClick={() => setIsEditOpen(true)}
                  className="w-full h-13 text-base font-semibold rounded-2xl bg-secondary hover:bg-secondary/90 text-primary"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Event
                </Button>
              )}
            </div>

            {/* Organizer */}
            <div className="bg-white rounded-[28px] p-5 shadow-sm border border-border/50 flex items-center gap-4">
              <div className="h-13 w-13 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xl font-bold text-primary">
                {(event.organizerName ?? "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-0.5 uppercase tracking-wide">Organized by</p>
                <p className="text-[15px] font-bold text-foreground">{event.organizerName}</p>
                {event.club && <p className="text-sm text-primary font-medium">{event.club}</p>}
              </div>
            </div>

            {/* Attendees */}
            <div className="bg-white rounded-[28px] p-5 shadow-sm border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-foreground">Attendees</h3>
                </div>
                <span className="text-sm font-semibold bg-primary/8 text-primary rounded-full px-3 py-0.5">
                  {attendeeCount}
                </span>
              </div>

              {loadingAttendees ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="h-9 w-9 rounded-full bg-muted shrink-0" />
                      <div className="h-4 w-28 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              ) : displayAttendees && displayAttendees.length > 0 ? (
                <div className="space-y-2.5">
                  {displayAttendees.slice(0, 8).map((a, i) => (
                    <AttendeeAvatar key={a.id ?? i} name={a.name ?? a.full_name ?? a.username} id={a.id} />
                  ))}
                  {displayAttendees.length > 8 && (
                    <p className="text-xs text-muted-foreground pt-1 font-medium">
                      +{displayAttendees.length - 8} more attendees
                    </p>
                  )}
                </div>
              ) : attendeeCount > 0 ? (
                <p className="text-sm text-muted-foreground">
                  {attendeeCount} {attendeeCount === 1 ? "person" : "people"} attending
                </p>
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

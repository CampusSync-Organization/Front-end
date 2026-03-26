import { Calendar, Clock, MapPin } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

export function EventCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-border bg-white rounded-2xl h-full flex flex-col animate-pulse">
      <div className="h-[72px] bg-muted/50 border-b border-border/10" />
      <div className="p-6 flex-1 flex flex-col">
        <div className="h-6 w-3/4 bg-muted/60 rounded mb-3" />
        <div className="h-4 w-1/3 bg-muted/40 rounded mb-4" />
        <div className="space-y-2 mb-6">
          <div className="h-4 w-full bg-muted/40 rounded" />
          <div className="h-4 w-5/6 bg-muted/40 rounded" />
        </div>
        <div className="space-y-3 mb-6">
          <div className="h-4 w-1/2 bg-muted/40 rounded" />
          <div className="h-4 w-2/3 bg-muted/40 rounded" />
        </div>
        <div className="h-[70px] w-full bg-muted/30 rounded-xl mt-auto" />
      </div>
    </Card>
  );
}

export function EventCard({ 
  event, 
  currentUserId, 
  currentUserRole, 
  onJoinEvent, 
  onEventClick 
}) {
  const isAttending = event.attendees?.includes(currentUserId);
  const isFull = event.maxParticipants ? event.currentParticipants >= event.maxParticipants : false;
  const capacityPercentage = event.maxParticipants
    ? (event.currentParticipants / event.maxParticipants) * 100
    : 0;

  return (
    <Card 
      onClick={() => onEventClick?.(event.id)}
      className="group overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-white rounded-2xl h-full flex flex-col cursor-pointer"
    >
      <div className="relative bg-gradient-to-br from-secondary/20 to-secondary/10 p-6 border-b border-border/10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 bg-primary/90 text-white px-3 py-1.5 rounded-lg text-sm">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(event.eventDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </div>
          {event.tags && event.tags[0] && (
            <Badge variant="secondary" className="bg-white/90">
              {event.tags[0]}
            </Badge>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        {event.club && (
          <p className="text-sm text-primary mb-3">{event.club}</p>
        )}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-foreground/80">{event.eventTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-foreground/80 line-clamp-1">
              {event.location}
            </span>
          </div>
        </div>

        {event.maxParticipants && (
          <div className="mb-4 p-3 bg-muted/50 rounded-xl">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground">Capacity</span>
              <span className="text-foreground">
                {event.currentParticipants} / {event.maxParticipants}
              </span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${capacityPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full ${
                  capacityPercentage >= 90 ? "bg-destructive" : "bg-primary"
                }`}
              />
            </div>
          </div>
        )}

        {currentUserRole === "student" && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onJoinEvent(event.id);
            }}
            disabled={!isAttending && isFull}
            variant={isAttending ? "outline" : "default"}
            className={`w-full mt-auto h-11 rounded-xl transition-all ${
              isAttending 
              ? "border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-white" 
              : "bg-primary hover:bg-primary/90 text-white"
            }`}
          >
            {isAttending ? "Cancel RSVP" : (isFull ? "Event Full" : "RSVP Now")}
          </Button>
        )}
      </div>
    </Card>
  );
}

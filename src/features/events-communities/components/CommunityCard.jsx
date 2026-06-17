import { Users, Calendar, Lock, Globe } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function CommunityCard({ community, isJoined, isModerator, onJoinToggle, onClick, currentUserRole }) {
  const isPrivate = community.privacy === "private";

  return (
    <Card
      className="group overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer bg-white rounded-2xl flex flex-col h-full"
      onClick={() => onClick?.(community.id)}
    >
      <div className="relative bg-gradient-to-br from-secondary/20 to-secondary/10 p-6 border-b border-border/10">
        <div className="flex items-start justify-between">
          <div className="w-14 h-14 bg-primary/90 rounded-xl flex items-center justify-center shadow-sm">
            <Users className="h-7 w-7 text-white" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className="bg-primary/90 text-white shadow-none font-medium px-3">
              {community.category}
            </Badge>
            <Badge variant="outline" className={`shadow-none flex items-center gap-1.5 px-3 py-1 font-medium ${isPrivate ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
              {isPrivate ? <Lock className="w-3 h-3"/> : <Globe className="w-3 h-3"/>}
              {isPrivate ? "Private" : "Public"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2 line-clamp-1 group-hover:text-primary transition-colors text-foreground">
          {community.name}
        </h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground mb-5 line-clamp-2 flex-grow">
          {community.description}
        </p>

        {community.meetingSchedule && (
          <div className="flex items-center gap-2.5 mb-5 text-sm font-medium">
            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <span className="text-muted-foreground line-clamp-1">
              {community.meetingSchedule}
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {community.tags?.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-muted/30 text-muted-foreground border-border/50 py-1 px-2.5 rounded-lg">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-border/50 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">{community.memberCount}</p>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Members</p>
            </div>
          </div>
          {isModerator ? (
            <Badge className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-xl text-sm font-semibold">
              Moderator
            </Badge>
          ) : (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onJoinToggle?.(community.id, isJoined, isPrivate);
              }}
              variant={isJoined ? "outline" : (isPrivate ? "secondary" : "default")}
              className={`rounded-xl px-5 h-10 text-sm font-semibold transition-all ${isJoined ? 'text-foreground hover:bg-red-50 hover:text-red-600 border-border hover:border-red-200 bg-transparent shadow-none' : (isPrivate ? 'bg-muted text-foreground hover:bg-muted/80' : 'bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20')}`}
            >
              {isJoined ? "Leave" : (isPrivate ? "Request to Join" : "Join Now")}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

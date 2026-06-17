import {
  Users,
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Share2,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useEventStore } from "../store/useEventStore";
import { useSelector } from "react-redux";
import { PostCard } from "./PostCard";
import { PostForm } from "./PostForm";
import { getProfileByUserId } from "../../profile/api/profileApi";

export function CommunityDetailsPage({
  community,
  communityEvents,
  onBack,
  onJoinEvent,
  currentUserRole,
}) {
  const { currentUser, joinCommunity, leaveCommunity, fetchCommunityMemberView, deleteCommunity } = useEventStore();
  const authUser = useSelector((state) => state.auth?.user);
const currentUserId = authUser?.userID ?? authUser?.id ?? currentUser?.userID ?? currentUser?.id;
  const isJoined = community.isJoined;
  const isModerator = currentUserId != null && Number(currentUserId) === Number(community.moderatorId);

  const [leaderName, setLeaderName] = useState(community.organizerName || "");

  useEffect(() => {
    if (community.moderatorId) {
      getProfileByUserId(community.moderatorId)
        .then((profile) => setLeaderName(profile.name || "Unknown"))
        .catch(() => setLeaderName("Unknown"));
    }
  }, [community.moderatorId]);


  const handleDelete = async () => {
    if (!window.confirm(`Delete "${community.name}"? This cannot be undone.`)) return;
    await deleteCommunity(community.id);
    onBack();
  };

  const handleJoinToggle = async () => {
    if (isJoined) {
      await leaveCommunity(community.id);
    } else {
      await joinCommunity(community.id);
      try {
        await fetchCommunityMemberView(community.id);
      } catch {}
    }
  };

  const realPosts = community.posts || [];

  const handleCreatePost = async (content) => {
    // Posts would be created via a dedicated post API endpoint.
    // For now this is a placeholder until the post creation endpoint is available.
  };

  const members = community.membersList?.length > 0
    ? community.membersList.map((m) => ({
        id: m.id,
        name: m.name || "Unknown",
        role: m.id === community.moderatorId ? "Admin" : "Member",
      }))
    : [];

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
      <Button
        variant="outline"
        onClick={onBack}
        className="mb-6 gap-2 rounded-xl border-2 hover:bg-muted"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Communities
      </Button>

      <Card className="overflow-hidden mb-8 border-2 border-border shadow-lg rounded-2xl bg-white">
        <div className="relative bg-secondary/20 p-12 md:p-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full -ml-24 -mb-24" />

          <div className="relative">
            <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center shadow-xl mb-6">
              <Users className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <Badge className="mb-4 bg-primary text-white border-0 px-4 py-2 text-sm">
                {community.category}
              </Badge>

              <h1 className="text-4xl md:text-5xl text-foreground mb-4">{community.name}</h1>

              <div className="flex flex-wrap gap-6 text-muted-foreground mb-6">
                <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-xl">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm">{community.memberCount} members</span>
                </div>
                {community.meetingSchedule && (
                  <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-xl">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-sm">{community.meetingSchedule}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {community.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-muted/50 border-border text-foreground px-3 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-xl border-2 hover:bg-muted"
              >
                <Share2 className="h-5 w-5" />
              </Button>
              {isModerator ? (
                <Button
                  onClick={handleDelete}
                  variant="outline"
                  className="h-12 px-8 rounded-xl border-2 text-destructive border-destructive/30 hover:bg-red-50 hover:border-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Community
                </Button>
              ) : (
                <Button
                  onClick={handleJoinToggle}
                  variant={isJoined ? "outline" : "default"}
                  className={
                    isJoined
                      ? "h-12 px-8 rounded-xl border-2 text-foreground hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                      : "bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-xl shadow-lg transition-colors"
                  }
                >
                  {isJoined ? "Leave Community" : "Join Community"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white border-2 border-border rounded-xl p-1">
          <TabsTrigger
            value="overview"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-6"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="posts"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-6"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-6"
          >
            Events
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white px-6"
          >
            Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-8 border-2 border-border shadow-sm rounded-2xl bg-white">
            <h2 className="text-2xl text-foreground mb-4">About</h2>
            <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
              {community.description}
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Join our community to connect with like-minded individuals, participate in exciting
              events, and grow your skills together.
            </p>
          </Card>

          <Card className="p-8 border-2 border-border shadow-sm rounded-2xl bg-white">
            <h2 className="text-2xl text-foreground mb-6">Community Leader</h2>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 bg-primary">
                <AvatarFallback className="bg-primary text-white text-lg">
                  {(leaderName || "")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg text-foreground">{leaderName}</p>
                <p className="text-sm text-muted-foreground">Community Admin</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="posts" className="space-y-6">
          <div className="max-w-3xl mx-auto">
            {isJoined ? (
              <PostForm currentUser={authUser || currentUser} onSubmit={handleCreatePost} />
            ) : (
              <Card className="p-8 border-2 border-dashed border-border shadow-sm text-center rounded-2xl bg-white mb-8">
                <h3 className="text-xl text-foreground mb-2">Join community to post</h3>
                <p className="text-muted-foreground mb-4">
                  You must be a member of this community to participate in discussions.
                </p>
                <Button onClick={handleJoinToggle} className="rounded-xl px-8">Join Now</Button>
              </Card>
            )}

            <div className="space-y-4">
              {realPosts.length > 0 ? (
                realPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <Card className="p-8 border-2 border-dashed border-border shadow-sm text-center rounded-2xl bg-white">
                  <h3 className="text-xl text-foreground mb-2">No posts yet</h3>
                  <p className="text-muted-foreground">
                    Be the first to start a discussion in this community!
                  </p>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          {communityEvents.length > 0 ? (
            communityEvents.map((event) => (
              <Card
                key={event.id}
                className="p-8 border-2 border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all rounded-2xl bg-white"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-56 h-40 bg-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-12 w-12 text-primary" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-2xl text-foreground mb-3">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="flex flex-wrap gap-4 mb-5">
                      <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm text-foreground">
                          {new Date(event.eventDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm text-foreground">{event.eventTime}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="text-sm text-foreground">{event.location}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => onJoinEvent(event.id)}
                      className="bg-primary hover:bg-primary/90 text-white px-6 rounded-xl font-medium"
                    >
                      RSVP Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-16 border-2 border-dashed border-border shadow-sm text-center rounded-2xl bg-white">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl text-foreground mb-2">No events yet</h3>
              <p className="text-muted-foreground">
                Check back later for upcoming events from this community
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="members">
          <Card className="p-8 border-2 border-border shadow-sm rounded-2xl bg-white">
            <h2 className="text-2xl text-foreground mb-6">Members ({community.memberCount})</h2>
            {members.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors border border-transparent hover:border-border"
                  >
                    <Avatar className="h-12 w-12 bg-primary">
                      <AvatarFallback className="bg-primary text-white">
                        {(member.name || "")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {isJoined ? "Member details are loading..." : "Join this community to see its members."}
                </p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

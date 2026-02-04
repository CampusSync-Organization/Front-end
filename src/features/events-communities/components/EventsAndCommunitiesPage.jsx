import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Users,
  Grid3x3,
  List,
  Clock,
  MapPin,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { motion, AnimatePresence } from "framer-motion";

export function EventsAndCommunitiesPage({
  events,
  communities,
  onJoinEvent,
  onJoinCommunity,
  onCommunityClick,
  currentUserRole,
  initialTab = "events",
}) {
  const [activeTab, setActiveTab] = useState(
    initialTab === "communities" ? "communities" : "events"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    setSearchQuery("");
  }, [activeTab]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch =
      searchQuery === "" ||
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || community.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const joinedCommunities = communities.filter((c) => c.memberCount > 0).slice(0, 5);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-primary rounded-full" />
            <span className="text-sm uppercase tracking-wider text-primary">Discover</span>
          </div>
          <h1 className="text-5xl md:text-6xl text-foreground mb-4 tracking-tight">
            Events & Communities
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Connect with campus life through exciting events and vibrant communities
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-9">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="mb-8">
                <TabsList className="inline-flex h-12 items-center justify-center rounded-2xl bg-muted p-1 text-muted-foreground">
                  <TabsTrigger
                    value="events"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-2 text-sm transition-all data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Events
                    <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
                      {events.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="communities"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-6 py-2 text-sm transition-all data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Communities
                    <Badge variant="secondary" className="ml-2 h-5 px-2 text-xs">
                      {communities.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-border p-4 mb-8 shadow-sm"
              >
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={`Search ${activeTab}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-11 border-0 bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary rounded-xl"
                    />
                  </div>

                  {activeTab === "communities" && (
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full md:w-44 h-11 border-0 bg-muted/50 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Academic">Academic</SelectItem>
                        <SelectItem value="Research">Research</SelectItem>
                        <SelectItem value="Creative">Creative</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  <div className="inline-flex h-11 items-center rounded-xl bg-muted/50 p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={`h-9 px-3 rounded-lg ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={`h-9 px-3 rounded-lg ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>

              <TabsContent value="events" className="mt-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key="events"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0 }}
                  >
                    {filteredEvents.length > 0 ? (
                      <div
                        className={
                          viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            : "space-y-4"
                        }
                      >
                        {filteredEvents.map((event) => {
                          const isFull = event.maxParticipants
                            ? event.currentParticipants >= event.maxParticipants
                            : false;
                          const capacityPercentage = event.maxParticipants
                            ? (event.currentParticipants / event.maxParticipants) * 100
                            : 0;

                          return (
                            <motion.div key={event.id} variants={itemVariants}>
                              <Card className="group overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-white rounded-2xl h-full flex flex-col">
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
                                      onClick={() => onJoinEvent(event.id)}
                                      disabled={isFull}
                                      className="w-full mt-auto bg-primary hover:bg-primary/90 text-white h-11 rounded-xl"
                                    >
                                      {isFull ? "Event Full" : "RSVP Now"}
                                    </Button>
                                  )}
                                </div>
                              </Card>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed border-border"
                      >
                        <Calendar className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                        <h3 className="text-xl mb-2">No events found</h3>
                        <p className="text-muted-foreground text-sm">
                          Try adjusting your search
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="communities" className="mt-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key="communities"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0 }}
                  >
                    {filteredCommunities.length > 0 ? (
                      <div
                        className={
                          viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                            : "space-y-4"
                        }
                      >
                        {filteredCommunities.map((community) => (
                          <motion.div key={community.id} variants={itemVariants}>
                            <Card
                              className="group overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer bg-white rounded-2xl"
                              onClick={() => onCommunityClick?.(community.id)}
                            >
                              <div className="relative bg-gradient-to-br from-secondary/20 to-secondary/10 p-6 border-b border-border/10">
                                <div className="flex items-start justify-between">
                                  <div className="w-14 h-14 bg-primary/90 rounded-xl flex items-center justify-center">
                                    <Users className="h-7 w-7 text-white" />
                                  </div>
                                  <Badge className="bg-primary/90 text-white">
                                    {community.category}
                                  </Badge>
                                </div>
                              </div>

                              <div className="p-6">
                                <h3 className="text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                  {community.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                  {community.description}
                                </p>

                                {community.meetingSchedule && (
                                  <div className="flex items-center gap-2 mb-4 text-sm">
                                    <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                                    <span className="text-foreground/80">
                                      {community.meetingSchedule}
                                    </span>
                                  </div>
                                )}

                                <div className="flex flex-wrap gap-2 mb-4">
                                  {community.tags.slice(0, 3).map((tag, index) => (
                                    <Badge
                                      key={index}
                                      variant="outline"
                                      className="text-xs bg-muted/50"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                  <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                      <Users className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                      <p className="text-sm">{community.memberCount}</p>
                                      <p className="text-xs text-muted-foreground">Members</p>
                                    </div>
                                  </div>
                                  {currentUserRole === "student" && (
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onJoinCommunity(community.id);
                                      }}
                                      size="sm"
                                      className="bg-primary hover:bg-primary/90 text-white rounded-xl"
                                    >
                                      Join
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed border-border"
                      >
                        <Users className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                        <h3 className="text-xl mb-2">No communities found</h3>
                        <p className="text-muted-foreground text-sm">
                          Try adjusting your search or filters
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
            </Tabs>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="xl:col-span-3 space-y-6"
          >
            <Card className="p-6 border border-border shadow-sm rounded-2xl bg-white">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-base">My Communities</h3>
              </div>
              <div className="space-y-2">
                {joinedCommunities.length > 0 ? (
                  joinedCommunities.map((community) => (
                    <div
                      key={community.id}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 cursor-pointer transition-colors group"
                      onClick={() => onCommunityClick?.(community.id)}
                    >
                      <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-1">{community.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {community.memberCount} members
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No communities joined yet
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-6 border border-border shadow-sm rounded-2xl bg-gradient-to-br from-primary to-primary/90 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                  <h3 className="text-base">Platform Stats</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <p className="text-3xl mb-1">{events.length}</p>
                    <p className="text-sm text-white/70">Upcoming Events</p>
                  </div>
                  <div className="h-px bg-white/20" />
                  <div>
                    <p className="text-3xl mb-1">{communities.length}</p>
                    <p className="text-sm text-white/70">Active Communities</p>
                  </div>
                  <div className="h-px bg-white/20" />
                  <div>
                    <p className="text-3xl mb-1">
                      {communities.reduce((acc, c) => acc + c.memberCount, 0)}
                    </p>
                    <p className="text-sm text-white/70">Total Members</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

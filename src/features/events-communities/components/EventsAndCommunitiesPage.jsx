import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Users,
  Grid3x3,
  List,
  ChevronRight,
  TrendingUp,
  MapPin,
  Filter,
  X
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import { EventCard, EventCardSkeleton } from "./EventCard";
import { CommunityCard } from "./CommunityCard";
import { useEventStore } from "../store/useEventStore";

export function EventsAndCommunitiesPage({
  events,
  communities,
  onJoinEvent,
  onJoinCommunity,
  onCommunityClick,
  onEventClick,
  currentUserRole,
  initialTab = "events",
  isLoading = false,
  currentUserId,
}) {
  const [activeTab, setActiveTab] = useState(
    initialTab === "communities" ? "communities" : "events"
  );
  
  const { currentUser, joinCommunity, leaveCommunity } = useEventStore();
  
  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Events specific filters
  const [sortBy, setSortBy] = useState("upcoming"); // upcoming, popular, newest

  useEffect(() => {
    setSearchQuery("");
    setSelectedCategory("all");
  }, [activeTab]);

  let filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchQuery === "" ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory =
      selectedCategory === "all" || event.tags?.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  // Sorting Events
  filteredEvents.sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.currentParticipants - a.currentParticipants;
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "upcoming":
      default:
        return new Date(a.eventDate) - new Date(b.eventDate);
    }
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
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // Get unique tags for events category filter
  const eventCategories = [...new Set(events.flatMap(e => e.tags || []))].filter(Boolean);

  // Active filters count
  const hasActiveFilters = selectedCategory !== "all";

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

              {/* Enhanced Search and Filters Toolbar */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg pt-4 pb-6 -mx-4 px-4 sm:-mx-8 sm:px-8 mb-6 border-b border-border/40 flex flex-col lg:flex-row items-start lg:items-center gap-4"
              >
                {/* Search */}
                <div className="relative flex-1 w-full h-14 group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  </div>
                  <Input
                    placeholder={`Search ${activeTab} by name or description...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-14 pr-12 h-full w-full rounded-2xl border border-border/70 bg-white shadow-sm hover:shadow-md focus-visible:shadow-md focus-visible:ring-1 focus-visible:ring-primary text-base transition-all"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-5 flex items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 w-full lg:w-auto">
                  
                  {/* Category */}
                  <div className="flex-1 min-w-[160px] lg:min-w-[200px] h-14">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="h-full w-full rounded-2xl border border-border/50 bg-white shadow-sm hover:shadow-md focus:ring-1 focus:ring-primary text-base font-medium px-5 transition-all">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-normal hidden sm:inline">Category:</span>
                          <SelectValue placeholder="All Categories" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border border-border/50 bg-white/95 backdrop-blur-xl shadow-2xl p-2 w-[220px]">
                        <SelectItem value="all" className="py-2.5 px-4 mb-1 text-[15px] font-medium rounded-[12px] cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors">All Categories</SelectItem>
                        {activeTab === "communities" ? (
                          <>
                            <SelectItem value="Academic" className="py-2.5 px-4 mb-1 text-[15px] font-medium rounded-[12px] cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors">Academic</SelectItem>
                            <SelectItem value="Research" className="py-2.5 px-4 mb-1 text-[15px] font-medium rounded-[12px] cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors">Research</SelectItem>
                            <SelectItem value="Creative" className="py-2.5 px-4 mb-1 text-[15px] font-medium rounded-[12px] cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors">Creative</SelectItem>
                            <SelectItem value="Business" className="py-2.5 px-4 text-[15px] font-medium rounded-[12px] cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors">Business</SelectItem>
                          </>
                        ) : (
                          eventCategories.map((cat, index) => (
                            <SelectItem 
                              key={cat} 
                              value={cat} 
                              className={`py-2.5 px-4 text-[15px] font-medium rounded-[12px] cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors ${index !== eventCategories.length - 1 ? 'mb-1' : ''}`}
                            >
                              {cat}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {activeTab === "events" && (
                    <div className="flex-1 min-w-[160px] lg:min-w-[180px] h-14">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="h-full w-full rounded-2xl border border-border/50 bg-white shadow-sm hover:shadow-md focus:ring-1 focus:ring-primary text-base font-medium px-5 transition-all">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-normal hidden sm:inline">Sort:</span>
                            <SelectValue placeholder="Sort By" />
                          </div>
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border border-border/50 bg-white/95 backdrop-blur-xl shadow-2xl p-2 w-[220px]">
                          <SelectItem value="upcoming" className="py-2.5 px-4 mb-1 text-[15px] font-medium rounded-[12px] cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors">Upcoming Next</SelectItem>
                          <SelectItem value="popular" className="py-2.5 px-4 mb-1 text-[15px] font-medium rounded-[12px] cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors">Most Popular</SelectItem>
                          <SelectItem value="newest" className="py-2.5 px-4 text-[15px] font-medium rounded-[12px] cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors">Newly Added</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* View Toggles */}
                  <div className="hidden md:flex items-center gap-1 h-14 rounded-2xl bg-white shadow-sm border border-border/50 p-1.5 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={`h-11 w-11 px-0 rounded-[14px] transition-all ${viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-black/5 hover:text-foreground"}`}
                    >
                      <Grid3x3 className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={`h-11 w-11 px-0 rounded-[14px] transition-all ${viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-black/5 hover:text-foreground"}`}
                    >
                      <List className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>

              <TabsContent value="events" className="mt-0">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                      {[1,2,3,4,5,6].map(i => <EventCardSkeleton key={i} />)}
                    </div>
                  ) : (
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
                          {filteredEvents.map((event) => (
                            <motion.div key={event.id} variants={itemVariants}>
                              <EventCard 
                                event={event} 
                                currentUserId={currentUserId} 
                                currentUserRole={currentUserRole} 
                                onJoinEvent={onJoinEvent} 
                                onEventClick={onEventClick} 
                              />
                            </motion.div>
                          ))}
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
                            Try adjusting your search or filters
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="communities" className="mt-0">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
                      {[1,2,3,4].map(i => <EventCardSkeleton key={i} />)}
                    </div>
                  ) : (
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
                            <motion.div key={community.id} variants={itemVariants} className="h-full">
                              <CommunityCard
                                community={community}
                                isJoined={community.isJoined}
                                isModerator={currentUserId != null && Number(currentUserId) === Number(community.moderatorId)}
                                onJoinToggle={async (id, isJoined) => {
                                  if (isJoined) await leaveCommunity(id);
                                  else await joinCommunity(id);
                                }}
                                onClick={onCommunityClick}
                                currentUserRole={currentUserRole}
                              />
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
                  )}
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

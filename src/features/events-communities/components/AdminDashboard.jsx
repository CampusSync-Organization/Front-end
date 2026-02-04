import { useState } from "react";
import {
  Users,
  Calendar,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  Plus,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function AdminDashboard({
  events,
  communities,
  onEditEvent,
  onDeleteEvent,
  onEditCommunity,
  onDeleteCommunity,
  onCreateClick,
}) {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    {
      title: "Total Communities",
      value: communities.length,
      icon: Users,
      color: "bg-primary",
      change: "+12%",
    },
    {
      title: "Total Events",
      value: events.length,
      icon: Calendar,
      color: "bg-secondary",
      change: "+8%",
    },
    {
      title: "Total Participants",
      value: events.reduce((acc, event) => acc + event.currentParticipants, 0),
      icon: TrendingUp,
      color: "bg-primary",
      change: "+23%",
    },
    {
      title: "Active Members",
      value: communities.reduce((acc, community) => acc + community.memberCount, 0),
      icon: Users,
      color: "bg-secondary",
      change: "+15%",
    },
  ];

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Manage communities, events, and analytics
          </p>
        </div>
        <Button
          onClick={onCreateClick}
          className="bg-primary hover:bg-primary/90 text-white gap-2 h-12 px-6 rounded-xl shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Create New
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="p-6 border-2 border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all rounded-2xl bg-white"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center shadow-md ${
                    stat.color.includes("primary") ? "text-white" : "text-primary"
                  }`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <Badge className="bg-green-100 text-green-700 border-0 px-3 py-1">
                  {stat.change}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
              <p className="text-4xl text-foreground">{stat.value}</p>
            </Card>
          );
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border-2 border-border mb-6 rounded-xl p-1">
          <TabsTrigger
            value="overview"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="communities"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Manage Communities
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            Manage Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 border-2 border-border shadow-sm rounded-2xl bg-white">
              <h3 className="text-xl text-foreground mb-6">Recent Events</h3>
              <div className="space-y-3">
                {events.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-foreground mb-1">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(event.eventDate)} • {event.currentParticipants} participants
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg hover:bg-background"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 border-2 border-border shadow-sm rounded-2xl bg-white">
              <h3 className="text-xl text-foreground mb-6">Top Communities</h3>
              <div className="space-y-3">
                {communities
                  .sort((a, b) => b.memberCount - a.memberCount)
                  .slice(0, 5)
                  .map((community) => (
                    <div
                      key={community.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-sm text-foreground mb-1">{community.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {community.category} • {community.memberCount} members
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-lg hover:bg-background"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="communities">
          <Card className="border-2 border-border shadow-sm overflow-hidden rounded-2xl bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-foreground">Community Name</TableHead>
                    <TableHead className="text-foreground">Category</TableHead>
                    <TableHead className="text-foreground">Members</TableHead>
                    <TableHead className="text-foreground">Created By</TableHead>
                    <TableHead className="text-right text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {communities.map((community) => (
                    <TableRow key={community.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div>
                          <p className="text-foreground">{community.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {community.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-muted/50 border-border text-foreground"
                        >
                          {community.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground">{community.memberCount}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {community.organizerName}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-lg hover:bg-muted"
                            onClick={() => onEditCommunity(community.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-destructive rounded-lg hover:bg-destructive/10"
                            onClick={() => onDeleteCommunity(community.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card className="border-2 border-border shadow-sm overflow-hidden rounded-2xl bg-white">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-foreground">Event Name</TableHead>
                    <TableHead className="text-foreground">Date & Time</TableHead>
                    <TableHead className="text-foreground">Location</TableHead>
                    <TableHead className="text-foreground">Participants</TableHead>
                    <TableHead className="text-foreground">Organized By</TableHead>
                    <TableHead className="text-right text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div>
                          <p className="text-foreground">{event.title}</p>
                          {event.club && (
                            <p className="text-xs text-muted-foreground">{event.club}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm text-foreground">
                            {formatDate(event.eventDate)}
                          </p>
                          <p className="text-xs text-muted-foreground">{event.eventTime}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{event.location}</TableCell>
                      <TableCell className="text-foreground">
                        {event.currentParticipants}
                        {event.maxParticipants && ` / ${event.maxParticipants}`}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {event.organizerName}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-lg hover:bg-muted"
                            onClick={() => onEditEvent(event.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-destructive rounded-lg hover:bg-destructive/10"
                            onClick={() => onDeleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

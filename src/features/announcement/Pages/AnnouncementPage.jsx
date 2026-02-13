import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Filter } from "lucide-react";
import {
  fetchAnnouncements,
  selectAllAnnouncements,
  selectAnnouncementStatus,
} from "../store/announcementSlice";
import AnnouncementCard from "../components/AnnouncementCard";
import {
  CreateAnnouncementWidget,
  QuickAccessWidget,
  WhoToFollowWidget,
} from "../components/AnnouncementWidgets";

export default function AnnouncementPage() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllAnnouncements);
  const status = useSelector(selectAnnouncementStatus);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAnnouncements());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return <div className="p-8 text-center">Loading announcements...</div>;
  }

  if (status === "failed") {
    return (
      <div className="p-8 text-center text-red-500">
        Error loading announcements.
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-primary">
              Welcome back, Alexa!
            </h1>
            <p className="text-slate-500">
              Here's what's happening around campus today.
            </p>
          </header>

          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 bg-card-light border border-border-light rounded-lg text-sm font-medium hover:border-secondary transition-colors text-foreground">
                Filter Posts
                <Filter size={16} className="text-slate-400" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {posts.map((post) => (
              <AnnouncementCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <CreateAnnouncementWidget />
          <QuickAccessWidget />
          <WhoToFollowWidget />
        </div>
      </div>
    </main>
  );
}

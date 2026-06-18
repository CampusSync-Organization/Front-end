import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Megaphone } from "lucide-react";
import AnnouncementCard from "../components/AnnouncementCard";
import {
  fetchMyAnnouncements,
  selectMyAnnouncements,
  selectMyAnnouncementStatus,
} from "../store/announcementSlice";

const MyAnnouncementsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const announcements = useSelector(selectMyAnnouncements);
  const status = useSelector(selectMyAnnouncementStatus);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchMyAnnouncements());
    }
  }, [status, dispatch]);

  return (
    <div className="min-h-screen bg-background-light p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => navigate("/profile")}
          className="inline-flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Profile
        </button>

        <div className="bg-card-light p-6 sm:p-8 rounded-xl shadow-sm border border-border-light">
          <div className="flex items-center gap-3 mb-8">
            <Megaphone className="text-secondary" size={28} />
            <h1 className="text-2xl font-bold text-primary">
              My Announcements
            </h1>
          </div>

          {status === "loading" && (
            <p className="text-center text-slate-500 py-12">
              Loading announcements...
            </p>
          )}

          {status === "succeeded" && announcements.length === 0 && (
            <p className="text-center text-slate-400 py-12">
              You haven't posted any announcements yet.
            </p>
          )}

          <div className="space-y-4">
            {announcements.map((post) => (
              <AnnouncementCard key={post.id} post={post} isOwner={true} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAnnouncementsPage;

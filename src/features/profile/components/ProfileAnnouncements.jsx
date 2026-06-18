import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Megaphone, Plus, X, Check, Edit3 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import AnnouncementCard from "../../announcement/components/AnnouncementCard";
import { announcementApi } from "../../announcement/api/announcementApi";
import {
  fetchMyAnnouncements,
  createAnnouncement,
  selectMyAnnouncements,
  selectMyAnnouncementStatus,
} from "../../announcement/store/announcementSlice";
import { getErrorMessage } from "../../auth/utils/getErrorMessage";

const CreateAnnouncementForm = ({ onCancel }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    announcement_type: "project-announcement",
    course_name: "",
    project_name: "",
    start_date: "",
    deadline: "",
    num_members: "",
    content: "",
  });

  const validate = () => {
    if (!formData.course_name.trim()) {
      toast.error("Course name is mandatory");
      return false;
    }

    if (formData.announcement_type === "project-announcement") {
      if (!formData.num_members || parseInt(formData.num_members) < 1) {
        toast.error("Members needed must be at least 1");
        return false;
      }

      if (formData.start_date && formData.deadline) {
        const start = new Date(formData.start_date);
        const end = new Date(formData.deadline);
        if (end <= start) {
          toast.error("Deadline must be after start date");
          return false;
        }
      }

      if (formData.start_date) {
        const start = new Date(formData.start_date);
        const now = new Date();
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(now.getDate() - 10);
        start.setHours(0, 0, 0, 0);
        tenDaysAgo.setHours(0, 0, 0, 0);
        if (start < tenDaysAgo) {
          toast.error("Start date cannot be more than 10 days in the past");
          return false;
        }
      }
    } else if (formData.announcement_type === "connection-update") {
      if (!formData.content.trim()) {
        toast.error("Please provide some content for your update");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const dataToSend = { ...formData };

      if (formData.announcement_type === "connection-update") {
        delete dataToSend.project_name;
        delete dataToSend.start_date;
        delete dataToSend.deadline;
        delete dataToSend.num_members;
      } else {
        dataToSend.num_members = parseInt(dataToSend.num_members);
      }

      await dispatch(createAnnouncement(dataToSend)).unwrap();
      toast.success("Announcement posted successfully!");
      onCancel();
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to post announcement"));
    }
  };

  return (
    <div className="w-full p-6 bg-card-light rounded-xl border border-secondary shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Edit3 className="text-primary" size={20} />
        <h3 className="font-bold text-primary">New Announcement</h3>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-4">
        <select
          className="w-full p-3 bg-slate-50 border border-border-light rounded-lg text-sm appearance-none focus:ring-2 focus:ring-secondary outline-none transition-all text-foreground cursor-pointer font-medium"
          value={formData.announcement_type}
          onChange={(e) =>
            setFormData({ ...formData, announcement_type: e.target.value })
          }
        >
          <option value="project-announcement">Project Announcement</option>
          <option value="connection-update">Connection Update</option>
        </select>

        <input
          type="text"
          placeholder="Course Name (Required)"
          className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground placeholder-slate-400 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm font-bold"
          value={formData.course_name}
          onChange={(e) =>
            setFormData({ ...formData, course_name: e.target.value })
          }
        />

        {formData.announcement_type === "project-announcement" && (
          <input
            type="text"
            placeholder="Project Name (Optional)"
            className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground placeholder-slate-400 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
            value={formData.project_name}
            onChange={(e) =>
              setFormData({ ...formData, project_name: e.target.value })
            }
          />
        )}
      </div>

      {formData.announcement_type === "project-announcement" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block ml-1">
              Start Date
            </label>
            <input
              type="date"
              className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block ml-1">
              Deadline
            </label>
            <input
              type="date"
              className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 mb-1 block ml-1">
              Members Needed
            </label>
            <input
              type="number"
              placeholder="Min 1"
              className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground placeholder-slate-400 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
              value={formData.num_members}
              onChange={(e) =>
                setFormData({ ...formData, num_members: e.target.value })
              }
            />
          </div>
        </div>
      )}

      <div className="mb-6">
        <textarea
          placeholder={
            formData.announcement_type === "connection-update"
              ? "What would you like to share? (Required)"
              : "Description, requirements, and extra notes (Optional)..."
          }
          rows="3"
          className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground placeholder-slate-400 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary resize-none text-sm"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        ></textarea>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-slate-600 font-medium hover:text-primary hover:underline"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-8 py-2 bg-secondary text-primary font-bold rounded-lg hover:bg-secondary/90 transition-colors flex items-center gap-2"
        >
          <Check size={18} />
          Post
        </button>
      </div>
    </div>
  );
};

export const ProfileAnnouncements = ({ isOwnProfile = true, userId = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const myAnnouncements = useSelector(selectMyAnnouncements);
  const status = useSelector(selectMyAnnouncementStatus);
  const [isCreating, setIsCreating] = useState(false);
  const [userAnnouncements, setUserAnnouncements] = useState([]);
  const [userAnnouncementsLoading, setUserAnnouncementsLoading] = useState(false);

  useEffect(() => {
    if (isOwnProfile) {
      if (status === "idle") dispatch(fetchMyAnnouncements());
    } else if (userId) {
      setUserAnnouncementsLoading(true);
      announcementApi.getUserAnnouncements(userId)
        .then((data) => setUserAnnouncements(Array.isArray(data) ? data : data?.announcements ?? []))
        .catch(() => setUserAnnouncements([]))
        .finally(() => setUserAnnouncementsLoading(false));
    }
  }, [isOwnProfile, userId, status, dispatch]);

  const announcements = isOwnProfile ? myAnnouncements : userAnnouncements;
  const loading = isOwnProfile ? status === "loading" : userAnnouncementsLoading;

  if (loading) {
    return (
      <section className="bg-card-light p-6 sm:p-8 rounded-xl shadow-sm border border-border-light">
        <p className="text-center text-slate-500">Loading announcements...</p>
      </section>
    );
  }

  const displayedAnnouncements = announcements.slice(0, 2);

  return (
    <section className="bg-card-light p-6 sm:p-8 rounded-xl shadow-sm border border-border-light">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
          <Megaphone className="text-secondary" size={24} /> Announcements
        </h2>
      </div>

      {isOwnProfile &&
        (!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full p-4 mb-8 bg-slate-50 rounded-xl border border-border-light text-left text-slate-500 text-base hover:bg-slate-100 hover:border-secondary transition-all flex items-center gap-2"
          >
            <Plus size={20} className="text-secondary" />
            Create new announcement...
          </button>
        ) : (
          <CreateAnnouncementForm onCancel={() => setIsCreating(false)} />
        ))}

      <div className="space-y-4">
        {displayedAnnouncements.map((post) => (
          <AnnouncementCard key={post.id} post={post} isOwner={true} />
        ))}
      </div>

      {announcements.length === 0 && !isCreating && (
        <p className="text-center text-slate-400 py-8">
          No announcements yet.
        </p>
      )}

      {announcements.length > 2 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/my-announcements")}
            className="inline-flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors px-6 py-2 bg-slate-50 rounded-full hover:bg-slate-100"
          >
            Show all announcements
            <span className="text-lg">→</span>
          </button>
        </div>
      )}
    </section>
  );
};

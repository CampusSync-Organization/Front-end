import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  Heart,
  MessageCircle,
  Share2,
  Clock,
  MoreHorizontal,
  Edit,
  Trash2,
  X,
  Check,
  Plus,
} from "lucide-react";
import { resolveAvatarUrl } from "../../../shared/hooks/resolveAvatarUrl";
import {
  deleteAnnouncement,
  updateAnnouncement,
} from "../store/announcementSlice";
import { getErrorMessage } from "../../auth/utils/getErrorMessage";

function getCategoryLabel(type) {
  switch (type) {
    case "project-announcement":
      return "Project Announcement";
    case "connection-update":
      return "Connection Update";
    default:
      return type;
  }
}

function getCategoryColor(type) {
  switch (type) {
    case "project-announcement":
      return "bg-secondary/15 text-secondary";
    case "connection-update":
      return "bg-purple-100 text-purple-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function AnnouncementCard({ post, isOwner = false }) {
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const menuRef = useRef(null);

  const [editData, setEditData] = useState({
    announcement_type: post.announcement_type,
    course_name: post.course_name || "",
    project_name: post.project_name || "",
    start_date: post.start_date ? post.start_date.split("T")[0] : "",
    deadline: post.deadline ? post.deadline.split("T")[0] : "",
    num_members: post.num_members || "",
    content: post.content || "",
  });

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      await dispatch(deleteAnnouncement(post.id));
    }
  };

  const validate = () => {
    if (!editData.course_name.trim()) {
      toast.error("Course name is mandatory");
      return false;
    }

    if (editData.announcement_type === "project-announcement") {
      if (!editData.num_members || parseInt(editData.num_members) < 1) {
        toast.error("Members needed must be at least 1");
        return false;
      }

      if (editData.start_date && editData.deadline) {
        const start = new Date(editData.start_date);
        const end = new Date(editData.deadline);
        if (end <= start) {
          toast.error("Deadline must be after start date");
          return false;
        }
      }

      if (editData.start_date) {
        const start = new Date(editData.start_date);
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
    } else if (editData.announcement_type === "connection-update") {
        if (!editData.content.trim()) {
          toast.error("Please provide some content for your update");
          return false;
        }
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    try {
      const dataToSend = { ...editData };

      if (editData.announcement_type === "connection-update") {
        delete dataToSend.project_name;
        delete dataToSend.start_date;
        delete dataToSend.deadline;
        delete dataToSend.num_members;
      } else {
        dataToSend.num_members = parseInt(dataToSend.num_members);
      }

      await dispatch(updateAnnouncement({ id: post.id, updates: dataToSend })).unwrap();
      toast.success("Announcement updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update announcement"));
    }
  };

  if (isEditing) {
    return (
      <article className="bg-card-light border border-secondary/30 rounded-xl shadow-md overflow-hidden p-6 transition-all">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg text-primary">Edit Announcement</h3>
          <button
            onClick={() => setIsEditing(false)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="relative">
              <select
                className="w-full p-3 bg-slate-50 border border-border-light rounded-lg text-sm appearance-none focus:ring-2 focus:ring-secondary outline-none transition-all text-foreground cursor-pointer font-medium"
                value={editData.announcement_type}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    announcement_type: e.target.value,
                  })
                }
              >
                <option value="project-announcement">
                  Project Announcement
                </option>
                <option value="connection-update">Connection Update</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Course Name (Required)"
              className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground placeholder-slate-400 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm font-bold"
              value={editData.course_name}
              onChange={(e) =>
                setEditData({ ...editData, course_name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Title / Project Name (Optional)"
              className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground placeholder-slate-400 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
              value={editData.project_name}
              onChange={(e) =>
                setEditData({ ...editData, project_name: e.target.value })
              }
            />
          </div>

          {editData.announcement_type === "project-announcement" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block ml-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                    value={editData.start_date}
                    onChange={(e) =>
                      setEditData({ ...editData, start_date: e.target.value })
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
                    value={editData.deadline}
                    onChange={(e) =>
                      setEditData({ ...editData, deadline: e.target.value })
                    }
                  />
                </div>
              </div>

              <input
                type="number"
                placeholder="Members Needed (Minimum 1)"
                className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground placeholder-slate-400 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                value={editData.num_members}
                onChange={(e) =>
                  setEditData({ ...editData, num_members: e.target.value })
                }
              />
            </>
          )}

          <textarea
            className="w-full h-32 p-4 bg-slate-50 border border-border-light rounded-xl text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none resize-none transition-all placeholder:text-slate-400 text-foreground"
            placeholder="Description, requirements, and extra notes (Optional)..."
            value={editData.content}
            onChange={(e) =>
              setEditData({ ...editData, content: e.target.value })
            }
          ></textarea>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="flex-[2] bg-secondary text-primary font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/20"
            >
              <Check size={20} />
              Save Changes
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-card-light border border-border-light rounded-xl shadow-sm overflow-hidden p-6 transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-4">
        <Link
          to={`/user-profile/${post.user_id}`}
          className="flex items-center gap-4 group"
        >
          <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center font-bold text-lg overflow-hidden flex-shrink-0">
            {post.avatar_url ? (
              <img
                src={resolveAvatarUrl(post.avatar_url)}
                alt={post.name}
                className="w-full h-full object-cover"
              />
            ) : (
              post.name.charAt(0)
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                {post.name}
              </h3>
              <span
                className={`px-2 py-0.5 text-[11px] font-bold rounded uppercase tracking-wider ${getCategoryColor(
                  post.announcement_type,
                )}`}
              >
                {getCategoryLabel(post.announcement_type)}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <Clock size={14} />{" "}
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        </Link>

        {isOwner && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-400 hover:text-primary transition-colors p-1 rounded-full hover:bg-slate-100"
            >
              <MoreHorizontal size={20} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-border-light rounded-xl shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                >
                  <Edit size={16} />
                  Edit Announcement
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete Announcement
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-slate-700 mb-6 leading-relaxed">
        {post.announcement_type === "connection-update"
          ? post.content
          : post.project_name}
      </p>

      {post.announcement_type === "project-announcement" && (
        <div className="bg-secondary/5 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 border border-secondary/10 mb-6">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
              Course
            </p>
            <p className="font-medium text-sm text-foreground">
              {post.course_name}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
              Deadline
            </p>
            <p className="font-medium text-sm text-foreground">
              {new Date(post.deadline).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
              Team Size
            </p>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-foreground">
                {post.current_members}/{post.num_members} members
              </span>
              <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="bg-secondary h-full rounded-full"
                  style={{
                    width: `${
                      (post.current_members / post.num_members) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-border-light">
        <div className="flex items-center gap-6">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-2 transition-colors ${
              liked
                ? "text-secondary/70"
                : "text-slate-500 hover:text-secondary/80"
            }`}
          >
            <Heart size={20} fill={liked ? "currentColor" : "none"} />
            <span className="text-sm font-medium">{likesCount}</span>
          </button>
        </div>
        {post.announcement_type === "project-announcement" && !isOwner && (
          <button className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-md shadow-primary/10">
            Request to Join
          </button>
        )}
      </div>
    </article>
  );
}

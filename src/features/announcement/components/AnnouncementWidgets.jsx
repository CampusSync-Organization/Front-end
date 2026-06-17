import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Plus, Users, Folder, Bookmark, Edit3 } from "lucide-react";
import RecommendedUser from "./RecommendedUser";
import { createAnnouncement } from "../store/announcementSlice";

import { getErrorMessage } from "../../auth/utils/getErrorMessage";

export function CreateAnnouncementWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
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
        
        // Reset time for fair comparison
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
      
      // Clean up data based on type
      if (formData.announcement_type === "connection-update") {
        delete dataToSend.project_name;
        delete dataToSend.start_date;
        delete dataToSend.deadline;
        delete dataToSend.num_members;
      } else {
        // Ensure num_members is a number
        dataToSend.num_members = parseInt(dataToSend.num_members);
      }

      await dispatch(createAnnouncement(dataToSend)).unwrap();
      toast.success("Announcement posted successfully!");
      setIsExpanded(false);
      setFormData({
        announcement_type: "project-announcement",
        course_name: "",
        project_name: "",
        start_date: "",
        deadline: "",
        num_members: "",
        content: "",
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to post announcement"));
    }
  };

  return (
    <section
      className={`bg-card-light border border-border-light rounded-xl shadow-sm transition-all duration-300 ${isExpanded ? "p-6" : "p-4"}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Edit3 className="text-primary" size={24} />
        <h2 className="font-bold text-lg text-primary">Create Announcement</h2>
      </div>

      {!isExpanded ? (
        <div
          onClick={() => setIsExpanded(true)}
          className="w-full p-4 bg-slate-50 border border-border-light rounded-xl text-slate-400 cursor-text hover:border-secondary transition-colors"
        >
          Share something with the campus community...
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="grid grid-cols-1 gap-3">
            <div className="relative">
              <select
                className="w-full p-3 bg-slate-50 border border-border-light rounded-lg text-sm appearance-none focus:ring-2 focus:ring-secondary outline-none transition-all text-foreground cursor-pointer font-medium"
                value={formData.announcement_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
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
              value={formData.course_name}
              onChange={(e) =>
                setFormData({ ...formData, course_name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Title / Project Name (Optional)"
              className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground placeholder-slate-400 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
              value={formData.project_name}
              onChange={(e) =>
                setFormData({ ...formData, project_name: e.target.value })
              }
            />
          </div>

          {formData.announcement_type === "project-announcement" && (
            <>
              <div className="grid grid-cols-2 gap-3">
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
              </div>

              <input
                type="number"
                placeholder="Members Needed (Minimum 1)"
                className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground placeholder-slate-400 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                value={formData.num_members}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    num_members: e.target.value,
                  })
                }
              />
            </>
          )}

          <textarea
            className="w-full h-32 p-4 bg-slate-50 border border-border-light rounded-xl text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none resize-none transition-all placeholder:text-slate-400 text-foreground"
            placeholder="Description, requirements, and extra notes (Optional)..."
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
          ></textarea>

          <div className="flex gap-3 pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-[2] bg-secondary text-primary font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/20"
            >
              <Plus size={20} />
              Post Announcement
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export function QuickAccessWidget() {
  return (
    <section className="bg-card-light border border-border-light rounded-xl p-6 shadow-sm">
      <h2 className="font-bold text-lg mb-6 text-primary">Quick Access</h2>
      <ul className="space-y-1">
        <li>
          <Link
            className="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-primary transition-all group"
            to="/home"
          >
            <Users
              size={20}
              className="text-slate-400 group-hover:text-primary"
            />
            <span className="font-medium">My Communities</span>
          </Link>
        </li>
        <li>
          <Link
            className="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-primary transition-all group"
            to="/home"
          >
            <Folder
              size={20}
              className="text-slate-400 group-hover:text-primary"
            />
            <span className="font-medium">My Projects</span>
          </Link>
        </li>
        <li>
          <Link
            className="flex items-center gap-3 p-3 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-primary transition-all group"
            to="/home"
          >
            <Bookmark
              size={20}
              className="text-slate-400 group-hover:text-primary"
            />
            <span className="font-medium">Saved Posts</span>
          </Link>
        </li>
      </ul>
    </section>
  );
}

export function WhoToFollowWidget() {
  const navigate = useNavigate();
  return (
    <section className="bg-card-light border border-border-light rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-bold text-lg text-primary">Recommendations</h2>
        <button
          onClick={() => navigate("/Recommendation-Page")}
          className="text-xs  text-primary/70 hover:underline"
        >
          View all
        </button>
      </div>
      <div className="space-y-4">
        <RecommendedUser
          logo={"SM"}
          name={"Sam Smith"}
          title={"UI/UX designer"}
        >
          {" "}
        </RecommendedUser>
        <RecommendedUser
          logo={"JD"}
          name={"John Doe"}
          title={"Machine learning engineer"}
        ></RecommendedUser>
      </div>
    </section>
  );
}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Users, Folder, Bookmark, Edit3 } from "lucide-react";
import RecommendedUser from "./RecommendedUser";

export function CreateAnnouncementWidget() {
  const [isExpanded, setIsExpanded] = useState(false);

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
              <select className="w-full p-3 bg-slate-50 border border-border-light rounded-lg text-sm appearance-none focus:ring-2 focus:ring-secondary outline-none transition-all text-foreground cursor-pointer font-medium">
                <option value="" disabled selected>
                  Select Announcement Type
                </option>
                <option>Project Announcement</option>
                <option>Event Announcement</option>
                <option>Community Update</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  width="10"
                  height="6"
                  viewBox="0 0 10 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L5 5L9 1"
                    stroke="#64748B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <input
              type="text"
              placeholder="Title / Project Name"
              className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground placeholder-slate-400 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
            />
            <input
              type="text"
              placeholder="Course Name (Optional)"
              className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground placeholder-slate-400 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block ml-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block ml-1">
                Deadline
              </label>
              <input
                type="date"
                className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
              />
            </div>
          </div>

          <input
            type="number"
            placeholder="Members Needed"
            className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground placeholder-slate-400 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
          />

          <textarea
            className="w-full h-32 p-4 bg-slate-50 border border-border-light rounded-xl text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none resize-none transition-all placeholder:text-slate-400 text-foreground"
            placeholder="Description, requirements, and extra notes..."
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
            <button className="flex-[2] bg-secondary text-primary font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/20">
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

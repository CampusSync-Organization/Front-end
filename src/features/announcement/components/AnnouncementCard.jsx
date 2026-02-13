import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Clock,
  MoreHorizontal,
  Users,
} from "lucide-react";

function getCategoryColor(category) {
  switch (category) {
    case "Event Announcement":
      return "bg-blue-100 text-blue-600";
    case "Project Announcement":
      return "bg-secondary/15 text-secondary";
    case "Community Update":
    case "Community Post":
      return "bg-green-100 text-green-600";
    case "Connection Update":
      return "bg-purple-100 text-purple-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function AnnouncementCard({ post, isOwner = false }) {
  const [liked, setLiked] = useState(post.liked);
  const [likesCount, setLikesCount] = useState(post.likes);

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <article className="bg-card-light border border-border-light rounded-xl shadow-sm overflow-hidden p-6 transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-lg flex items-center justify-center font-bold text-lg">
            {post.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-lg text-foreground">
                {post.author}
              </h3>
              <span
                className={`px-2 py-0.5 text-[11px] font-bold rounded uppercase tracking-wider ${getCategoryColor(
                  post.category,
                )}`}
              >
                {post.category}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <Clock size={14} /> {post.timeAgo}
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-primary transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <p className="text-slate-700 mb-6 leading-relaxed">{post.content}</p>

      {post.projectDetails && (
        <div className="bg-secondary/5 rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 border border-secondary/10 mb-6">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
              Course
            </p>
            <p className="font-medium text-sm text-foreground">
              {post.projectDetails.courseName}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
              Project
            </p>
            <p className="font-medium text-sm text-foreground">
              {post.projectDetails.projectName}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
              Deadline
            </p>
            <p className="font-medium text-sm text-foreground">
              {post.projectDetails.deadline}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
              Team Size
            </p>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-foreground">
                {post.projectDetails.peopleCurrent}/
                {post.projectDetails.peopleNeeded} members
              </span>
              <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="bg-secondary h-full rounded-full"
                  style={{
                    width: `${
                      (post.projectDetails.peopleCurrent /
                        post.projectDetails.peopleNeeded) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
          {post.projectDetails.additionalNotes && (
            <div className="col-span-1 sm:col-span-2 pt-2 border-t border-secondary/10 mt-2">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                Notes
              </p>
              <p className="text-sm italic text-foreground">
                {post.projectDetails.additionalNotes}
              </p>
            </div>
          )}
        </div>
      )}

      {post.image && (
        <div className="w-full h-48 bg-slate-100 rounded-lg mb-4 flex items-center justify-center text-slate-400">
          [Post Image]
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
          <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors">
            <MessageCircle size={20} />
            <span className="text-sm font-medium">{post.comments}</span>
          </button>
          <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors">
            <Share2 size={20} />
            <span className="text-sm font-medium">{post.shares}</span>
          </button>
        </div>
        {post.category === "Project Announcement" && !isOwner && (
          <button className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-all shadow-md shadow-primary/10">
            Request to Join
          </button>
        )}
      </div>
    </article>
  );
}

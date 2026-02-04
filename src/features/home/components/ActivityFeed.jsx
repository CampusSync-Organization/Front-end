import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Clock,
  Users,
  ChevronDown,
} from "lucide-react";

const posts = [
  {
    id: 3,
    author: "Campus Clubs",
    avatar: "CC",
    timeAgo: "6 hours ago",
    category: "Project Announcement",
    content:
      "Looking for teammates for our Data Structures group project. Join us and contribute to an exciting project!",
    likes: 156,
    comments: 34,
    shares: 22,
    liked: false,
    projectDetails: {
      courseName: "CS 201 - Data Structures",
      projectName: "Advanced Tree Implementation",
      deadline: "Dec 15, 2025",
      additionalNotes: "Experience with C++ preferred. Girls welcome!",
      peopleNeeded: 5,
      peopleCurrent: 4,
    },
  },
  {
    id: 1,
    author: "Alex Chen",
    avatar: "AC",
    timeAgo: "2 hours ago",
    category: "Event Announcement",
    content:
      "Tech Innovators Workshop starts tomorrow! Join us for an exclusive hands-on session on AI and machine learning. Limited spots available!",
    likes: 124,
    comments: 23,
    shares: 12,
    liked: false,
  },
  {
    id: 2,
    author: "Mariam Hassan",
    avatar: "MH",
    timeAgo: "4 hours ago",
    category: "Connection Update",
    content:
      "Just joined Tech Innovators Workshop - super excited to learn from industry experts!",
    likes: 89,
    comments: 15,
    shares: 8,
    liked: false,
  },
  {
    id: 4,
    author: "Emma Rodriguez",
    avatar: "ER",
    timeAgo: "8 hours ago",
    category: "Community Post",
    content:
      "Just launched a study group for Algorithms! We meet every Tuesday at 7 PM in the library. Everyone is welcome",
    likes: 203,
    comments: 45,
    shares: 31,
    liked: false,
  },
];

const categories = [
  "Event Announcement",
  "Connection Update",
  "Project Announcement",
  "Community Post",
];

function getCategoryColor(category) {
  switch (category) {
    case "Event Announcement":
      return "bg-secondary/20 text-secondary";
    case "Project Announcement":
      return "bg-secondary/20 text-secondary";
    case "Community Post":
      return "bg-secondary/20 text-secondary";
    case "Connection Update":
      return "bg-muted/40 text-foreground";
    default:
      return "bg-muted/40 text-foreground";
  }
}

function getDropdownOptionColor(category) {
  switch (category) {
    case "Event Announcement":
    case "Project Announcement":
    case "Community Post":
      return "text-secondary";
    case "Connection Update":
      return "text-primary";
    default:
      return "text-foreground";
  }
}

export default function ActivityFeed() {
  const [feedPosts, setFeedPosts] = useState(posts);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filteredPosts = selectedCategory
    ? feedPosts.filter((post) => post.category === selectedCategory)
    : feedPosts;

  const toggleLike = (id) => {
    setFeedPosts(
      feedPosts.map((post) =>
        post.id === id
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  return (
    <div className="space-y-4 pb-12">
      <div className="relative inline-block ml-auto">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:bg-muted transition-colors text-foreground"
        >
          <span className="text-sm font-medium">
            {selectedCategory || "Filter Posts"}
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory(null);
                setDropdownOpen(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-muted transition-colors text-sm font-medium text-foreground border-b border-border"
            >
              All Posts
            </button>
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors text-sm font-medium border-b border-border last:border-b-0 ${getDropdownOptionColor(
                  category
                )}`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {filteredPosts.map((post) => (
        <div
          key={post.id}
          className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {post.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-foreground">{post.author}</h3>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(
                    post.category
                  )}`}
                >
                  {post.category}
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-foreground/60 mt-1">
                <Clock size={14} />
                <span>{post.timeAgo}</span>
              </div>
            </div>
          </div>

          <p className="text-foreground mb-4 leading-relaxed">{post.content}</p>

          {post.projectDetails && (
            <div className="bg-secondary/10 border border-secondary/30 rounded-xl p-4 mb-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                    Course
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {post.projectDetails.courseName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                    Project
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {post.projectDetails.projectName}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                    Deadline
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {post.projectDetails.deadline}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                    Team Size
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Users size={16} className="text-secondary" />
                    <p className="text-sm font-medium text-foreground">
                      {post.projectDetails.peopleCurrent}/
                      {post.projectDetails.peopleNeeded} members
                    </p>
                  </div>
                </div>
              </div>
              {post.projectDetails.additionalNotes && (
                <div>
                  <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                    Notes
                  </p>
                  <p className="text-sm text-foreground">
                    {post.projectDetails.additionalNotes}
                  </p>
                </div>
              )}
            </div>
          )}

          {post.image && (
            <div className="w-full h-48 bg-muted rounded-lg mb-4 flex items-center justify-center text-foreground/40">
              [Post Image]
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => toggleLike(post.id)}
              className="flex items-center gap-2 text-foreground/70 hover:text-secondary transition-colors group"
            >
              <div
                className={`p-2 rounded-lg transition-colors ${
                  post.liked ? "bg-secondary/20" : "group-hover:bg-muted"
                }`}
              >
                <Heart
                  size={18}
                  fill={post.liked ? "currentColor" : "none"}
                  className={post.liked ? "text-secondary" : ""}
                />
              </div>
              <span className="text-sm">{post.likes}</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors group"
            >
              <div className="p-2 rounded-lg group-hover:bg-muted transition-colors">
                <MessageCircle size={18} />
              </div>
              <span className="text-sm">{post.comments}</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-2 text-foreground/70 hover:text-primary transition-colors group"
            >
              <div className="p-2 rounded-lg group-hover:bg-muted transition-colors">
                <Share2 size={18} />
              </div>
              <span className="text-sm">{post.shares}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

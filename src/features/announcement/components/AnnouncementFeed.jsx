import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronDown, ListFilter } from "lucide-react";
import AnnouncementCard from "./AnnouncementCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchAnnouncements,
  selectAllAnnouncements,
  selectAnnouncementStatus,
} from "../store/announcementSlice";

const categories = [
  { label: "Project Announcement", value: "project-announcement" },
  { label: "Connection Update", value: "connection-update" },
];

export default function AnnouncementFeed() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllAnnouncements);
  const status = useSelector(selectAnnouncementStatus);
  const currentUser = useSelector((state) => state.auth.user);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAnnouncements());
    }
  }, [status, dispatch]);

  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.announcement_type === selectedCategory)
    : posts;

  // Container animation - slides in from left
  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  // Individual post animation
  const postVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  };

  // Filter button animation
  const filterVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, delay: 0.2 },
    },
  };

  // Dropdown animation
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn",
      },
    },
  };

  if (status === "loading") {
    return (
      <div className="p-8 text-center text-slate-500 font-medium">
        Loading announcements...
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="p-8 text-center text-red-500 font-medium">
        Error loading announcements.
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 pb-12"
    >
      {/* Filter Button */}
      <div className="flex justify-end">
        <motion.div variants={filterVariants} className="relative inline-block">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/90 border border-border hover:bg-primary/80 transition-colors text-foreground"
          >
            <span className="text-sm font-bold text-card">
              {categories.find((c) => c.value === selectedCategory)?.label ||
                "Filter Posts"}
            </span>
            <motion.div
              animate={{ rotate: dropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ListFilter size={16} className="text-secondary" />
            </motion.div>
          </button>

          {/* Dropdown Menu with AnimatePresence */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 mt-2 w-56 bg-primary border border-border rounded-lg shadow-lg z-50"
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(null);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-secondary/90 transition-colors text-sm font-medium text-card border-b border-border"
                >
                  All Posts
                </button>
                {categories.map((category) => (
                  <button
                    type="button"
                    key={category.value}
                    onClick={() => {
                      setSelectedCategory(category.value);
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-secondary/90 transition-colors text-card text-sm font-medium border-b border-border last:border-b-0"
                  >
                    {category.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Posts with staggered animation and exit animations */}
      <AnimatePresence mode="popLayout">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              variants={postVariants}
              layout // Smooth reordering when filtering
            >
              <AnnouncementCard
                post={post}
                isOwner={currentUser && (post.user_id == currentUser.userID || post.user_id == currentUser.id)}
              />
            </motion.div>
          ))
        ) : (
          <div className="p-12 text-center bg-card-light border border-dashed border-border-light rounded-2xl">
            <p className="text-slate-400 font-medium italic">
              No announcements found matching your criteria.
            </p>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

import { useState, useEffect } from "react";
import { ChevronDown, ListFilter } from "lucide-react";
import AnnouncementCard from "../../announcement/components/AnnouncementCard";
import { motion, AnimatePresence } from 'framer-motion';
const categories = [
    "Event Announcement",
    "Project Announcement",
    "Community Post",
    "Connection Update",
];

function getDropdownOptionColor(category) {
    switch (category) {
        case "Event Announcement":
        case "Project Announcement":
        case "Community Post":
            return "text-card";
        case "Connection Update":
            return "text-card";
        default:
            return "text-card";
    }
}

export default function ActivityFeed({ posts = [] }) {
    const [feedPosts, setFeedPosts] = useState(posts);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        setFeedPosts(posts);
    }, [posts]);

    const filteredPosts = selectedCategory
        ? feedPosts.filter((post) => post.category === selectedCategory)
        : feedPosts;

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
            }
        }
    };

    // Individual post animation
    const postVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.3 }
        }
    };

    // Filter button animation
    const filterVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3, delay: 0.2 }
        }
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
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: -10,
            scale: 0.95,
            transition: {
                duration: 0.15,
                ease: "easeIn"
            }
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 pb-12"
        >
            {/* Filter Button */}
            <motion.div
                variants={filterVariants}
                className="relative inline-block ml-auto"
            >
                <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/90 border border-border hover:bg-primary/80 transition-colors text-foreground"
                >
                    <span className="text-sm font-bold text-card">
                        {selectedCategory || "Filter Posts"}
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
                                    key={category}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 hover:bg-secondary/90 transition-colors text-card text-sm font-medium border-b border-border last:border-b-0 ${getDropdownOptionColor(category)}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Posts with staggered animation and exit animations */}
            <AnimatePresence mode="popLayout">
                {filteredPosts.map((post) => (
                    <motion.div
                        key={post.id}
                        variants={postVariants}
                        layout // Smooth reordering when filtering
                    >
                        <AnnouncementCard post={post} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
}

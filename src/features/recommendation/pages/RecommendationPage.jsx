import React, { useState } from "react";
import ProfileCard from "../components/ProfileCard";
import FilterBar from "../components/FilterBar";
import { motion, AnimatePresence } from "framer-motion";

const MOCK_PROFILES = [
    {
        id: 1,
        name: "Abdulrahman Shalaby",
        role: "Senior Student",
        image: "https://placehold.co/150x150",
        tags: ["Reader", "Coder", "Morning person"],
        matchReasons: [
            "ENFP • Collaborative",
            "High empathy score",
            "Nearby campus",
        ],
        isBestMatch: true,
        category: "best",
    },
    {
        id: 2,
        name: "Youssef Nabil",
        role: "Senior Student",
        image: "https://placehold.co/150x150",
        tags: ["Reader", "ML Basics", "Night owl"],
        matchReasons: ["Weekend cycling", "Indie games", "Lo-fi playlists"],
        isBestMatch: false,
        category: "personality",
    },
    {
        id: 3,
        name: "Raghad Mohamed",
        role: "Junior Student",
        image: "https://placehold.co/150x150",
        tags: ["Coder", "Data Viz", "Morning person"],
        matchReasons: ["Alumni network", "Brand marketing", "Mutual endorsements"],
        isBestMatch: false,
        category: "professional",
    },
    {
        id: 4,
        name: "Hadeer Abdelhady",
        role: "Senior Student",
        image: "https://placehold.co/150x150",
        tags: ["Frontend", "Backend", "Team Lead"],
        matchReasons: ["React • Node", "Open to collab", "Hackathon wins"],
        isBestMatch: true,
        category: "professional",
    },
    {
        id: 5,
        name: "Youssef Mohamed",
        role: "Senior Student",
        image: "https://placehold.co/150x150",
        tags: ["Reader", "Algorithms", "Night owl"],
        matchReasons: [
            "Curious • Analytical",
            "Collaborative sprints",
            "Local coffee runs",
        ],
        isBestMatch: false,
        category: "personality",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 50,
            damping: 15,
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.2 },
    },
};

const RecommendationPage = () => {
    const [activeFilter, setActiveFilter] = useState("all");

    const filteredProfiles =
        activeFilter === "all"
            ? MOCK_PROFILES
            : MOCK_PROFILES.filter((p) => {
                if (activeFilter === "best") return p.isBestMatch;
                return p.category === activeFilter;
            });

    return (
        <div className="min-h-screen bg-background text-foreground p-6 sm:p-8 lg:p-12 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-10 bg-white rounded-3xl p-8 border border-neutral-200/60 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none transition-all duration-700 group-hover:bg-secondary/10"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                        <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl shadow-sm border border-secondary/20">
                            ✨
                        </div>
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-3xl font-bold text-primary mb-2 tracking-tight"
                            >
                                Recommended for you
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="text-muted-foreground max-w-2xl text-base leading-relaxed"
                            >
                                Matches are based on your Tags (e.g., Reader, Coder, Morning
                                person), skills you entered, plus personality and hobbies.
                            </motion.p>
                        </div>
                    </div>
                </div>

                {/* Filters and Actions */}
                <FilterBar
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                />

                {/* Profile Grid */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeFilter}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {filteredProfiles.length > 0 ? (
                                filteredProfiles.map((profile, index) => (
                                    <ProfileCard
                                        key={profile.id}
                                        profile={profile}
                                        variants={cardVariants}
                                    />
                                ))
                            ) : (
                                <motion.div
                                    variants={cardVariants}
                                    className="col-span-full py-20 text-center"
                                >
                                    <div className="inline-block p-6 rounded-full bg-neutral-50 mb-4">
                                        <span className="text-4xl">🔍</span>
                                    </div>
                                    <p className="text-muted-foreground text-lg font-medium">
                                        No matches found for this category.
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default RecommendationPage;

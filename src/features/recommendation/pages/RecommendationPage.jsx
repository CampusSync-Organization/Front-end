import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileCard from "../components/ProfileCard";
import FilterBar from "../components/FilterBar";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import {
  fetchRecommendations,
  selectRecommendations,
  selectRecommendationsStatus,
  selectRecommendationsError,
  setActiveMode,
  selectActiveMode,
} from "../store/recommendationSlice";
import { useNavigate } from "react-router-dom";

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

// ... existing imports

const RecommendationPage = () => {
  const dispatch = useDispatch();
  const activeFilter = useSelector(selectActiveMode);
  const recommendations = useSelector(selectRecommendations);
  const status = useSelector(selectRecommendationsStatus);
  const error = useSelector(selectRecommendationsError);
  const navigate = useNavigate();
  // This useEffect handles the "Single Source of Truth"
  // Whenever activeFilter changes in Redux, we fetch new data
  useEffect(() => {
    dispatch(
      fetchRecommendations(activeFilter === "all" ? null : activeFilter),
    );
  }, [dispatch, activeFilter]);

  const handleFilterChange = (filterId) => {
    dispatch(setActiveMode(filterId));
  };

  if (error?.includes("Student ID")) {
    navigate("/assessment");
  }
  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-8 lg:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* ... Header Section ... */}

        {/* Filters and Actions */}
        <FilterBar
          activeFilter={activeFilter}
          setActiveFilter={handleFilterChange}
        />

        {/* Profile Grid */}
        <div className="min-h-[400px]">
          {status === "loading" ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-secondary animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() =>
                  dispatch(
                    fetchRecommendations(
                      activeFilter === "all" ? null : activeFilter,
                    ),
                  )
                }
                className="px-4 py-2 bg-primary text-white rounded-xl"
              >
                Retry
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {/* key={activeFilter} ensures the animation triggers when switching */}
              <motion.div
                key={activeFilter}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {recommendations && recommendations.length > 0 ? (
                  recommendations.map((profile) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;

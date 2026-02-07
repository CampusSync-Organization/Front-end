
import React from "react";
import { Sparkles, Briefcase, Smile, RefreshCw, Filter } from "lucide-react";
import { motion } from "framer-motion";

const FilterBar = ({ activeFilter, setActiveFilter }) => {
    const filters = [
        { id: "all", label: "All Matches", icon: Filter },
        { id: "best", label: "Best Matches", icon: Sparkles },
        { id: "personality", label: "Personality", icon: Smile },
        { id: "professional", label: "Professional", icon: Briefcase },
    ];

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
                {filters.map((filter) => {
                    const Icon = filter.icon;
                    const isActive = activeFilter === filter.id;

                    return (
                        <button
                            key={filter.id}
                            onClick={() => setActiveFilter(filter.id)}
                            className={`
                        relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 border
                        ${isActive
                                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                    : "bg-white text-muted-foreground border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                                }
                    `}
                        >
                            <Icon
                                className={`w-4 h-4 ${isActive ? "text-secondary" : "text-muted-foreground"}`}
                            />
                            {filter.label}
                        </button>
                    );
                })}
            </div>

            <motion.button
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="p-2.5 bg-white text-primary border border-neutral-200 rounded-xl hover:shadow-md transition-all ml-auto sm:ml-0"
                title="Refresh Recommendations"
            >
                <RefreshCw className="w-5 h-5" />
            </motion.button>
        </div>
    );
};

export default FilterBar;

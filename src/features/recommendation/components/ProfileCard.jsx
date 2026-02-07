import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, UserPlus, Sparkles, Zap, Briefcase, ClockArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";


const ProfileCard = ({ profile, variants }) => {
    const { name, role, image, tags, matchReasons, isBestMatch } = profile;
    const navigate = useNavigate();
    const [request, setRequest] = useState(false)
    return (
        <motion.div
            variants={variants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative bg-white rounded-3xl p-5 shadow-soft hover:shadow-soft-lg transition-shadow duration-300 border border-neutral-200/60 overflow-hidden flex flex-col"
        >
            {/* Best Match Badge */}
            {isBestMatch && (
                <div className="absolute top-3 right-3 bg-secondary/10 text-secondary-dark px-3 py-1 rounded-full flex items-center gap-1.5 border border-secondary/20 z-10">
                    <Sparkles className="w-3 h-3 text-secondary" />
                    <span className="text-xs font-semibold text-secondary">
                        Best Match
                    </span>
                </div>
            )}

            {/* Profile Header */}
            <div className="flex flex-col items-center mb-6 pt-6">
                <div className="relative mb-3">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-neutral-50 shadow-sm">
                        <img
                            src={image || "https://placehold.co/80x80"}
                            alt={name}
                            loading="lazy"
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow-sm border border-neutral-100">
                        <div className="bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-primary mb-1 text-center">
                    {name}
                </h3>
                <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" />
                    {role}
                </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
                {tags.map((tag, i) => (
                    <span
                        key={i}
                        className="px-3 py-1.5 bg-neutral-50 text-neutral-600 text-xs font-medium rounded-lg border border-neutral-100/50"
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* Why This Match Section */}
            <div className="bg-background rounded-2xl p-4 mb-6 border border-neutral-100">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-indigo-50 rounded-lg">
                        <Zap className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-xs font-bold text-primary uppercase tracking-wide">
                        Why this match
                    </span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    {matchReasons.map((reason, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-neutral-100/80 shadow-sm"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-secondary/80"></div>
                            <span className="text-xs font-medium text-primary/80">
                                {reason}
                            </span>
                        </div>
                    ))}
                </div>
                <p className="mt-3 text-[10px] text-center text-muted-foreground/80 font-medium">
                    Based on shared interests & communication style
                </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto grid grid-cols-2 gap-3">
                <button onClick={() => navigate("/User-profile")} className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-neutral-200 text-primary text-sm font-semibold hover:bg-neutral-50 transition-colors">
                    <Eye className="w-4 h-4" />
                    View
                </button>
                <button onClick={() => setRequest(!request)}
                    className={
                        clsx("flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl  text-white text-sm font-semibold  shadow-lg shadow-primary/20 transition-all hover:translate-y-[-1px]",
                            request ? "bg-secondary hover:bg-secondary/80" : "bg-primary hover:bg-primary/80"
                        )} >
                    {request ? <ClockArrowDown></ClockArrowDown> : <UserPlus className="w-4 h-4" />}
                    {request ? "Pending" : "Connect"}
                </button>
            </div>
        </motion.div>
    );
};

export default ProfileCard;

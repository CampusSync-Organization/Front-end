import React from "react";
import { X, Plus } from "lucide-react";

export const TagList = ({
    tags,
    isUser = true,
    onTagClick,
    onAddClick,
    variant = "default",
    additionals
}) => {
    const getTagStyles = () => {
        switch (variant) {
            case "removable":
                return "bg-secondary/80 text-primary hover:bg-red-500 hover:text-white cursor-pointer group";
            case "selectable":
                return "border-2 border-dashed border-slate-300 text-slate-400 hover:border-secondary hover:text-secondary hover:bg-secondary/5 cursor-pointer";
            default:
                return "bg-secondary/30 text-secondary font-bold hover:bg-secondary/40";
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
                <span
                    key={index}
                    onClick={() => onTagClick && onTagClick(tag)}
                    className={`px-4 py-1.5 rounded-xl text-sm transition-all font-bold flex items-center ${additionals ?? "gap-2"} ${getTagStyles()}`}
                >
                    {variant === "selectable" && <Plus size={14} />}
                    {tag}
                    {variant === "removable" && (
                        <X size={14} className="opacity-70 group-hover:opacity-100" />
                    )}
                </span>
            ))}
            {isUser && onAddClick && (
                <button
                    onClick={onAddClick}
                    className="px-4 py-1.5 border-2 border-dashed border-slate-300 text-slate-400 rounded-xl text-sm hover:border-secondary hover:text-secondary transition-all flex items-center gap-1 font-bold"
                >
                    <Plus size={16} /> Add Tag
                </button>
            )}
        </div>
    );
};

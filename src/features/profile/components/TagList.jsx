import React from "react";

export const TagList = ({ tags }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="px-5 py-2 bg-amber-500/90 hover:bg-amber-500 text-white rounded-full shadow-sm cursor-default transition-colors"
        >
          <span className="text-sm font-semibold font-['Inter']">{tag}</span>
        </div>
      ))}
    </div>
  );
};

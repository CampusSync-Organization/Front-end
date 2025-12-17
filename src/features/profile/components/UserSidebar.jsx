import React from "react";
import { TagList } from "./TagList";

export const UserSidebar = ({ user }) => {
  return (
    <div className="bg-white rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] p-10 flex flex-col items-center text-center h-full min-h-[600px] justify-center text-['Inter']">
      {/* Content Container - Centered Vertically */}
      <div className="w-full flex flex-col items-center gap-6">
        <div className="relative">
          <img
            src={user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-white"
          />
        </div>

        <div>
          <h2 className="text-slate-900 text-2xl font-bold mb-1">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            {user.college} • {user.faculty}
          </p>
        </div>

        <div>
          <span className="inline-block px-4 py-1.5 bg-slate-50 text-slate-900 text-lg font-bold rounded-lg border border-slate-100">
            GPA : {user.gpa.toFixed(1)}
          </span>
        </div>

        {/* Tags - Centered */}
        <div className="w-full flex justify-center">
          <TagList tags={user.tags} />
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold py-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Last seen: {user.lastSeen}
        </div>

        {/* Buttons */}
        <div className="w-full flex gap-3 justify-center mt-4">
          <button className="flex-1 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm">
            Connect
          </button>
          <button className="flex-1 py-3 bg-gray-100 text-slate-700 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors">
            Message
          </button>
        </div>
      </div>
    </div>
  );
};

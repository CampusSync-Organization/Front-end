import React from "react";

const ProjectItem = ({ item }) => (
  <div className="w-full p-6 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-slate-900 text-lg font-semibold mb-1">
          {item.title}
        </h3>
        <div className="text-slate-500 text-sm font-medium">
          {item.category}
        </div>
      </div>
      <div
        className={`px-4 py-1 rounded-full text-xs font-bold ${
          item.status === "In-progress"
            ? "bg-amber-500 text-white"
            : "bg-gray-200 text-slate-600"
        }`}
      >
        {item.status}
      </div>
    </div>

    <div className="grid grid-cols-3 gap-8 py-4 border-t border-gray-50 border-b mb-4">
      <div>
        <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wide mb-1">
          Start Date
        </div>
        <div className="text-slate-700 text-xs font-bold">{item.startDate}</div>
      </div>
      <div>
        <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wide mb-1">
          End Date
        </div>
        <div className="text-slate-700 text-xs font-bold">{item.endDate}</div>
      </div>
      <div>
        <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wide mb-1">
          Members
        </div>
        <div className="text-slate-700 text-xs font-bold">{item.members}</div>
      </div>
    </div>

    <p className="text-slate-600 text-sm font-medium leading-relaxed">
      {item.description}
    </p>
  </div>
);

export const UserProjects = ({ projects }) => {
  return (
    <div className="bg-white rounded-3xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] p-10">
      <div className="mb-8">
        <h2 className="text-slate-900 text-xl font-bold">Projects</h2>
      </div>
      <div className="space-y-6">
        {projects.map((proj) => (
          <ProjectItem key={proj.id} item={proj} />
        ))}
      </div>
    </div>
  );
};

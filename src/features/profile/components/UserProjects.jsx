import React from "react";
import { CheckSquare } from "lucide-react";

const ProjectItem = ({ item }) => (
  <div className="group overflow-hidden rounded-xl border border-border-light hover:shadow-md transition-all bg-card-light">
    <div className="h-40 bg-slate-100 overflow-hidden relative">
      {/* Mock Image Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent z-10"></div>
      <img
        src={
          item.image ||
          "https://placehold.co/600x400/e2e8f0/1e293b?text=Project+Image"
        }
        alt={item.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      {item.featured && (
        <span className="absolute bottom-3 left-3 px-2 py-0.5 bg-secondary text-primary text-[10px] font-bold rounded z-20 shadow-sm">
          TOP PROJECT
        </span>
      )}
    </div>
    <div className="p-4">
      <h4 className="font-bold text-primary mb-1">{item.title}</h4>
      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
        {item.description}
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        {item.techStack &&
          item.techStack.map((tech, index) => (
            <span
              key={index}
              className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded border border-border-light"
            >
              {tech}
            </span>
          ))}
        {!item.techStack && (
          <>
            {/* Fallback mock tags if data doesn't exist */}
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded border border-border-light">
              React
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded border border-border-light">
              Firebase
            </span>
          </>
        )}
      </div>
    </div>
  </div>
);

export const UserProjects = ({ projects }) => {
  return (
    <section className="bg-card-light p-6 sm:p-8 rounded-xl shadow-sm border border-border-light">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-6 text-primary">
        <CheckSquare className="text-secondary" size={24} /> Projects
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <ProjectItem key={proj.id} item={proj} />
        ))}
      </div>
    </section>
  );
};

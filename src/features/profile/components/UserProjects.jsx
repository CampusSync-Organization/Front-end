import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { CheckSquare, Plus, X, Check, Image } from "lucide-react";
import { toast } from "sonner";
import { selectMyProfile } from "../store/profileSlice";
import { useEditableSection } from "../hooks/useEditableSection";
import { resolveAvatarUrl } from "../../../shared/hooks/resolveAvatarUrl";

const AddProjectForm = ({ onCancel }) => {
  const profile = useSelector(selectMyProfile);
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");

  const [initial] = useState(() => ({
    projects: Array.isArray(profile?.projects) ? profile.projects : [],
    project_image: null,
  }));

  const { updateDraft, save, isSaving } = useEditableSection(initial, {
    onSaved: () => {
      toast.success("Project added successfully!");
      onCancel();
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Project title is required");
      return;
    }

    const newProject = JSON.stringify({
      title: title.trim(),
      ...(description.trim() && { description: description.trim() }),
    });

    const existing = Array.isArray(profile?.projects) ? profile.projects : [];
    const updatedProjects = [...existing, newProject];

    updateDraft({ projects: updatedProjects, project_image: imageFile });
    await save();
  };

  return (
    <div className="col-span-full bg-secondary/5 border border-secondary/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-primary">Add New Project</h4>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={18} className="text-slate-400" />
        </button>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Project Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground placeholder-slate-400 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary text-sm font-bold"
        />

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 ml-1">
            Project Image (optional)
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-border-light rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:border-secondary transition-all"
            >
              <Image size={16} />
              {imageFile ? "Change Image" : "Choose Image"}
            </button>
            {imageFile && (
              <span className="text-xs text-slate-500 truncate max-w-[200px]">
                {imageFile.name}
              </span>
            )}
            {imageFile && (
              <button
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="text-xs text-red-500 hover:underline"
              >
                Remove
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {imagePreview && (
            <div className="mt-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-48 object-cover rounded-lg border border-border-light"
              />
            </div>
          )}
        </div>

        <textarea
          placeholder="Project description (optional)"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground placeholder-slate-400 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary resize-none text-sm"
        ></textarea>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-slate-600 font-medium hover:text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-8 py-2 bg-secondary text-primary font-bold rounded-lg hover:bg-secondary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : <><Check size={18} /> Add Project</>}
          </button>
        </div>
      </div>
    </div>
  );
};

const PROJECT_FALLBACK =
  "https://placehold.co/600x400/e2e8f0/1e293b?text=Project+Image";

const ProjectItem = ({ item }) => (
  <div className="group overflow-hidden rounded-xl border border-border-light hover:shadow-md transition-all bg-card-light">
    <div className="h-40 bg-slate-100 overflow-hidden relative">
      <img
        src={item.image ? resolveAvatarUrl(item.image) : PROJECT_FALLBACK}
        alt={item.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        onError={(e) => {
          if (e.target.src !== PROJECT_FALLBACK) {
            e.target.src = PROJECT_FALLBACK;
          }
        }}
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
      {item.techStack && item.techStack.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {item.techStack.map((tech, index) => (
            <span
              key={index}
              className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded border border-border-light"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);

export const UserProjects = ({ projects, isOwnProfile = true }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? projects : projects.slice(0, 2);

  return (
    <section className="bg-card-light p-6 sm:p-8 rounded-xl shadow-sm border border-border-light">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
          <CheckSquare className="text-secondary" size={24} /> Projects
        </h2>
        {isOwnProfile && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-secondary transition-colors px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-border-light"
          >
            <Plus size={16} />
            Add Project
          </button>
        )}
      </div>

      {isAdding && (
        <AddProjectForm onCancel={() => setIsAdding(false)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {displayed.map((proj) => (
          <ProjectItem key={proj.id} item={proj} />
        ))}
      </div>

      {projects.length === 0 && (
        <p className="text-center text-slate-400 py-8">
          No projects yet.
        </p>
      )}

      {projects.length > 2 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors px-6 py-2 bg-slate-50 rounded-full hover:bg-slate-100"
          >
            {showAll ? "Show less" : "Show all projects"}
            <span className="text-lg">{showAll ? "↑" : "→"}</span>
          </button>
        </div>
      )}
    </section>
  );
};

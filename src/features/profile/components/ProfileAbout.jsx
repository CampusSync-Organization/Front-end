import React, { useMemo } from "react";
import { Info, Edit2 } from "lucide-react";
import { TagList } from "./TagList";
import { useEditableSection } from "../hooks/useEditableSection";

const AVAILABLE_TAGS = [
  "Reader",
  "Coder",
  "Morning Person",
  "Night Owl",
  "Gamer",
  "Artist",
  "Musician",
  "Athlete",
  "Photographer",
  "Traveler",
  "Foodie",
];

export const ProfileAbout = ({ user, isOwnProfile = true }) => {
  const initialValues = useMemo(
    () => ({
      bio: user.bio || "",
      tags: user.tags || [],
    }),
    [user.bio, user.tags],
  );

  const {
    draft,
    updateDraft,
    isEditing,
    startEdit,
    cancelEdit,
    save,
    isSaving,
    error,
  } = useEditableSection(initialValues);

  const handleSave = async () => {
    await save();
  };

  const toggleTag = (tag) => {
    updateDraft({
      tags: draft.tags.includes(tag)
        ? draft.tags.filter((t) => t !== tag)
        : [...draft.tags, tag],
    });
  };

  return (
    <section className="bg-card-light p-6 sm:p-8 rounded-xl shadow-sm border border-border-light">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
          <Info className="text-secondary" size={24} /> About Me
        </h2>

        {!isEditing && isOwnProfile && (
          <button
            onClick={startEdit}
            className="text-slate-500 hover:text-primary transition-colors"
          >
            <Edit2 size={20} />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="mb-6">
          <textarea
            value={draft.bio}
            onChange={(e) => updateDraft({ bio: e.target.value })}
            rows="4"
            className="w-full p-4 bg-white rounded-lg border border-secondary focus:outline-none focus:ring-1 focus:ring-secondary text-slate-700 text-lg leading-relaxed resize-none mb-4"
          />
        </div>
      ) : (
        <p className="text-slate-600 leading-relaxed mb-6">
          {draft.bio || "No bio added yet."}
        </p>
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Interests & Tags
        </h3>

        {isEditing ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-xl border border-border-light">
              {draft.tags.length === 0 && (
                <span className="text-slate-400 text-sm">No tags selected</span>
              )}
              <TagList
                tags={draft.tags}
                isUser={isOwnProfile}
                onTagClick={(tag) => toggleTag(tag)}
                variant="removable"
              />
            </div>

            <div className="text-sm text-slate-500 font-medium">
              Available Tags (Click to add):
            </div>
            <TagList
              tags={AVAILABLE_TAGS.filter((t) => !draft.tags.includes(t))}
              isUser={isOwnProfile}
              onTagClick={(tag) => toggleTag(tag)}
              variant="selectable"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={cancelEdit}
                disabled={isSaving}
                className="px-6 py-2 text-slate-600 font-medium hover:text-primary hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 py-2 bg-secondary/80 text-card font-bold rounded-lg hover:bg-secondary/90 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        ) : (
          <TagList
            tags={draft.tags}
            isUser={isOwnProfile}
            onAddClick={startEdit}
            variant="default"
          />
        )}
      </div>
    </section>
  );
};

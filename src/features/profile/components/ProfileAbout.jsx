import React, { useState } from "react";

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

export const ProfileAbout = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user.bio);
  const [tags, setTags] = useState(user.tags);

  const handleSave = () => {
    // In a real app, dispatch an action here
    setIsEditing(false);
  };

  const handleCancel = () => {
    setBio(user.bio);
    setTags(user.tags);
    setIsEditing(false);
  };

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-slate-900 text-xl font-bold font-['Inter']">
          About Me
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="mb-6">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="4"
            className="w-full p-4 bg-white rounded-lg border border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-700 text-lg font-normal leading-relaxed resize-none mb-4"
          />
        </div>
      ) : (
        <p className="text-slate-700 text-lg font-normal leading-relaxed mb-8">
          {bio}
        </p>
      )}

      <h3 className="text-slate-900 text-xl font-bold font-['Inter'] mb-4">
        Tags
      </h3>

      {isEditing ? (
        <div className="space-y-4">
          {/* Selected Tags */}
          <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-xl border border-neutral-200">
            {tags.length === 0 && (
              <span className="text-slate-400 text-sm">No tags selected</span>
            )}
            {tags.map((tag, index) => (
              <div
                key={index}
                onClick={() => toggleTag(tag)}
                className="px-5 py-2 bg-amber-500 rounded-full shadow-sm hover:bg-red-500 transition-colors cursor-pointer group flex items-center gap-2"
              >
                <span className="text-white text-base font-medium font-['Inter']">
                  {tag}
                </span>
                <span className="text-white text-xs opacity-0 group-hover:opacity-100">
                  x
                </span>
              </div>
            ))}
          </div>

          <div className="text-sm text-slate-500 font-medium">
            Available Tags (Click to add):
          </div>
          {/* Available Tags Pool */}
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.filter((t) => !tags.includes(t)).map(
              (tag, index) => (
                <div
                  key={index}
                  onClick={() => toggleTag(tag)}
                  className="px-4 py-1 bg-white border border-slate-300 rounded-full hover:border-amber-500 hover:text-amber-600 cursor-pointer transition-colors"
                >
                  <span className="text-slate-600 text-sm font-medium font-['Inter']">
                    {tag}
                  </span>
                </div>
              )
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-6 py-2 text-slate-600 font-medium hover:text-slate-800 hover:underline"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-8 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-400 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="px-5 py-2 bg-amber-500 rounded-full shadow-sm cursor-default"
            >
              <span className="text-white text-base font-medium font-['Inter']">
                {tag}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState } from "react";
import { Megaphone, Plus } from "lucide-react";
import AnnouncementCard from "../../announcement/components/AnnouncementCard";

// Re-implementing the CreateForm for the "field" UX
const CreateAnnouncementForm = ({ onCancel }) => {
  return (
    <div className="w-full p-6 bg-card-light rounded-xl border border-secondary shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Course Name"
          className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground placeholder-slate-400 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
        />
        <input
          type="text"
          placeholder="Project Name"
          className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground placeholder-slate-400 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="date"
          className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
        />
        <input
          type="date"
          className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
        />
        <input
          type="number"
          placeholder="Members Needed"
          className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground placeholder-slate-400 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
        />
      </div>
      <div className="mb-6">
        <textarea
          placeholder="Notes"
          rows="3"
          className="w-full p-3 bg-slate-50 rounded-lg border border-border-light text-foreground placeholder-slate-400 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary resize-none"
        ></textarea>
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-slate-600 font-medium hover:text-primary hover:underline"
        >
          Cancel
        </button>
        <button className="px-8 py-2 bg-secondary text-primary font-bold rounded-lg hover:bg-secondary/90 transition-colors">
          Post
        </button>
      </div>
    </div>
  );
};

export const ProfileAnnouncements = ({
  user,
  announcements,
  isOwnProfile = true,
}) => {
  const [isCreating, setIsCreating] = useState(false);

  // Transform profile announcements to match AnnouncementCard expectations
  const posts = announcements.map((ann) => ({
    id: ann.id,
    author: user ? `${user.firstName} ${user.lastName}` : "Me",
    avatar: user ? `${user.firstName[0]}${user.lastName[0]}` : "ME",
    timeAgo: "Posted recently", // Mock
    content: ann.description,
    category: "Project Announcement", // Force category to match style
    likes: 0,
    comments: 0,
    shares: 0,
    liked: false,
    projectDetails: {
      courseName: ann.category, // Using category as course name substitute
      projectName: ann.title,
      deadline: ann.endDate,
      peopleNeeded: ann.members,
      peopleCurrent: 1, // Mock
      additionalNotes: "Contact for details",
    },
  }));

  return (
    <section className="bg-card-light p-6 sm:p-8 rounded-xl shadow-sm border border-border-light">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
          <Megaphone className="text-secondary" size={24} /> Announcements
        </h2>
      </div>

      {isOwnProfile &&
        (!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full p-4 mb-8 bg-slate-50 rounded-xl border border-border-light text-left text-slate-500 text-base hover:bg-slate-100 hover:border-secondary transition-all"
          >
            Create new announcement...
          </button>
        ) : (
          <CreateAnnouncementForm onCancel={() => setIsCreating(false)} />
        ))}

      <div className="space-y-4">
        {posts.map((post) => (
          <AnnouncementCard key={post.id} post={post} isOwner={isOwnProfile} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button className="inline-flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors px-6 py-2 bg-slate-50 rounded-full hover:bg-slate-100">
          Show all announcements
          <span className="text-lg">→</span>
        </button>
      </div>
    </section>
  );
};

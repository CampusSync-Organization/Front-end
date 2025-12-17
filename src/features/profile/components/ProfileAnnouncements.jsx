import React, { useState } from "react";

const AnnouncementCard = ({ announcement }) => (
  <div className="w-full p-6 bg-white rounded-xl border border-neutral-200 hover:shadow-md transition-shadow">
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
      <div>
        <h3 className="text-slate-900 text-xl font-semibold font-['Inter'] mb-1">
          {announcement.title}
        </h3>
        <p className="text-slate-500 text-sm font-medium">
          {announcement.category}
        </p>
      </div>
      <span
        className={`px-4 py-1 text-sm font-medium text-white rounded-full self-start ${
          announcement.status === "Done" ? "bg-neutral-400" : "bg-blue-500"
        } ${announcement.status !== "Done" ? "bg-amber-500" : ""}`}
      >
        {announcement.status}
      </span>
    </div>

    <div className="grid grid-cols-3 gap-8 mb-4">
      <div>
        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
          Start Date
        </div>
        <div className="text-slate-700 text-sm font-semibold">
          {announcement.startDate}
        </div>
      </div>
      <div>
        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
          Deadline
        </div>
        <div className="text-slate-700 text-sm font-semibold">
          {announcement.endDate}
        </div>
      </div>
      <div>
        <div className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">
          Members Needed
        </div>
        <div className="text-slate-700 text-sm font-semibold">
          {announcement.members}
        </div>
      </div>
    </div>

    <p className="text-slate-600 text-sm leading-relaxed">
      {announcement.description}
    </p>
  </div>
);

const CreateAnnouncementForm = ({ onCancel }) => {
  return (
    <div className="w-full p-6 bg-white rounded-xl border border-amber-400 shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Course Name"
          className="w-full p-3 bg-white rounded-lg border border-neutral-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
        <input
          type="text"
          placeholder="Project Name"
          className="w-full p-3 bg-white rounded-lg border border-neutral-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="date"
          className="w-full p-3 bg-white rounded-lg border border-neutral-200 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
        <input
          type="date"
          className="w-full p-3 bg-white rounded-lg border border-neutral-200 text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
        <input
          type="number"
          placeholder="Members Needed"
          className="w-full p-3 bg-white rounded-lg border border-neutral-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
      </div>
      <div className="mb-6">
        <textarea
          placeholder="Notes"
          rows="3"
          className="w-full p-3 bg-white rounded-lg border border-neutral-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
        ></textarea>
      </div>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-slate-600 font-medium hover:text-slate-800 hover:underline"
        >
          Cancel
        </button>
        <button className="px-8 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-300 transition-colors">
          Post
        </button>
      </div>
    </div>
  );
};

export const ProfileAnnouncements = ({ announcements }) => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-slate-900 text-xl font-bold font-['Inter']">
          Announcements
        </h2>
      </div>

      {!isCreating ? (
        <button
          onClick={() => setIsCreating(true)}
          className="w-full p-4 mb-8 bg-white rounded-xl border border-neutral-200 text-left text-slate-500 text-base hover:bg-gray-50 transition-colors"
        >
          Create new announcement...
        </button>
      ) : (
        <CreateAnnouncementForm onCancel={() => setIsCreating(false)} />
      )}

      <div className="space-y-6">
        {announcements.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button className="inline-flex items-center gap-2 text-slate-800 font-medium hover:text-slate-600 transition-colors">
          Show all announcements
          <span className="text-lg">→</span>
        </button>
      </div>
    </div>
  );
};

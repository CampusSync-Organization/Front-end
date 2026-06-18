import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Inbox, X, Check, Layers, Rss } from "lucide-react";
import { toast } from "sonner";
import AnnouncementCard from "./AnnouncementCard";

import {
  fetchAnnouncements, createAnnouncement,
  selectAllAnnouncements, selectAnnouncementStatus,
} from "../store/announcementSlice";
import { getErrorMessage } from "../../auth/utils/getErrorMessage";
import { resolveAvatarUrl } from "../../../shared/hooks/resolveAvatarUrl";

function UserAvatar({ user }) {
  const [broken, setBroken] = useState(false);
  const avatar = resolveAvatarUrl(user?.avatar_url);
  const name = user?.name ?? "";
  const ini = name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
  if (avatar && !broken) return <img src={avatar} alt={name} onError={() => setBroken(true)} className="w-9 h-9 rounded-full object-cover shrink-0" />;
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
      style={{ background: "#14213D", color: "#FCA311" }}>
      {ini}
    </div>
  );
}

function ComposeBox() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    announcement_type: "project-announcement",
    course_name: "", project_name: "", start_date: "",
    deadline: "", num_members: "", content: "",
  });

  const inp = "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-800 focus:outline-none focus:border-blue-300 transition-colors placeholder:text-gray-400";

  const reset = () => {
    setForm({ announcement_type: "project-announcement", course_name: "", project_name: "", start_date: "", deadline: "", num_members: "", content: "" });
    setOpen(false);
  };

  const handlePost = async () => {
    if (!form.course_name.trim()) { toast.error("Course name is required"); return; }
    if (form.announcement_type === "project-announcement" && (!form.num_members || +form.num_members < 1)) {
      toast.error("Members needed must be at least 1"); return;
    }
    setSaving(true);
    try {
      const payload = { ...form };
      if (form.announcement_type === "connection-update") {
        delete payload.project_name; delete payload.start_date;
        delete payload.deadline; delete payload.num_members;
      } else { payload.num_members = parseInt(payload.num_members); }
      await dispatch(createAnnouncement(payload)).unwrap();
      toast.success("Posted!"); reset();
    } catch (e) { toast.error(getErrorMessage(e, "Failed to post")); }
    finally { setSaving(false); }
  };

  if (open) return (
    <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
        <UserAvatar user={user} />
        <p className="flex-1 text-[14px] font-bold text-gray-900">New Announcement</p>
        <button onClick={reset} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center">
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <div className="flex gap-2">
        {[["project-announcement", "Project", Layers], ["connection-update", "Update", Rss]].map(([val, label, Icon]) => (
          <button key={val} onClick={() => setForm({ ...form, announcement_type: val })}
            style={form.announcement_type === val ? { background: "#14213D", borderColor: "#14213D" } : {}}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[13px] font-semibold border transition-all ${form.announcement_type === val ? "text-white" : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"}`}>
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>
      <input className={inp} placeholder="Course name *" value={form.course_name} onChange={(e) => setForm({ ...form, course_name: e.target.value })} />
      <input className={inp} placeholder="Project title (optional)" value={form.project_name} onChange={(e) => setForm({ ...form, project_name: e.target.value })} />
      {form.announcement_type === "project-announcement" && (
        <div className="grid grid-cols-2 gap-2">
          <input type="date" className={inp} value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
          <input type="date" className={inp} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          <input type="number" className={inp + " col-span-2"} placeholder="Team members needed (min 1)" value={form.num_members} onChange={(e) => setForm({ ...form, num_members: e.target.value })} />
        </div>
      )}
      <textarea rows={3} className={inp + " resize-none"} placeholder={`What's new, ${user?.name?.split(" ")[0] ?? "you"}?`} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
      <div className="flex justify-end gap-2 pt-1">
        <button onClick={reset} className="px-4 py-2 text-[13px] font-semibold text-gray-400 hover:text-gray-700 transition-colors">Cancel</button>
        <button onClick={handlePost} disabled={saving}
          style={{ background: "#14213D" }}
          className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-[13px] font-bold text-white hover:opacity-90 disabled:opacity-50 transition-colors">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          {saving ? "Posting…" : "Post It!"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm px-4 py-3.5 flex items-center gap-3">
      <button
        id="create-announcement-trigger"
        onClick={() => setOpen(true)}
        className="flex-1 text-left px-4 py-2.5 rounded-full bg-gray-100 text-[13.5px] text-gray-400 hover:bg-gray-200 transition-colors"
      >
        What's new, {user?.name?.split(" ")[0] ?? "you"}?
      </button>
      <button
        onClick={() => setOpen(true)}
        style={{ background: "#14213D" }}
        className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white hover:opacity-90 transition-colors"
      >
        Post It!
      </button>
    </div>
  );
}

export default function AnnouncementFeed() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllAnnouncements);
  const status = useSelector(selectAnnouncementStatus);
  const currentUser = useSelector((s) => s.auth.user);

  useEffect(() => { if (status === "idle") dispatch(fetchAnnouncements()); }, [status, dispatch]);

  return (
    <div className="space-y-4 pb-10">
      {/* Compose box */}
      <ComposeBox />

      {/* Posts */}
      {status === "loading" && posts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm flex items-center justify-center py-20">
          <Loader2 className="w-5 h-5 animate-spin text-gray-300" />
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center py-20 text-center">
          <Inbox className="w-8 h-8 text-gray-200 mb-3" />
          <p className="text-[14px] font-semibold text-gray-400">No posts yet</p>
          <p className="text-[12px] text-gray-300 mt-1">Be the first to share something.</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              layout
            >
              <AnnouncementCard
                post={post}
                isOwner={currentUser && (post.user_id == currentUser.userID || post.user_id == currentUser.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}

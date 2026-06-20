import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Camera, Edit2, Check, X, Plus, Loader2, GraduationCap,
  UsersRound, Bell, Shield, Lock, Megaphone, FolderOpen,
  User, Tag, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import { resolveAvatarUrl } from "../../../shared/hooks/resolveAvatarUrl";
import { UserAvatar } from "../../../shared/ui/UserAvatar";
import { useEditableSection } from "../hooks/useEditableSection";
import AnnouncementCard from "../../announcement/components/AnnouncementCard";

import {
  fetchMyProfile, updateMyProfile,
  selectMyProfile, selectProfileError, selectProfileStatus,
} from "../store/profileSlice";
import {
  fetchConnections, fetchPendingConnectionRequests,
  selectConnectedUserIds, selectPendingRequesterIds,
} from "../../../services/connections/store/connectionsSlice";
import {
  fetchMyAnnouncements, createAnnouncement,
  selectMyAnnouncements, selectMyAnnouncementStatus,
} from "../../announcement/store/announcementSlice";

/* ── helpers ─────────────────────────────────────────────────────────── */
const splitName = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] || "Student", lastName: parts.slice(1).join(" ") };
};

const mapProjects = (projects = []) =>
  projects.map((p, i) => {
    if (typeof p === "string") {
      try { const o = JSON.parse(p); return { id: i, title: o.title || p, description: o.description || "", image: o.image || null, techStack: o.techStack || [] }; }
      catch { return { id: i, title: p, description: "", image: null, techStack: [] }; }
    }
    return { id: i, title: p.title || "Project", description: p.description || "", image: p.image || p.image_url || null, techStack: p.techStack || [] };
  });

const TAGS = ["Reader","Coder","Morning Person","Night Owl","Gamer","Artist","Musician","Athlete","Photographer","Traveler","Foodie"];

/* ── small atoms ─────────────────────────────────────────────────────── */
const Chip = ({ label, onRemove, color = "default" }) => {
  const base = color === "amber"
    ? "bg-secondary/15 text-secondary border-secondary/20"
    : "bg-primary/8 text-primary border-primary/10";
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${base}`}>
      {label}
      {onRemove && (
        <button onClick={onRemove} className="hover:opacity-70 transition-opacity">
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

const SectionCard = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-outline-variant/15 shadow-sm ${className}`}>
    {children}
  </div>
);

const InlineInput = ({ value, onChange, placeholder, multiline, rows = 3 }) =>
  multiline ? (
    <textarea
      value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder}
      className="w-full px-4 py-3 bg-[#f5f6fa] border border-outline-variant/20 rounded-xl text-[14px] text-on-surface focus:outline-none focus:border-primary/40 resize-none transition-colors"
    />
  ) : (
    <input
      type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-4 py-3 bg-[#f5f6fa] border border-outline-variant/20 rounded-xl text-[14px] text-on-surface focus:outline-none focus:border-primary/40 transition-colors"
    />
  );

const SaveRow = ({ onSave, onCancel, isSaving, error }) => (
  <div className="flex items-center justify-end gap-2 mt-4">
    {error && <p className="text-xs text-red-500 mr-auto">{error}</p>}
    <button onClick={onCancel} disabled={isSaving} className="px-4 py-1.5 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50">Cancel</button>
    <button onClick={onSave} disabled={isSaving} className="flex items-center gap-1.5 px-5 py-1.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50">
      {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
      {isSaving ? "Saving…" : "Save"}
    </button>
  </div>
);

/* ── tabs ────────────────────────────────────────────────────────────── */
const TABS = [
  { key: "overview", label: "Overview", Icon: User },
  { key: "projects", label: "Projects", Icon: FolderOpen },
  { key: "announcements", label: "Announcements", Icon: Megaphone },
  { key: "settings", label: "Settings", Icon: Shield },
];

/* ══════════════════════════════════════════════════════════════════════
   ProfilePage
══════════════════════════════════════════════════════════════════════ */
const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetched = useRef(false);
  const fileInputRef = useRef(null);

  const profile     = useSelector(selectMyProfile);
  const status      = useSelector(selectProfileStatus);
  const error       = useSelector(selectProfileError);
  const connIds     = useSelector(selectConnectedUserIds);
  const pendingIds  = useSelector(selectPendingRequesterIds);
  const announcements      = useSelector(selectMyAnnouncements);
  const announcementStatus = useSelector(selectMyAnnouncementStatus);

  const [tab, setTab] = useState("overview");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarBroken, setAvatarBroken] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);

  useEffect(() => {
    if (!fetched.current && !profile && status !== "loading") {
      fetched.current = true;
      dispatch(fetchMyProfile());
    }
    dispatch(fetchConnections());
    dispatch(fetchPendingConnectionRequests());
  }, [dispatch]);

  useEffect(() => {
    if (tab === "announcements" && announcementStatus === "idle") {
      dispatch(fetchMyAnnouncements());
    }
  }, [tab, announcementStatus, dispatch]);

  // ── derived ──────────────────────────────────────────────────────────
  const { firstName, lastName } = splitName(profile?.name);
  const fullName = `${firstName} ${lastName}`.trim();
  const resolvedAvatar = resolveAvatarUrl(avatarPreview || profile?.avatar_url);
  const projects = mapProjects(Array.isArray(profile?.projects) ? profile.projects : []);

  // ── avatar upload ─────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarFile(file);
  };

  const handleSaveAvatar = async () => {
    if (!avatarFile) return;
    setSavingAvatar(true);
    try {
      await dispatch(updateMyProfile({ avatar: avatarFile })).unwrap();
      setAvatarPreview(null); setAvatarFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Photo updated.");
    } catch { toast.error("Failed to update photo."); }
    finally { setSavingAvatar(false); }
  };

  const handleCancelAvatar = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(null); setAvatarFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── loading / error ───────────────────────────────────────────────────
  if (status === "loading" || (status === "idle" && !profile)) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    );
  }

  if (status === "failed" || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <p className="text-on-surface-variant/60 font-medium">{error || "Profile not found."}</p>
        <button onClick={() => dispatch(fetchMyProfile())} className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold">Retry</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2f7]">

      {/* ── Cover ────────────────────────────────────────────────────── */}
      <div
        className="h-36 sm:h-44 w-full relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d1b2a 0%, #14213D 45%, #1a2f52 75%, #0d1b2a 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle, #FCA311 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      {/* ── Identity card ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-outline-variant/15 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">

          {/* Row 1: avatar (overlaps cover) + edit badge */}
          <div className="flex items-end gap-4 -mt-14">
            <div className="relative shrink-0">
              <div
                className="w-28 h-28 rounded-2xl ring-4 ring-white shadow-xl overflow-hidden bg-slate-200 cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                {resolvedAvatar && !avatarBroken ? (
                  <img src={resolvedAvatar} alt={fullName} onError={() => setAvatarBroken(true)} className="w-full h-full object-cover" />
                ) : (
                  <UserAvatar name={fullName} className="w-full h-full text-4xl" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                  <Camera className="text-white" size={22} />
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              {!avatarFile && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-7 h-7 bg-secondary text-primary rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                >
                  <Camera size={13} />
                </button>
              )}
            </div>

            {/* avatar-save prompt floats beside avatar, pinned to bottom */}
            {avatarFile && (
              <div className="flex items-center gap-3 pb-1">
                <p className="text-sm font-semibold text-on-surface-variant">Save new photo?</p>
                <button onClick={handleSaveAvatar} disabled={savingAvatar}
                  className="px-4 py-1.5 bg-primary text-white rounded-xl text-sm font-bold disabled:opacity-60 hover:bg-primary/90">
                  {savingAvatar ? "Saving…" : "Save"}
                </button>
                <button onClick={handleCancelAvatar} className="text-sm text-on-surface-variant/60 hover:text-primary font-medium">Cancel</button>
              </div>
            )}
          </div>

          {/* Row 2: name + stats — fully on white */}
          <div className="pt-4 pb-5">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">{fullName || "Student"}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/6 text-primary rounded-full text-sm font-bold">
                <GraduationCap className="w-3.5 h-3.5 text-secondary" />
                GPA {profile.cgpa ? Number(profile.cgpa).toFixed(1) : "N/A"}
              </span>
              <button
                onClick={() => navigate("/profile/connections")}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/6 text-primary rounded-full text-sm font-semibold hover:bg-primary/10 transition-colors"
              >
                <UsersRound className="w-3.5 h-3.5" />
                {connIds.length} {connIds.length === 1 ? "Connection" : "Connections"}
                {pendingIds.length > 0 && (
                  <span className="flex items-center gap-0.5 text-secondary font-bold ml-1">
                    <Bell className="w-3 h-3" />{pendingIds.length}
                  </span>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── Tab bar ──────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-20 bg-[#f0f2f7] border-b border-outline-variant/15">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {TABS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                tab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant/60 hover:text-primary"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab content ──────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* OVERVIEW ─────────────────────────────────────────────────── */}
        {tab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <BioSection profile={profile} />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <TagsSection profile={profile} />
              <QuickStatsCard cgpa={profile.cgpa} connections={connIds.length} projects={projects.length} />
            </div>
          </div>
        )}

        {/* PROJECTS ─────────────────────────────────────────────────── */}
        {tab === "projects" && <ProjectsSection profile={profile} projects={projects} />}

        {/* ANNOUNCEMENTS ────────────────────────────────────────────── */}
        {tab === "announcements" && <AnnouncementsSection announcements={announcements} status={announcementStatus} />}

        {/* SETTINGS ─────────────────────────────────────────────────── */}
        {tab === "settings" && <SettingsSection profile={profile} firstName={firstName} lastName={lastName} />}

      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   Tab sections
══════════════════════════════════════════════════════════════════════ */

/* Bio ───────────────────────────────────────────────────────────────── */
const BioSection = ({ profile }) => {
  const init = useMemo(() => ({ bio: profile.bio || "" }), [profile.bio]);
  const { draft, updateDraft, isEditing, startEdit, cancelEdit, save, isSaving, error } = useEditableSection(init);
  return (
    <SectionCard className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[15px] font-bold text-primary">About</h2>
        {!isEditing && (
          <button onClick={startEdit} className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant/60 hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-primary/5">
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
        )}
      </div>
      {isEditing ? (
        <>
          <InlineInput value={draft.bio} onChange={(v) => updateDraft({ bio: v })} placeholder="Write a short bio…" multiline rows={4} />
          <SaveRow onSave={save} onCancel={cancelEdit} isSaving={isSaving} error={error} />
        </>
      ) : (
        <p className="text-[14px] leading-7 text-on-surface-variant/80">
          {draft.bio || <span className="italic text-on-surface-variant/40">No bio yet. Click Edit to add one.</span>}
        </p>
      )}
    </SectionCard>
  );
};

/* Tags ──────────────────────────────────────────────────────────────── */
const TagsSection = ({ profile }) => {
  const init = useMemo(() => ({ tags: Array.isArray(profile.tags) ? profile.tags : [] }), [profile.tags]);
  const { draft, updateDraft, isEditing, startEdit, cancelEdit, save, isSaving, error } = useEditableSection(init);
  const toggle = (tag) =>
    updateDraft({ tags: draft.tags.includes(tag) ? draft.tags.filter((t) => t !== tag) : [...draft.tags, tag] });
  return (
    <SectionCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-bold text-primary flex items-center gap-2">
          <Tag className="w-4 h-4 text-secondary" /> Interests
        </h2>
        {!isEditing && (
          <button onClick={startEdit} className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant/60 hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-primary/5">
            <Edit2 className="w-3.5 h-3.5" /> Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <>
          <div className="flex flex-wrap gap-2 mb-3 min-h-[36px]">
            {draft.tags.length === 0
              ? <span className="text-xs text-on-surface-variant/40 italic">None selected</span>
              : draft.tags.map((t) => <Chip key={t} label={t} onRemove={() => toggle(t)} color="amber" />)}
          </div>
          <p className="text-[11px] text-on-surface-variant/40 font-semibold uppercase tracking-widest mb-2">Add tags</p>
          <div className="flex flex-wrap gap-1.5">
            {TAGS.filter((t) => !draft.tags.includes(t)).map((t) => (
              <button key={t} onClick={() => toggle(t)}
                className="px-3 py-1 rounded-full text-xs font-semibold border border-outline-variant/20 text-on-surface-variant/60 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all">
                {t}
              </button>
            ))}
          </div>
          <SaveRow onSave={save} onCancel={cancelEdit} isSaving={isSaving} error={error} />
        </>
      ) : (
        <div className="flex flex-wrap gap-2">
          {draft.tags.length === 0
            ? <span className="text-xs italic text-on-surface-variant/40">No interests added.</span>
            : draft.tags.map((t) => <Chip key={t} label={t} color="amber" />)}
        </div>
      )}
    </SectionCard>
  );
};

/* Quick stats ───────────────────────────────────────────────────────── */
const QuickStatsCard = ({ cgpa, connections, projects }) => (
  <SectionCard className="p-6">
    <h2 className="text-[15px] font-bold text-primary mb-4">Stats</h2>
    <div className="space-y-3">
      {[
        { label: "GPA", value: cgpa ? Number(cgpa).toFixed(2) : "N/A" },
        { label: "Connections", value: connections },
        { label: "Projects", value: projects },
      ].map(({ label, value }) => (
        <div key={label} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
          <span className="text-sm text-on-surface-variant/60 font-medium">{label}</span>
          <span className="text-sm font-bold text-primary">{value}</span>
        </div>
      ))}
    </div>
  </SectionCard>
);

/* Projects ──────────────────────────────────────────────────────────── */
const ProjectsSection = ({ profile, projects }) => {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const dispatch = useDispatch();
  const { save: saveEdit, isSaving, updateDraft } = useEditableSection(
    useMemo(() => ({ projects: Array.isArray(profile.projects) ? profile.projects : [] }), [profile.projects]),
    { onSaved: () => { setAdding(false); setTitle(""); setDesc(""); toast.success("Project added!"); } }
  );

  const handleAdd = async () => {
    if (!title.trim()) { toast.error("Title is required"); return; }
    const existing = Array.isArray(profile.projects) ? profile.projects : [];
    const newEntry = JSON.stringify({ title: title.trim(), description: desc.trim() });
    updateDraft({ projects: [...existing, newEntry] });
    await saveEdit();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-primary">Projects</h2>
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {adding && (
        <SectionCard className="p-6">
          <h3 className="text-sm font-bold text-primary mb-4">New Project</h3>
          <div className="space-y-3">
            <InlineInput value={title} onChange={setTitle} placeholder="Project title" />
            <InlineInput value={desc} onChange={setDesc} placeholder="Short description (optional)" multiline rows={2} />
          </div>
          <div className="flex items-center justify-end gap-2 mt-4">
            <button onClick={() => setAdding(false)} className="text-sm font-semibold text-on-surface-variant/60 hover:text-primary px-3 py-1.5">Cancel</button>
            <button onClick={handleAdd} disabled={isSaving}
              className="flex items-center gap-1.5 px-5 py-1.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 disabled:opacity-50">
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              {isSaving ? "Saving…" : "Add"}
            </button>
          </div>
        </SectionCard>
      )}

      {projects.length === 0 && !adding ? (
        <SectionCard className="p-12 text-center">
          <FolderOpen className="w-10 h-10 text-on-surface-variant/20 mx-auto mb-3" />
          <p className="text-sm font-semibold text-on-surface-variant/50">No projects yet</p>
          <p className="text-xs text-on-surface-variant/35 mt-1">Add your first project to showcase your work.</p>
        </SectionCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <SectionCard key={p.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mb-4">
                <FolderOpen className="w-5 h-5 text-primary/60" />
              </div>
              <h3 className="font-bold text-[14px] text-primary mb-1 truncate">{p.title}</h3>
              <p className="text-xs text-on-surface-variant/60 leading-relaxed line-clamp-2">
                {p.description || "No description."}
              </p>
              {p.techStack?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {p.techStack.map((t) => <Chip key={t} label={t} />)}
                </div>
              )}
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
};

/* Announcements ─────────────────────────────────────────────────────── */
const AnnouncementsSection = ({ announcements, status }) => {
  const dispatch = useDispatch();
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ course_name: "", content: "", num_members: "" });

  const handleCreate = async () => {
    if (!form.course_name.trim()) { toast.error("Course name is required"); return; }
    try {
      await dispatch(createAnnouncement({ announcement_type: "project-announcement", ...form, num_members: Number(form.num_members) || 1 })).unwrap();
      toast.success("Announcement created!");
      setCreating(false);
      setForm({ course_name: "", content: "", num_members: "" });
    } catch (e) { toast.error("Failed to create announcement."); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-primary">My Announcements</h2>
        <button onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> New
        </button>
      </div>

      {creating && (
        <SectionCard className="p-6">
          <h3 className="text-sm font-bold text-primary mb-4">New Announcement</h3>
          <div className="space-y-3">
            <InlineInput value={form.course_name} onChange={(v) => setForm((f) => ({ ...f, course_name: v }))} placeholder="Course name *" />
            <InlineInput value={form.num_members} onChange={(v) => setForm((f) => ({ ...f, num_members: v }))} placeholder="Members needed (e.g. 3)" />
            <InlineInput value={form.content} onChange={(v) => setForm((f) => ({ ...f, content: v }))} placeholder="Details (optional)" multiline rows={3} />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setCreating(false)} className="text-sm font-semibold text-on-surface-variant/60 hover:text-primary px-3 py-1.5">Cancel</button>
            <button onClick={handleCreate}
              className="flex items-center gap-1.5 px-5 py-1.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90">
              <Check className="w-3.5 h-3.5" /> Post
            </button>
          </div>
        </SectionCard>
      )}

      {status === "loading" ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary/40" /></div>
      ) : announcements?.length === 0 ? (
        <SectionCard className="p-12 text-center">
          <Megaphone className="w-10 h-10 text-on-surface-variant/20 mx-auto mb-3" />
          <p className="text-sm font-semibold text-on-surface-variant/50">No announcements yet</p>
        </SectionCard>
      ) : (
        <div className="space-y-3">
          {announcements?.map((a) => <AnnouncementCard key={a.id} announcement={a} />)}
        </div>
      )}
    </div>
  );
};

/* Settings ──────────────────────────────────────────────────────────── */
const SettingsField = ({ label, field, isEditing, draft, updateDraft }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest">{label}</label>
    {isEditing
      ? <InlineInput value={draft[field]} onChange={(v) => updateDraft({ [field]: v })} placeholder={label} />
      : <div className="px-4 py-3 bg-[#f5f6fa] border border-outline-variant/15 rounded-xl text-[14px] text-on-surface font-medium">
          {draft[field] || <span className="text-on-surface-variant/40 italic">Not set</span>}
        </div>}
  </div>
);

const SettingsSection = ({ profile, firstName, lastName }) => {
  const init = useMemo(() => ({
    firstName, lastName, gpa: profile.cgpa ?? "",
  }), [firstName, lastName, profile.cgpa]);

  const buildPayload = useCallback((draft, original) => {
    const payload = {};
    const nextName = `${draft.firstName.trim()} ${draft.lastName.trim()}`.trim();
    const origName = `${original.firstName.trim()} ${original.lastName.trim()}`.trim();
    if (nextName !== origName) payload.name = nextName;
    if (String(draft.gpa) !== String(original.gpa)) payload.cgpa = Number(draft.gpa);
    return payload;
  }, []);

  const { draft, updateDraft, isEditing, startEdit, cancelEdit, save, isSaving, error } = useEditableSection(init, { buildPayload });

  const [changingPw, setChangingPw] = useState(false);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Profile info */}
      <SectionCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[15px] font-bold text-primary flex items-center gap-2">
            <User className="w-4 h-4 text-secondary" /> Profile Info
          </h2>
          {!isEditing && (
            <button onClick={startEdit}
              className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant/60 hover:text-primary px-3 py-1.5 rounded-xl hover:bg-primary/5 transition-colors">
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SettingsField label="First Name" field="firstName" isEditing={isEditing} draft={draft} updateDraft={updateDraft} />
          <SettingsField label="Last Name" field="lastName" isEditing={isEditing} draft={draft} updateDraft={updateDraft} />
          <SettingsField label="GPA" field="gpa" isEditing={isEditing} draft={draft} updateDraft={updateDraft} />
        </div>
        {isEditing && <SaveRow onSave={save} onCancel={cancelEdit} isSaving={isSaving} error={error} />}
      </SectionCard>

      {/* Security */}
      <SectionCard className="p-6">
        <h2 className="text-[15px] font-bold text-primary flex items-center gap-2 mb-5">
          <Shield className="w-4 h-4 text-secondary" /> Security
        </h2>
        <div className="flex items-center justify-between p-4 bg-[#f5f6fa] rounded-xl border border-outline-variant/15">
          <div>
            <p className="text-sm font-bold text-primary">Password</p>
            <p className="text-xs text-on-surface-variant/50 mt-0.5">Keep your account secure</p>
          </div>
          {!changingPw && (
            <button onClick={() => setChangingPw(true)}
              className="px-4 py-1.5 border border-outline-variant/20 rounded-xl text-sm font-semibold text-on-surface-variant hover:border-primary/30 hover:text-primary transition-colors">
              Change
            </button>
          )}
        </div>

        {changingPw && (
          <div className="mt-4 space-y-3">
            {["current", "next", "confirm"].map((k) => (
              <div key={k} className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest">
                  {k === "current" ? "Current Password" : k === "next" ? "New Password" : "Confirm New Password"}
                </label>
                <input type="password" value={pw[k]} onChange={(e) => setPw((p) => ({ ...p, [k]: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#f5f6fa] border border-outline-variant/20 rounded-xl text-[14px] focus:outline-none focus:border-primary/40 transition-colors" />
              </div>
            ))}
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => { setChangingPw(false); setPw({ current: "", next: "", confirm: "" }); }}
                className="text-sm font-semibold text-on-surface-variant/60 hover:text-primary px-3 py-1.5">Cancel</button>
              <button
                onClick={() => {
                  if (pw.next !== pw.confirm) { toast.error("Passwords don't match"); return; }
                  toast.info("Password change not yet wired to API.");
                  setChangingPw(false);
                }}
                className="flex items-center gap-1.5 px-5 py-1.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90">
                <Lock className="w-3.5 h-3.5" /> Update
              </button>
            </div>
          </div>
        )}
      </SectionCard>

    </div>
  );
};

export default ProfilePage;

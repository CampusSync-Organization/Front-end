import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  GraduationCap, UsersRound, UserCheck, UserRoundPlus, Clock, X,
  Loader2, Tag, FolderOpen, Megaphone, User,
} from "lucide-react";
import { toast } from "sonner";

import { resolveAvatarUrl } from "../../../shared/hooks/resolveAvatarUrl";
import { UserAvatar } from "../../../shared/ui/UserAvatar";
import AnnouncementCard from "../../announcement/components/AnnouncementCard";
import StartDirectChatButton from "../../chat/components/StartDirectChatButton";
import { announcementApi } from "../../announcement/api/announcementApi";

import {
  fetchProfileByUserId, resetViewedProfile,
  selectViewedProfile, selectViewedProfileStatus, selectViewedProfileError,
} from "../store/profileSlice";
import {
  acceptConnectionRequest, dismissPendingConnectionRequest,
  fetchConnections, fetchPendingConnectionRequests, addConnection,
  selectDeclinedRequesterIds, selectConnectedUserIds,
  selectConnectionsAcceptStatus, selectConnectionsCreateStatus,
  selectPendingRequesterIds, selectSentRequestUserIds,
} from "../../../services/connections/store/connectionsSlice";

/* ── helpers ─────────────────────────────────────────────────────────── */
const splitName = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] || "Student", lastName: parts.slice(1).join(" ") };
};

const mapProjects = (projects = []) =>
  projects.map((p, i) => {
    if (typeof p === "string") {
      try {
        const o = JSON.parse(p);
        return { id: i, title: o.title || p, description: o.description || "", image: o.image || null, techStack: o.techStack || [] };
      } catch {
        return { id: i, title: p, description: "", image: null, techStack: [] };
      }
    }
    return { id: i, title: p.title || "Project", description: p.description || "", image: p.image || p.image_url || null, techStack: p.techStack || [] };
  });

/* ── atoms ───────────────────────────────────────────────────────────── */
const SectionCard = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-outline-variant/15 shadow-sm ${className}`}>
    {children}
  </div>
);

const Chip = ({ label }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border bg-secondary/15 text-secondary border-secondary/20">
    {label}
  </span>
);

/* ── Tab definitions ─────────────────────────────────────────────────── */
const TABS = [
  { key: "overview",       label: "Overview",       Icon: User },
  { key: "projects",       label: "Projects",        Icon: FolderOpen },
  { key: "announcements",  label: "Announcements",   Icon: Megaphone },
];

/* ── Connection button ───────────────────────────────────────────────── */
const ConnectionBtn = ({
  isConnected, isConnecting, isRequestPending, isRequestDeclined,
  isIncomingRequest, isAccepting, onConnect, onAcceptConnection, onDeclineConnection,
}) => {
  if (isIncomingRequest && !isConnected && !isRequestDeclined) {
    return (
      <div className="flex gap-2">
        <button onClick={onAcceptConnection} disabled={isAccepting}
          className="flex items-center gap-2 px-5 py-2 bg-secondary text-primary font-bold rounded-xl text-sm hover:bg-secondary/90 transition-all disabled:opacity-50">
          {isAccepting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
          {isAccepting ? "Confirming…" : "Confirm"}
        </button>
        <button onClick={onDeclineConnection} disabled={isAccepting}
          className="flex items-center gap-2 px-5 py-2 bg-outline-variant/10 text-on-surface-variant font-bold rounded-xl text-sm hover:bg-outline-variant/20 transition-all disabled:opacity-50">
          <X className="w-4 h-4" /> Decline
        </button>
      </div>
    );
  }

  const label = isAccepting ? "Accepting…"
    : isConnected ? "Connected"
    : isConnecting ? "Sending…"
    : isRequestPending ? "Pending"
    : isRequestDeclined ? "Declined"
    : "Connect";

  const Icon = isConnected ? UserCheck
    : isRequestPending ? Clock
    : isRequestDeclined ? X
    : UserRoundPlus;

  const cls = isConnected
    ? "bg-emerald-500/90 text-white cursor-default"
    : isRequestPending || isRequestDeclined
    ? "bg-outline-variant/10 text-on-surface-variant/70 cursor-default"
    : "bg-secondary text-primary hover:bg-secondary/90 disabled:opacity-50";

  return (
    <button
      onClick={isConnected || isRequestPending || isRequestDeclined ? undefined : onConnect}
      disabled={isConnecting || isAccepting}
      className={`flex items-center gap-2 px-5 py-2 font-bold rounded-xl text-sm transition-all ${cls}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   UserProfilePage
══════════════════════════════════════════════════════════════════════ */
const UserProfilePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const profile    = useSelector(selectViewedProfile);
  const status     = useSelector(selectViewedProfileStatus);
  const error      = useSelector(selectViewedProfileError);
  const currentUser = useSelector((s) => s.auth?.user);

  const connectedUserIds   = useSelector(selectConnectedUserIds);
  const pendingRequesterIds = useSelector(selectPendingRequesterIds);
  const declinedRequesterIds = useSelector(selectDeclinedRequesterIds);
  const sentRequestUserIds = useSelector(selectSentRequestUserIds);
  const createStatus       = useSelector(selectConnectionsCreateStatus);
  const acceptStatus       = useSelector(selectConnectionsAcceptStatus);

  const [tab, setTab]           = useState("overview");
  const [avatarBroken, setAvatarBroken] = useState(false);

  // Announcements tab state
  const [announcements, setAnnouncements]     = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchProfileByUserId(id));
    return () => dispatch(resetViewedProfile());
  }, [dispatch, id]);

  useEffect(() => {
    const uid = currentUser?.id ?? currentUser?.userID;
    if (uid) {
      dispatch(fetchConnections());
      dispatch(fetchPendingConnectionRequests());
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (tab === "announcements" && profile?.user_id) {
      setAnnouncementsLoading(true);
      announcementApi.getUserAnnouncements(profile.user_id)
        .then((data) => setAnnouncements(Array.isArray(data) ? data : data?.announcements ?? []))
        .catch(() => setAnnouncements([]))
        .finally(() => setAnnouncementsLoading(false));
    }
  }, [tab, profile?.user_id]);

  /* connection state */
  const isConnected       = profile && connectedUserIds.includes(profile.user_id);
  const isRequestPending  = profile && sentRequestUserIds.includes(profile.user_id);
  const isRequestDeclined = profile && declinedRequesterIds.includes(profile.user_id);
  const isIncomingRequest = profile && pendingRequesterIds.includes(profile.user_id);
  const isConnecting      = createStatus === "loading";
  const isAccepting       = acceptStatus === "loading";

  const handleConnect = () => {
    if (!profile?.user_id) return;
    dispatch(addConnection(profile.user_id))
      .unwrap()
      .then(() => toast.success("Connection request sent"))
      .catch((err) => toast.error(err || "Failed to send connection request"));
  };

  const handleAcceptConnection = () => {
    if (!profile?.user_id) return;
    dispatch(acceptConnectionRequest(profile.user_id))
      .unwrap()
      .then(() => toast.success("Connection request accepted"))
      .catch((err) => toast.error(err || "Failed to accept connection request"));
  };

  const handleDeclineConnection = () => {
    if (!profile?.user_id) return;
    dispatch(dismissPendingConnectionRequest(profile.user_id));
    toast.success("Connection request declined");
  };

  /* ── loading / error states ─────────────────────────────────────────── */
  if (status === "loading" || status === "idle") {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <p className="text-on-surface-variant/60 font-medium">{error || "Could not load profile."}</p>
        <button onClick={() => dispatch(fetchProfileByUserId(id))}
          className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold">Retry</button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <p className="text-on-surface-variant/60 font-medium text-lg">Profile not found.</p>
      </div>
    );
  }

  const { firstName, lastName } = splitName(profile.name);
  const fullName     = `${firstName} ${lastName}`.trim();
  const resolvedAvatar = resolveAvatarUrl(profile.avatar_url);
  const projects     = mapProjects(Array.isArray(profile.projects) ? profile.projects : []);
  const tags         = Array.isArray(profile.tags) ? profile.tags : [];

  return (
    <div className="min-h-screen bg-[#f0f2f7]">

      {/* ── Cover ─────────────────────────────────────────────────────── */}
      <div
        className="h-36 sm:h-44 w-full relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d1b2a 0%, #14213D 45%, #1a2f52 75%, #0d1b2a 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle, #FCA311 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      {/* ── Identity card ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-outline-variant/15 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">

          {/* Avatar row — overlaps cover */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 sm:-mt-16">
            <div className="relative shrink-0 self-start sm:self-auto">
              <div className="w-28 h-28 rounded-2xl ring-4 ring-white shadow-xl overflow-hidden bg-slate-200">
                {resolvedAvatar && !avatarBroken ? (
                  <img src={resolvedAvatar} alt={fullName}
                    onError={() => setAvatarBroken(true)}
                    className="w-full h-full object-cover" />
                ) : (
                  <UserAvatar name={fullName} className="w-full h-full text-4xl" />
                )}
              </div>
            </div>

            {/* Name + actions */}
            <div className="flex-1 min-w-0 pb-1 flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                  {fullName || "Student"}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/6 text-primary rounded-full text-sm font-bold">
                    <GraduationCap className="w-3.5 h-3.5 text-secondary" />
                    GPA {profile.cgpa ? Number(profile.cgpa).toFixed(1) : "N/A"}
                  </span>
                  {typeof profile.connections_count === "number" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/6 text-primary rounded-full text-sm font-semibold">
                      <UsersRound className="w-3.5 h-3.5" />
                      {profile.connections_count} {profile.connections_count === 1 ? "Connection" : "Connections"}
                    </span>
                  )}
                </div>
              </div>

              {/* Connect + Message buttons */}
              <div className="shrink-0 flex items-center gap-2 pb-1">
                <ConnectionBtn
                  isConnected={isConnected}
                  isConnecting={isConnecting}
                  isRequestPending={isRequestPending}
                  isRequestDeclined={isRequestDeclined}
                  isIncomingRequest={isIncomingRequest}
                  isAccepting={isAccepting}
                  onConnect={handleConnect}
                  onAcceptConnection={handleAcceptConnection}
                  onDeclineConnection={handleDeclineConnection}
                />
                {isConnected && (
                  <StartDirectChatButton
                    userId={profile.user_id}
                    userName={firstName}
                    className="px-5 py-2 font-bold rounded-xl text-sm"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Spacer below identity row */}
          <div className="pb-4" />
        </div>
      </div>

      {/* ── Tab bar ───────────────────────────────────────────────────── */}
      <div className="sticky top-16 z-20 bg-[#f0f2f7] border-b border-outline-variant/15">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto scrollbar-none">
          {TABS.map(({ key, label, Icon }) => (
            <button key={key} onClick={() => setTab(key)}
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

      {/* ── Tab content ───────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* OVERVIEW ──────────────────────────────────────────────────── */}
        {tab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-6">
              {/* Bio */}
              <SectionCard className="p-6">
                <h2 className="text-[15px] font-bold text-primary mb-5">About</h2>
                <p className="text-[14px] leading-7 text-on-surface-variant/80">
                  {profile.bio || <span className="italic text-on-surface-variant/40">No bio added yet.</span>}
                </p>
              </SectionCard>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {/* Interests */}
              <SectionCard className="p-6">
                <h2 className="text-[15px] font-bold text-primary flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-secondary" /> Interests
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tags.length === 0
                    ? <span className="text-xs italic text-on-surface-variant/40">No interests added.</span>
                    : tags.map((t) => <Chip key={t} label={t} />)}
                </div>
              </SectionCard>

              {/* Stats */}
              <SectionCard className="p-6">
                <h2 className="text-[15px] font-bold text-primary mb-4">Stats</h2>
                <div className="space-y-3">
                  {[
                    { label: "GPA", value: profile.cgpa ? Number(profile.cgpa).toFixed(2) : "N/A" },
                    { label: "Projects", value: projects.length },
                    ...(typeof profile.connections_count === "number"
                      ? [{ label: "Connections", value: profile.connections_count }]
                      : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-outline-variant/10 last:border-0">
                      <span className="text-sm text-on-surface-variant/60 font-medium">{label}</span>
                      <span className="text-sm font-bold text-primary">{value}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </div>
        )}

        {/* PROJECTS ──────────────────────────────────────────────────── */}
        {tab === "projects" && (
          <div className="space-y-4">
            <h2 className="text-[15px] font-bold text-primary">Projects</h2>
            {projects.length === 0 ? (
              <SectionCard className="p-12 text-center">
                <FolderOpen className="w-10 h-10 text-on-surface-variant/20 mx-auto mb-3" />
                <p className="text-sm font-semibold text-on-surface-variant/50">No projects yet</p>
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
                        {p.techStack.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/8 text-primary border border-primary/10">{t}</span>
                        ))}
                      </div>
                    )}
                  </SectionCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ANNOUNCEMENTS ─────────────────────────────────────────────── */}
        {tab === "announcements" && (
          <div className="space-y-4">
            <h2 className="text-[15px] font-bold text-primary">Announcements</h2>
            {announcementsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary/40" />
              </div>
            ) : announcements.length === 0 ? (
              <SectionCard className="p-12 text-center">
                <Megaphone className="w-10 h-10 text-on-surface-variant/20 mx-auto mb-3" />
                <p className="text-sm font-semibold text-on-surface-variant/50">No announcements yet</p>
              </SectionCard>
            ) : (
              <div className="space-y-3">
                {announcements.map((a) => (
                  <AnnouncementCard key={a.id} post={a} isOwner={false} joinRequests={[]} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default UserProfilePage;

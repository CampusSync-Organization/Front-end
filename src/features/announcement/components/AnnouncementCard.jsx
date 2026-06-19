import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useJoinRequest } from "../../chat/hooks/requestjoin";
import {
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  Edit,
  Trash2,
  X,
  Check,
  Users,
  CalendarDays,
  BookOpen,
  Loader2,
} from "lucide-react";
import { resolveAvatarUrl } from "../../../shared/hooks/resolveAvatarUrl";
import {
  deleteAnnouncement,
  updateAnnouncement,
} from "../store/announcementSlice";
import { getErrorMessage } from "../../auth/utils/getErrorMessage";
import useChatStore from "../../chat/store/useChatStore";

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function Avatar({ src, name, size = 40 }) {
  const [broken, setBroken] = React.useState(false);
  const resolved = resolveAvatarUrl(src);
  const ini =
    (name ?? "?")
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?";
  let h = 0;
  for (let i = 0; i < (name?.length ?? 0); i++)
    h = (h * 31 + (name?.charCodeAt(i) ?? 0)) & 0xfffff;
  const hue = (h % 280) + 30;
  if (resolved && !broken) {
    return (
      <img
        src={resolved}
        alt={name}
        onError={() => setBroken(true)}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full flex items-center justify-center text-sm font-bold shrink-0"
      style={{
        width: size,
        height: size,
        background: `hsl(${hue},45%,90%)`,
        color: `hsl(${hue},45%,30%)`,
      }}
    >
      {ini}
    </div>
  );
}

function EditForm({ post, onCancel }) {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    announcement_type: post.announcement_type,
    course_name: post.course_name || "",
    project_name: post.project_name || "",
    start_date: post.start_date ? post.start_date.split("T")[0] : "",
    deadline: post.deadline ? post.deadline.split("T")[0] : "",
    num_members: post.num_members || "",
    content: post.content || "",
  });

  const inp =
    "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] focus:outline-none focus:border-gray-300 transition-colors";

  const handleSave = async () => {
    if (!data.course_name.trim()) {
      toast.error("Course name is required");
      return;
    }
    if (
      data.announcement_type === "project-announcement" &&
      (!data.num_members || +data.num_members < 1)
    ) {
      toast.error("Members needed must be at least 1");
      return;
    }
    try {
      const payload = { ...data };
      if (data.announcement_type === "connection-update") {
        delete payload.project_name;
        delete payload.start_date;
        delete payload.deadline;
        delete payload.num_members;
      } else {
        payload.num_members = parseInt(payload.num_members);
      }
      await dispatch(
        updateAnnouncement({ id: post.id, updates: payload }),
      ).unwrap();
      toast.success("Updated!");
      onCancel();
    } catch (e) {
      toast.error(getErrorMessage(e, "Failed to update"));
    }
  };

  return (
    <div className="p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-bold text-gray-900">Edit Post</p>
        <button
          onClick={onCancel}
          className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      <div className="flex gap-2">
        {[
          ["project-announcement", "Project"],
          ["connection-update", "Update"],
        ].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setData({ ...data, announcement_type: val })}
            className={`flex-1 py-2 rounded-xl text-[13px] font-semibold border transition-all ${data.announcement_type === val ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-gray-50 text-gray-500"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <input
        className={inp}
        placeholder="Course name *"
        value={data.course_name}
        onChange={(e) => setData({ ...data, course_name: e.target.value })}
      />
      <input
        className={inp}
        placeholder="Project title (optional)"
        value={data.project_name}
        onChange={(e) => setData({ ...data, project_name: e.target.value })}
      />
      {data.announcement_type === "project-announcement" && (
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            className={inp}
            value={data.start_date}
            onChange={(e) => setData({ ...data, start_date: e.target.value })}
          />
          <input
            type="date"
            className={inp}
            value={data.deadline}
            onChange={(e) => setData({ ...data, deadline: e.target.value })}
          />
          <input
            type="number"
            className={inp + " col-span-2"}
            placeholder="Members needed"
            value={data.num_members}
            onChange={(e) => setData({ ...data, num_members: e.target.value })}
          />
        </div>
      )}
      <textarea
        rows={3}
        className={inp + " resize-none"}
        placeholder="Description (optional)"
        value={data.content}
        onChange={(e) => setData({ ...data, content: e.target.value })}
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-[13px] font-semibold text-gray-400 hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-[13px] font-bold text-white"
          style={{ background: "#14213D" }}
        >
          <Check className="w-3.5 h-3.5" /> Save
        </button>
      </div>
    </div>
  );
}

export default function AnnouncementCard({
  post,
  announcement,
  isOwner = false,
  joinRequests = [],
}) {
  const navigate = useNavigate();
  const item = post ?? announcement;
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.auth.user);
  const currentUserId = currentUser?.userID ?? currentUser?.id ?? null;
  const approveJoinRequest = useChatStore((s) => s.approveJoinRequest);
  const fetchTeam = useChatStore((s) => s.fetchTeam);
  const addRoom = useChatStore((s) => s.addRoom);
  const setActiveRoom = useChatStore((s) => s.setActiveRoom);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [saved, setSaved] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [approvingRequestIds, setApprovingRequestIds] = useState(new Set());
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [localTeam, setLocalTeam] = useState(null);
  const menuRef = useRef(null);
  const { handleJoinRequest, joinStatus } = useJoinRequest(item.team_id);

  useEffect(() => {
    let cancelled = false;
    if (item.team_id) {
      fetchTeam(item.team_id).then((team) => {
        if (!cancelled) setLocalTeam(team);
      }).catch(() => {});
    }
    return () => { cancelled = true; };
  }, [item.team_id, fetchTeam]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!item) return null;

  const isJoined =
    localTeam?.members?.some(
      (m) => Number(m.id ?? m.user_id) === Number(currentUserId),
    ) ?? false;

  const isProject = item.announcement_type === "project-announcement";
  const isFull =
    isProject &&
    item.num_members != null &&
    (item.current_members ?? 0) >= item.num_members;
  const fillPct =
    isProject && item.num_members
      ? Math.min(100, ((item.current_members ?? 0) / item.num_members) * 100)
      : 0;
  const visibleJoinRequests = joinRequests.filter(
    (request) => request.request_id ?? request.id,
  );

  const handleApproveRequest = async (request) => {
    const requestId = request.request_id ?? request.id;
    const teamId = request.team_id ?? item.team_id;
    if (!requestId || !teamId) return;

    setApprovingRequestIds((prev) => new Set(prev).add(requestId));
    try {
      const result = await approveJoinRequest(teamId, requestId);
      dispatch(
        updateAnnouncement({
          id: item.id,
          updates: { current_members: (item.current_members ?? 0) + 1 },
        }),
      );

      if (result?.chat_room_id) {
        const roomName = item.project_name || item.course_name || `Team ${teamId}`;
        addRoom({
          id: result.chat_room_id,
          type: "team",
          name: roomName,
          lastMessage: "",
          members: [],
        });
        setActiveRoom(result.chat_room_id);
        navigate("/Chat-Main-Page");
      }
    } catch {
      // Store already shows an error toast.
    } finally {
      setApprovingRequestIds((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  };

  if (editing)
    return (
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <EditForm post={item} onCancel={() => setEditing(false)} />
      </div>
    );

  return (
    <article className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <Link to={`/user-profile/${item.user_id}`}>
            <Avatar src={item.avatar_url} name={item.name} size={42} />
          </Link>
          <div>
            <Link
              to={`/user-profile/${item.user_id}`}
              className="text-[14px] font-bold text-gray-900 hover:underline block leading-tight"
            >
              {item.name || "Unknown"}
            </Link>
            <p className="text-[12px] text-gray-400">
              {timeAgo(item.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isOwner && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl border border-gray-100 shadow-xl z-20 py-1 overflow-hidden">
                  <button
                    onClick={() => {
                      setEditing(true);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Delete this post?"))
                        dispatch(deleteAnnouncement(item.id));
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-3">
        {(item.project_name || item.course_name) && (
          <p className="text-[14.5px] font-semibold text-gray-900 mb-1">
            {isProject
              ? item.project_name || item.course_name
              : item.course_name}
          </p>
        )}
        {item.content && item.content.trim() !== "..." && (
          <p className="text-[14px] text-gray-600 leading-relaxed">
            {item.content}
          </p>
        )}
      </div>

      {/* Project meta */}
      {isProject && (
        <div className="mx-5 mb-4 rounded-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            <div className="bg-gray-50 px-3 py-3">
              <p className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                <BookOpen className="w-3 h-3" /> Course
              </p>
              <p className="text-[12.5px] font-bold text-gray-800 truncate">
                {item.course_name || "—"}
              </p>
            </div>
            <div className="bg-gray-50 px-3 py-3">
              <p className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                <CalendarDays className="w-3 h-3" /> Deadline
              </p>
              <p className="text-[12.5px] font-bold text-gray-800">
                {item.deadline
                  ? new Date(item.deadline).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </p>
            </div>
            <div className="bg-gray-50 px-3 py-3">
              <p className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                <Users className="w-3 h-3" /> Team
              </p>
              <div className="flex items-center gap-1.5">
                <p className="text-[12.5px] font-bold text-gray-800">
                  {item.current_members ?? 0}/{item.num_members}
                </p>
                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${fillPct}%`, background: "#FCA311" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isOwner && isProject && visibleJoinRequests.length > 0 && (
        <>
          <div className="mx-5 mb-4 rounded-xl border border-amber-100 bg-amber-50/50 overflow-hidden">
            <div className="px-4 py-3 border-b border-amber-100 flex items-center justify-between">
              <div>
                <p className="text-[13px] font-bold text-gray-900">
                  Join Requests
                </p>
                <p className="text-[11px] text-gray-500">
                  {visibleJoinRequests.length} pending for this project
                </p>
              </div>
              <Users className="w-4 h-4 text-amber-600" />
            </div>
            <div className="divide-y divide-amber-100">
              {visibleJoinRequests.slice(0, 2).map((request) => {
                const requestId = request.request_id ?? request.id;
                const requesterName =
                  request.user_name ?? `User ${request.user_id}`;
                const isApproving = approvingRequestIds.has(requestId);

                return (
                  <div
                    key={requestId}
                    className="px-4 py-3 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-white border border-amber-100 flex items-center justify-center shrink-0">
                      <span className="text-[12px] font-bold text-amber-700">
                        {requesterName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-bold text-gray-900 truncate">
                        {requesterName}
                      </p>
                      {request.created_at && (
                        <p className="text-[11px] text-gray-500">
                          {timeAgo(request.created_at)}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApproveRequest(request)}
                      disabled={isApproving}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-[12px] font-bold hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isApproving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      Approve
                    </button>
                  </div>
                );
              })}
            </div>
            {visibleJoinRequests.length > 2 && (
              <button
                type="button"
                onClick={() => setShowAllRequests(true)}
                className="w-full px-4 py-2.5 text-[13px] font-bold text-amber-700 hover:bg-amber-100/50 transition-colors border-t border-amber-100"
              >
                See all {visibleJoinRequests.length} requests
              </button>
            )}
          </div>

          {showAllRequests && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setShowAllRequests(false)}
              />
              <div className="relative w-full max-w-md mx-4 rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
                  <div>
                    <p className="text-[14px] font-bold text-gray-900">
                      Join Requests
                    </p>
                    <p className="text-[12px] text-gray-500">
                      {visibleJoinRequests.length} pending for{" "}
                      {item.project_name || item.course_name}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAllRequests(false)}
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <div className="overflow-y-auto divide-y divide-gray-100">
                  {visibleJoinRequests.map((request) => {
                    const requestId = request.request_id ?? request.id;
                    const requesterName =
                      request.user_name ?? `User ${request.user_id}`;
                    const isApproving = approvingRequestIds.has(requestId);

                    return (
                      <div
                        key={requestId}
                        className="px-5 py-3.5 flex items-center gap-3"
                      >
                        <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                          <span className="text-[13px] font-bold text-amber-700">
                            {requesterName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13px] font-bold text-gray-900 truncate">
                            {requesterName}
                          </p>
                          {request.created_at && (
                            <p className="text-[11px] text-gray-500">
                              {timeAgo(request.created_at)}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApproveRequest(request)}
                          disabled={isApproving}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-white text-[12px] font-bold hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                        >
                          {isApproving ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                          Approve
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Actions row */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button
            onClick={() => {
              setLiked(!liked);
              setLikes(liked ? likes - 1 : likes + 1);
            }}
            className="flex items-center gap-1.5 text-[13px] font-medium transition-colors"
            style={{ color: liked ? "#ef4444" : "#9ca3af" }}
          >
            <Heart
              className="w-[18px] h-[18px]"
              fill={liked ? "currentColor" : "none"}
            />
            {likes > 0 ? likes : ""}
          </button>
          <button className="flex items-center gap-1.5 text-[13px] font-medium text-gray-400 hover:text-gray-600 transition-colors">
            <MessageCircle className="w-[18px] h-[18px]" />
            Reply
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSaved(!saved)}
            className="transition-colors"
            style={{ color: saved ? "#14213D" : "#d1d5db" }}
          >
            <Bookmark
              className="w-[18px] h-[18px]"
              fill={saved ? "currentColor" : "none"}
            />
          </button>
          {isProject && !isOwner && isJoined ? (
            <button
              disabled
              className="px-6 py-2 rounded-lg text-sm font-bold shadow-md flex items-center gap-2 bg-green-100 text-green-700 shadow-green-100 cursor-default"
            >
              <Check size={16} />
              Joined
            </button>
          ) : isProject && !isOwner && joinStatus === "sent" ? (
            <button
              disabled
              className="px-6 py-2 rounded-lg text-sm font-bold shadow-md flex items-center gap-2 bg-green-100 text-green-700 shadow-green-100 cursor-default"
            >
              <Check size={16} />
              Request Sent
            </button>
          ) : isProject && !isOwner && !isFull ? (
            <button
              onClick={handleJoinRequest}
              disabled={joinStatus === "pending"}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-md flex items-center gap-2
      ${
        joinStatus === "error"
          ? "bg-red-100 text-red-600 shadow-red-100 hover:bg-red-200"
          : "bg-primary text-white hover:bg-slate-800 shadow-primary/10"
      }`}
            >
              {joinStatus === "pending" && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {joinStatus === "idle" && "Request to Join"}
              {joinStatus === "pending" && "Sending..."}
              {joinStatus === "error" && "Retry"}
            </button>
          ) : null}
        </div>
      </div>

      {/* Comment input */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-3">
        {currentUser && (
          <Avatar
            src={currentUser.avatar_url}
            name={currentUser.name ?? ""}
            size={30}
          />
        )}
        <input
          type="text"
          placeholder="Write your comment..."
          className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-[13px] text-gray-600 placeholder:text-gray-400 border border-gray-100 focus:outline-none focus:border-gray-300 transition-colors"
        />
      </div>
    </article>
  );
}

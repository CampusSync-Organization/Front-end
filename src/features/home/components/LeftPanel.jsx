import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader2, MessageSquare } from "lucide-react";
import { resolveAvatarUrl } from "../../../shared/hooks/resolveAvatarUrl";
import {
  selectConnectedUserIds,
  selectPendingRequesterIds,
  fetchConnectionsWithHydration,
  selectConnectionsStatus,
  fetchPendingConnectionRequests,
  selectPendingConnectionsStatus,
} from "../../../services/connections/store/connectionsSlice";
import { fetchMyProfile, selectMyProfile } from "../../profile/store/profileSlice";
import useChatStore from "../../chat/store/useChatStore";

function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

function Avatar({ src, name, size = 36 }) {
  const [broken, setBroken] = useState(false);
  const resolved = resolveAvatarUrl(src);
  const ini = (name ?? "?").split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
  let h = 0;
  for (let i = 0; i < (name?.length ?? 0); i++) h = (h * 31 + (name?.charCodeAt(i) ?? 0)) & 0xfffff;
  const hue = (h % 280) + 30;
  if (resolved && !broken) {
    return <img src={resolved} alt={name} onError={() => setBroken(true)} className="rounded-full object-cover shrink-0" style={{ width: size, height: size }} />;
  }
  return (
    <div className="rounded-full flex items-center justify-center text-xs font-bold shrink-0"
      style={{ width: size, height: size, background: `hsl(${hue},45%,90%)`, color: `hsl(${hue},45%,30%)` }}>
      {ini}
    </div>
  );
}

export default function LeftPanel() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const user       = useSelector((s) => s.auth.user);
  const profile    = useSelector(selectMyProfile);
  const name       = profile?.name ?? user?.name ?? "Student";
  const avatar     = resolveAvatarUrl(profile?.avatar_url ?? user?.avatar_url);
  const connIds        = useSelector(selectConnectedUserIds);
  const pendingIds     = useSelector(selectPendingRequesterIds);
  const connStatus     = useSelector(selectConnectionsStatus);
  const pendingStatus  = useSelector(selectPendingConnectionsStatus);

  const rooms          = useChatStore((s) => s.rooms);
  const isLoadingRooms = useChatStore((s) => s.isLoadingRooms);
  const dmRooms        = rooms.slice(0, 6);

  useEffect(() => {
    if (!profile?.avatar_url) dispatch(fetchMyProfile());
    if (connStatus === "idle") dispatch(fetchConnectionsWithHydration());
    if (pendingStatus === "idle") dispatch(fetchPendingConnectionRequests());
  }, []);

  return (
    <div className="space-y-3">

      {/* Profile card */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {/* Cover */}
        <div className="h-[88px]" style={{ background: "linear-gradient(135deg, #0f1f38 0%, #14213D 60%, #1a3060 100%)" }}>
          <div className="h-full w-full opacity-30"
            style={{ backgroundImage: "radial-gradient(ellipse at 80% 50%, #FCA311 0%, transparent 60%)" }} />
        </div>

        <div className="px-5 pb-5">
          {/* Avatar — overlaps cover */}
          <div className="relative -mt-9 mb-3 w-fit">
            <div className="w-[68px] h-[68px] rounded-full overflow-hidden ring-[3px] ring-white shadow-sm">
              {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold"
                  style={{ background: "#14213D", color: "#FCA311" }}>
                  {initials(name)}
                </div>
              )}
            </div>
          </div>

          <p className="text-[15px] font-bold text-gray-900 leading-tight">{name}</p>
          <p className="text-[12px] text-gray-400 mb-4">@{name.toLowerCase().replace(/\s+/g, "")}</p>

          {/* Stats */}
          <div className="flex items-center gap-5 mb-4">
            <div>
              <p className="text-[16px] font-bold text-gray-900">{connIds.length}</p>
              <p className="text-[11px] text-gray-400">Connections</p>
            </div>
            <div className="w-px h-8 bg-gray-100" />
            <div>
              <p className="text-[16px] font-bold text-gray-900">{pendingIds.length}</p>
              <p className="text-[11px] text-gray-400">Pending</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="w-full py-2.5 rounded-xl text-[13.5px] font-bold text-white transition-colors"
          style={{ background: "#14213D" }}
          >
            My Profile
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Messages</p>
          <button onClick={() => navigate("/Chat-Main-Page")}
            className="text-[12px] font-semibold text-blue-500 hover:text-blue-600 transition-colors">
            See all
          </button>
        </div>
        {isLoadingRooms ? (
          <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-gray-200" /></div>
        ) : dmRooms.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-5">
            <MessageSquare className="w-6 h-6 text-gray-200" />
            <p className="text-[12px] text-gray-400 text-center">No conversations yet.</p>
          </div>
        ) : (
          <ul className="pb-2">
            {dmRooms.map((room) => (
              <li key={room.id} onClick={() => navigate("/Chat-Main-Page")}
                className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
                <Avatar src={room.avatarUrl} name={room.name} size={36} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-900 truncate leading-tight">{room.name}</p>
                  {room.lastMessage ? (
                    <p className="text-[11.5px] text-gray-400 truncate">{room.lastMessage}</p>
                  ) : (
                    <p className="text-[11.5px] text-gray-300 italic">Tap to message</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}

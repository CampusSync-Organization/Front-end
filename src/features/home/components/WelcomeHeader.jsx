import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectConnectedUserIds, selectPendingRequesterIds } from "../../../services/connections/store/connectionsSlice";
import { resolveAvatarUrl } from "../../../shared/hooks/resolveAvatarUrl";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");
}

export default function WelcomeHeader() {
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const name = user?.name ?? "Student";
  const firstName = name.split(" ")[0];
  const [avatarBroken, setAvatarBroken] = useState(false);
  const avatar = resolveAvatarUrl(user?.avatar_url);
  const connIds = useSelector(selectConnectedUserIds);
  const pendingIds = useSelector(selectPendingRequesterIds);

  return (
    <div className="bg-white rounded-xl border border-gray-200 px-5 py-4">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 mt-0.5">
          {avatar && !avatarBroken ? (
            <img src={avatar} alt={name} onError={() => setAvatarBroken(true)} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-bold"
              style={{ background: "#14213D", color: "#FCA311" }}>
              {initials(name)}
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-gray-400 font-medium">{getGreeting()},</p>
          <p className="text-[15px] font-bold text-gray-900">{firstName}</p>
          <p className="text-[12.5px] text-gray-400 mt-0.5">Here's what's happening on your campus today.</p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate("/profile/connections")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <span className="text-[13px] font-bold text-gray-800">{connIds.length}</span>
            <span className="text-[12px] text-gray-400 font-medium">connections</span>
          </button>

          {pendingIds.length > 0 && (
            <button
              onClick={() => navigate("/profile/connections")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors"
              style={{ background: "#fffbf0", borderColor: "#fde68a" }}
            >
              <span className="text-[13px] font-bold" style={{ color: "#b45309" }}>{pendingIds.length}</span>
              <span className="text-[12px] font-medium" style={{ color: "#d97706" }}>pending</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

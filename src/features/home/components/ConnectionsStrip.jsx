import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { resolveAvatarUrl } from "../../../shared/hooks/resolveAvatarUrl";
import {
  fetchConnectionsWithHydration,
  selectHydratedConnections,
  selectConnectionsStatus,
} from "../../../services/connections/store/connectionsSlice";

function ConnectionCard({ person }) {
  const navigate = useNavigate();
  const name = person.name || person.full_name || `User ${person.user_id}`;
  const firstName = name.split(" ")[0];
  const avatar = resolveAvatarUrl(person.avatar_url);
  const userId = person.user_id ?? person.id;

  const ini = name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xfffff;
  const hue = (h % 280) + 30;

  return (
    <button
      onClick={() => navigate(`/user-profile/${userId}`)}
      className="flex-shrink-0 w-[100px] rounded-2xl overflow-hidden relative group"
      style={{ height: 130, background: `hsl(${hue},40%,88%)` }}
    >
      {/* Background fill / avatar */}
      {avatar ? (
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-2xl font-bold" style={{ color: `hsl(${hue},40%,35%)` }}>
          {ini}
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)" }} />

      {/* Small avatar ring at top */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2">
        <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white">
          {avatar
            ? <img src={avatar} alt={name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-xs font-bold" style={{ background: `hsl(${hue},40%,70%)`, color: "#fff" }}>{ini}</div>
          }
        </div>
      </div>

      {/* Name at bottom */}
      <p className="absolute bottom-2.5 left-0 right-0 text-center text-[11px] font-bold text-white px-1 truncate">
        {firstName}
      </p>
    </button>
  );
}

export default function ConnectionsStrip() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const connections = useSelector(selectHydratedConnections);
  const status = useSelector(selectConnectionsStatus);

  useEffect(() => {
    if (status === "idle") dispatch(fetchConnectionsWithHydration());
  }, [status, dispatch]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
        {/* Add post card */}
        <button
          onClick={() => document.getElementById("create-announcement-trigger")?.click()}
          className="flex-shrink-0 w-[100px] rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-blue-300 hover:bg-blue-50 transition-colors"
          style={{ height: 130 }}
        >
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <p className="text-[11px] font-bold text-gray-500">Add Post</p>
        </button>

        {/* Connection cards */}
        {connections.slice(0, 8).map((person) => (
          <ConnectionCard key={person.user_id ?? person.id} person={person} />
        ))}

        {connections.length === 0 && status !== "loading" && (
          <div className="flex-1 flex items-center justify-center py-4">
            <p className="text-[12px] text-gray-400">Connect with people to see them here</p>
          </div>
        )}
      </div>
    </div>
  );
}

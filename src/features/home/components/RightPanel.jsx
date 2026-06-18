import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Loader2, UserPlus, Check } from "lucide-react";
import useChatStore from "../../chat/store/useChatStore";
import { getAllTeams } from "../../chat/api/teamApi";
import { resolveAvatarUrl } from "../../../shared/hooks/resolveAvatarUrl";
import { fetchRecommendations } from "../../recommendation/store/recommendationSlice";
import {
  acceptConnectionRequest,
  dismissPendingConnectionRequest,
  fetchPendingConnectionRequestsWithHydration,
  fetchConnectionsWithHydration,
  selectHydratedPendingRequesters,
  selectHydratedConnections,
  selectPendingConnectionsStatus,
  selectConnectionsStatus,
  addConnection,
  selectSentRequestUserIds,
} from "../../../services/connections/store/connectionsSlice";
import { toast } from "sonner";

function Avatar({ src, name, size = 40 }) {
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

export default function RightPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [localSentIds, setLocalSentIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sentConnectionIds") || "[]"); } catch { return []; }
  });
  const pendingRequesters = useSelector(selectHydratedPendingRequesters);
  const pendingStatus = useSelector(selectPendingConnectionsStatus);
  const connStatus = useSelector(selectConnectionsStatus);
  const { items: recommendations, status: recStatus } = useSelector((s) => s.recommendations);
  const sentIds = useSelector(selectSentRequestUserIds);
  const hydratedConnections = useSelector(selectHydratedConnections);
  const currentUserId = useSelector((s) => s.auth?.user?.userID ?? s.auth?.user?.id);

  const fetchRooms = useChatStore((s) => s.fetchRooms);
  const connectSocket = useChatStore((s) => s.connectSocket);

  useEffect(() => {
    if (pendingStatus === "idle") dispatch(fetchPendingConnectionRequestsWithHydration());
  }, [pendingStatus, dispatch]);

  useEffect(() => {
    dispatch(fetchConnectionsWithHydration());
  }, [dispatch]);

  useEffect(() => {
    if (recStatus === "idle") dispatch(fetchRecommendations());
  }, [recStatus, dispatch]);

  useEffect(() => {
    connectSocket();
    fetchRooms().catch(() => {});
    getAllTeams().then((data) => {
      const teams = Array.isArray(data) ? data : data?.teams ?? [];
      teams.forEach((t) => {
        useChatStore.getState().addRoom({
          id: t.id,
          type: "team",
          name: t.name,
          lastMessage: "",
          members: [],
          peerId: null,
        });
      });
    }).catch(() => {});
  }, []);


  const handleAccept = async (requesterId, name) => {
    try {
      await dispatch(acceptConnectionRequest(requesterId)).unwrap();
      toast.success(`Connected with ${name}!`);
    } catch {
      toast.error("Failed to accept request.");
    }
  };

  const handleConnect = (userId, name) => {
    const id = Number(userId);
    setLocalSentIds((prev) => {
      const next = [...prev, id];
      localStorage.setItem("sentConnectionIds", JSON.stringify(next));
      return next;
    });
    dispatch(addConnection(id))
      .unwrap()
      .then(() => toast.success(`Request sent to ${name}!`))
      .catch(() => toast.error("Failed to send request."));
  };

  const connectedSet = new Set(hydratedConnections.map((c) => String(c.user_id ?? c.id)));

  const suggested = recommendations
    .filter((r) => {
      const id = String(r.user_id ?? r.id);
      return id !== String(currentUserId) && !connectedSet.has(id);
    })
    .slice(0, 5);

  return (
    <div className="space-y-4">

      {/* REQUESTS */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Requests</p>
            {pendingRequesters.length > 0 && (
              <span className="w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ background: "#14213D" }}>
                {pendingRequesters.length}
              </span>
            )}
          </div>
        </div>

        {pendingStatus === "loading" ? (
          <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-gray-200" /></div>
        ) : pendingRequesters.length === 0 ? (
          <p className="text-[12px] text-gray-400 text-center py-5">No pending requests.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {pendingRequesters.slice(0, 3).map((requester) => {
              const name = requester.name || requester.full_name || `User ${requester.user_id}`;
              return (
                <li key={requester.user_id} className="px-5 py-4">
                  <div className="flex items-center gap-3 mb-3">
                    <button onClick={() => navigate(`/user-profile/${requester.user_id}`)}>
                      <Avatar src={requester.avatar_url} name={name} size={40} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <button onClick={() => navigate(`/user-profile/${requester.user_id}`)}
                        className="text-[13.5px] font-bold text-gray-900 hover:underline block text-left leading-tight truncate">
                        {name}
                      </button>
                      <p className="text-[12px] text-gray-400">wants to connect with you</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(requester.user_id, name)}
                      className="flex-1 py-2 rounded-xl text-[13px] font-bold text-white transition-colors" style={{ background: "#14213D" }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => dispatch(dismissPendingConnectionRequest(requester.user_id))}
                      className="flex-1 py-2 rounded-xl text-[13px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </li>
              );
            })}
            {pendingRequesters.length > 3 && (
              <li className="px-5 py-3 border-t border-gray-50">
                <button onClick={() => navigate("/profile/connections")}
                  className="text-[12px] font-semibold text-blue-500 hover:text-blue-600 transition-colors">
                  View all {pendingRequesters.length} requests →
                </button>
              </li>
            )}
          </ul>
        )}
      </div>

      {/* SUGGESTED FOR YOU */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Suggested For You</p>
          <button onClick={() => navigate("/Recommendation-Page")}
            className="text-[12px] font-semibold text-blue-500 hover:text-blue-600 transition-colors">
            See all
          </button>
        </div>

        {recStatus === "loading" ? (
          <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-gray-200" /></div>
        ) : suggested.length === 0 ? (
          <p className="text-[12px] text-gray-400 text-center py-5 px-5">No suggestions yet.</p>
        ) : (
          <ul className="pb-2">
            {suggested.map((rec) => {
              const recId = Number(rec.user_id ?? rec.id);
              const name = rec.name || `User ${recId}`;
              const alreadySent = localSentIds.includes(recId);
              return (
                <li key={recId} className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors">
                  <button onClick={() => navigate(`/user-profile/${recId}`)}>
                    <Avatar src={rec.avatar_url ?? rec.pfp} name={name} size={38} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <button onClick={() => navigate(`/user-profile/${recId}`)}
                      className="text-[13px] font-semibold text-gray-900 hover:underline truncate block text-left leading-tight">
                      {name}
                    </button>
                    <p className="text-[11.5px] text-gray-400">
                      {rec.cgpa ? `GPA ${Number(rec.cgpa).toFixed(1)}` : rec.faculty ?? rec.department ?? rec.major ?? "Campus student"}
                    </p>
                  </div>
                  <button
                    onClick={() => !alreadySent && handleConnect(recId, name)}
                    disabled={alreadySent}
                    title={alreadySent ? "Request sent" : `Connect with ${name}`}
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      alreadySent
                        ? "bg-gray-100 text-gray-400 cursor-default"
                        : "bg-[#e8ecf4] text-[#14213D] hover:bg-[#14213D] hover:text-white"
                    }`}
                  >
                    {alreadySent ? <Check className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

    </div>
  );
}

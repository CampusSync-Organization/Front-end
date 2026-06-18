import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Users, MessageSquare, BookOpen, Loader2, UserPlus, Check } from "lucide-react";
import { resolveAvatarUrl } from "../../../shared/hooks/resolveAvatarUrl";
import { fetchRecommendations } from "../../recommendation/store/recommendationSlice";
import { addConnection, selectSentRequestUserIds } from "../../../services/connections/store/connectionsSlice";
import { toast } from "sonner";

const QUICK_LINKS = [
  { label: "Communities", icon: Users,         to: "/Events-And-Communities-Page" },
  { label: "Messages",    icon: MessageSquare, to: "/Chat-Main-Page" },
  { label: "Discover",    icon: BookOpen,      to: "/Recommendation-Page" },
];

function PeerAvatar({ src, name }) {
  const [broken, setBroken] = useState(false);
  const resolved = resolveAvatarUrl(src);
  const ini = name?.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
  let h = 0;
  for (let i = 0; i < (name?.length ?? 0); i++) h = (h * 31 + (name?.charCodeAt(i) ?? 0)) & 0xfffff;
  const hue = (h % 280) + 30;
  if (resolved && !broken) {
    return <img src={resolved} alt={name} onError={() => setBroken(true)} className="w-8 h-8 rounded-full object-cover shrink-0" />;
  }
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
      style={{ background: `hsl(${hue},45%,90%)`, color: `hsl(${hue},45%,30%)` }}>
      {ini}
    </div>
  );
}

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: recommendations, status } = useSelector((s) => s.recommendations);
  const sentIds = useSelector(selectSentRequestUserIds);
  const currentUserId = useSelector((s) => s.auth?.user?.userID ?? s.auth?.user?.id);

  useEffect(() => {
    if (status === "idle") dispatch(fetchRecommendations());
  }, [status, dispatch]);

  const handleConnect = async (userId, name) => {
    try {
      await dispatch(addConnection(userId)).unwrap();
      toast.success(`Request sent to ${name}!`);
    } catch {
      toast.error("Failed to send request.");
    }
  };

  const displayed = recommendations
    .filter((r) => Number(r.user_id) !== Number(currentUserId))
    .slice(0, 5);

  return (
    <aside className="space-y-4 sticky top-24">

      {/* Navigate */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <p className="px-4 pt-4 pb-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Navigate</p>
        <ul className="pb-2">
          {QUICK_LINKS.map(({ label, icon: Icon, to }) => (
            <li key={label}>
              <button
                onClick={() => navigate(to)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left"
              >
                <Icon className="w-4 h-4 text-gray-400" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* People you may know */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">People You May Know</p>
          <button onClick={() => navigate("/Recommendation-Page")}
            className="text-[12px] font-semibold text-blue-500 hover:text-blue-600 transition-colors">
            See all
          </button>
        </div>

        {status === "loading" ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-gray-200" />
          </div>
        ) : displayed.length === 0 ? (
          <p className="text-[12px] text-gray-400 text-center pb-6 px-4">No recommendations yet.</p>
        ) : (
          <ul className="pb-3">
            {displayed.map((rec) => {
              const name = rec.name || `User ${rec.user_id}`;
              const alreadySent = sentIds.includes(rec.user_id);
              return (
                <li key={rec.user_id}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group">
                  <button onClick={() => navigate(`/user-profile/${rec.user_id}`)}>
                    <PeerAvatar src={rec.avatar_url} name={name} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <button onClick={() => navigate(`/user-profile/${rec.user_id}`)}
                      className="text-[13px] font-semibold text-gray-800 hover:underline truncate block text-left leading-tight">
                      {name}
                    </button>
                    {rec.cgpa && (
                      <p className="text-[11px] text-gray-400">GPA {Number(rec.cgpa).toFixed(1)}</p>
                    )}
                  </div>
                  <button
                    onClick={() => !alreadySent && handleConnect(rec.user_id, name)}
                    disabled={alreadySent}
                    className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold border transition-all ${
                      alreadySent
                        ? "bg-green-50 text-green-600 border-green-100 cursor-default"
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-900 hover:text-white hover:border-gray-900 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {alreadySent ? <Check className="w-3 h-3" /> : <><UserPlus className="w-3 h-3" /> Connect</>}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-gray-200 overflow-hidden" style={{ background: "#14213D" }}>
        <div className="p-5">
          <p className="text-[14px] font-bold text-white mb-1">Need teammates?</p>
          <p className="text-[12px] mb-4" style={{ color: "rgba(255,255,255,0.45)", lineHeight: "1.6" }}>
            Post a project announcement to find the right people for your course.
          </p>
          <button
            onClick={() => document.getElementById("create-announcement-trigger")?.click()}
            className="w-full py-2.5 rounded-lg text-[13px] font-bold transition-colors"
            style={{ background: "#FCA311", color: "#14213D" }}
          >
            Create Announcement
          </button>
        </div>
      </div>

    </aside>
  );
}

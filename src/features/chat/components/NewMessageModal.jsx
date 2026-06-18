import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getConnections } from "../../../services/connections/api/connectionsApi";
import { getProfileByUserId } from "../../profile/api/profileApi";
import useChatStore from "../store/useChatStore";

function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}
function avatarHue(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xfffff;
  return (h % 280) + 30;
}
function ProfileAvatar({ avatarUrl, name, hue }) {
  const [broken, setBroken] = useState(false);
  if (avatarUrl && !broken) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        onError={() => setBroken(true)}
        className="w-10 h-10 rounded-full object-cover shrink-0"
      />
    );
  }
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
      style={{ background: `hsl(${hue},55%,88%)`, color: `hsl(${hue},55%,32%)` }}
    >
      {initials(name)}
    </div>
  );
}

export default function NewMessageModal({ onClose }) {
  const navigate = useNavigate();
  const { openDirectChat } = useChatStore();

  const [query, setQuery] = useState("");
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(null); // userId being opened
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    let cancelled = false;

    (async () => {
      try {
        const { connected_user_ids = [] } = await getConnections();
        // fetch profiles in parallel, drop failures silently
        const profiles = await Promise.all(
          connected_user_ids.map((id) =>
            getProfileByUserId(id).catch(() => null)
          )
        );
        if (!cancelled) {
          setConnections(profiles.filter(Boolean));
        }
      } catch {
        // no connections or network error — show empty state
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const filtered = connections.filter((p) => {
    const name = `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim().toLowerCase();
    return name.includes(query.toLowerCase());
  });

  const handleSelect = async (profile) => {
    const userId = profile.user_id ?? profile.id;
    const name = profile.name ?? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || `User ${userId}`;
    setOpening(userId);
    try {
      await openDirectChat(userId, name);
      onClose();
      navigate("/Chat-Main-Page");
    } catch {
      // toast already shown by openDirectChat
    } finally {
      setOpening(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden flex flex-col max-h-[70vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-outline-variant/15">
          <h2 className="text-[16px] font-bold text-primary">New Message</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-outline-variant/10">
          <div className="relative">
            <Search className="w-4 h-4 text-on-surface-variant/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search connections…"
              className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low border border-outline-variant/20 rounded-xl focus:outline-none focus:border-primary/30 text-sm font-medium placeholder:text-on-surface-variant/40 text-on-surface transition-colors"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-2">
          {loading ? (
            <div className="flex items-center justify-center gap-2 h-28 text-on-surface-variant/50">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm font-medium">Loading connections…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-28 text-center px-6">
              <MessageSquare className="w-7 h-7 text-on-surface-variant/25 mb-2" />
              <p className="text-sm font-semibold text-on-surface-variant/50">
                {connections.length === 0 ? "No connections yet" : "No results"}
              </p>
              <p className="text-xs text-on-surface-variant/35 mt-1">
                {connections.length === 0
                  ? "Connect with people to start chatting."
                  : "Try a different name."}
              </p>
            </div>
          ) : (
            filtered.map((profile) => {
              const userId = profile.user_id ?? profile.id;
              const name = profile.name ?? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || `User ${userId}`;
              const hue = avatarHue(name);
              const isOpening = opening === userId;

              return (
                <button
                  key={userId}
                  onClick={() => handleSelect(profile)}
                  disabled={!!opening}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-surface-container-low transition-colors text-left disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <ProfileAvatar avatarUrl={profile.avatar_url} name={name} hue={hue} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[14px] text-on-surface truncate">{name}</p>
                    {profile.major && (
                      <p className="text-xs text-on-surface-variant/55 truncate font-medium">{profile.major}</p>
                    )}
                  </div>
                  {isOpening && <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

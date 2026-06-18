import { useState } from "react";
import { Search, Plus, MessageSquare, Users, Users2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useChatStore from "../store/useChatStore";
import { resolveAvatarUrl } from "../../../shared/hooks/resolveAvatarUrl";

/** Resolve a display name from any profile shape the backend might return. */
function resolveName(profile) {
  if (!profile) return null;
  return (
    profile.name ??
    (profile.first_name ? `${profile.first_name} ${profile.last_name ?? ""}`.trim() : null) ??
    profile.full_name ??
    null
  );
}

function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}
function avatarHue(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xfffff;
  return (h % 280) + 30;
}

function Avatar({ name, avatarUrl, type, size = 11 }) {
  const [broken, setBroken] = useState(false);
  const hue = avatarHue(name);
  const px = size * 4;
  const resolved = resolveAvatarUrl(avatarUrl);
  if (resolved && !broken) {
    return (
      <img
        src={resolved}
        alt={name}
        onError={() => setBroken(true)}
        className="rounded-full object-cover shrink-0"
        style={{ width: px, height: px }}
      />
    );
  }
  const color = `hsl(${hue},55%,32%)`;
  return (
    <div
      className="rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
      style={{ width: px, height: px, background: `hsl(${hue},55%,88%)`, color }}
    >
      {type === "community" ? (
        <Users className="w-5 h-5" style={{ color }} />
      ) : type === "team" ? (
        <Users2 className="w-5 h-5" style={{ color }} />
      ) : (
        initials(name) || <MessageSquare className="w-4 h-4" />
      )}
    </div>
  );
}

const SECTION_EMPTY = {
  communities: { icon: Users,  title: "No community chats", hint: "Join a community to see its chat here." },
  teams:       { icon: Users2, title: "No team chats",      hint: "Join or create a team to chat." },
};

export default function MessagesSidebar({ onOpenCreateGroup, activeSection = "messages", connections = [], connectionsLoading = false }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [openingId, setOpeningId] = useState(null);

  const { rooms, activeRoomId, setActiveRoom, isLoadingRooms, fetchMessages, openDirectChat, addRoom } = useChatStore();

  // Build merged list for messages tab:
  // connections enriched with existing room data if DM already exists
  const mergedItems = (() => {
    if (activeSection !== "messages") return [];

    // Map existing DM rooms by the other user's ID (peerId stored on room)
    const roomByUserId = new Map();
    rooms.filter((r) => r.type === "direct").forEach((room) => {
      if (room.peerId) roomByUserId.set(room.peerId, room);
    });

    return connections.map((profile) => {
      const userId = Number(profile.user_id ?? profile.id);
      const name = resolveName(profile) || `User ${userId}`;
      const room = roomByUserId.get(userId) ?? null;
      // Patch room with real name and avatar
      const avatarUrl = resolveAvatarUrl(profile.avatar_url ?? null);
      if (room && (room.name !== name || room.avatarUrl !== avatarUrl)) {
        addRoom({ ...room, name, avatarUrl });
      }
      return { userId, name, avatarUrl: profile.avatar_url ?? null, major: profile.major ?? null, room };
    });
  })();

  const q = searchQuery.toLowerCase();

  const displayItems = activeSection === "messages"
    ? mergedItems.filter((item) => item.name.toLowerCase().includes(q))
    : rooms
        .filter(activeSection === "communities" ? (r) => r.type === "community" : (r) => r.type === "team")
        .filter((r) => r.name.toLowerCase().includes(q));

  const handleSelectRoom = (room) => {
    setActiveRoom(room.id);
    fetchMessages(room.id);
  };

  const handleSelectConnection = async (item) => {
    if (openingId) return;
    if (item.room) {
      // Patch the stored room name with the real profile name in case it was "User {id}"
      addRoom({ ...item.room, name: item.name });
      handleSelectRoom(item.room);
      return;
    }
    setOpeningId(item.userId);
    try {
      await openDirectChat(item.userId, item.name, item.avatarUrl);
      navigate("/Chat-Main-Page");
    } catch {
      // toast shown inside openDirectChat
    } finally {
      setOpeningId(null);
    }
  };

  const isLoading = activeSection === "messages" ? connectionsLoading || isLoadingRooms : isLoadingRooms;
  const empty = SECTION_EMPTY[activeSection];

  return (
    <div className="w-[300px] shrink-0 h-full flex flex-col bg-white border-r border-outline-variant/20">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-outline-variant/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[17px] font-bold text-primary tracking-tight capitalize">
            {activeSection === "messages" ? "Messages" : activeSection === "communities" ? "Communities" : "Teams"}
          </h2>
          {activeSection !== "communities" && (
            <button
              onClick={onOpenCreateGroup}
              title="New group"
              className="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-on-surface-variant/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeSection === "messages" ? "Search connections…" : "Search…"}
            className="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant/20 rounded-xl focus:outline-none focus:border-outline-variant/50 text-sm font-medium placeholder:text-on-surface-variant/40 text-on-surface transition-colors"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 min-h-0 overflow-y-auto py-2 px-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-on-surface-variant/50">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs font-medium">Loading…</span>
          </div>
        ) : activeSection === "messages" ? (
          displayItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center px-6">
              <MessageSquare className="w-8 h-8 text-on-surface-variant/30 mb-3" />
              <p className="text-sm font-semibold text-on-surface-variant/60">No connections yet</p>
              <p className="text-xs text-on-surface-variant/40 mt-1 leading-relaxed">
                Connect with people to start chatting.
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {displayItems.map((item) => {
                const isActive = item.room && activeRoomId === item.room.id;
                const isOpening = openingId === item.userId;
                return (
                  <button
                    key={item.userId}
                    onClick={() => handleSelectConnection(item)}
                    disabled={!!openingId}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left disabled:opacity-60 ${
                      isActive
                        ? "bg-primary/8 border border-primary/15 shadow-sm"
                        : "hover:bg-surface-container-low"
                    }`}
                  >
                    <div className="relative">
                      <Avatar name={item.name} avatarUrl={item.avatarUrl} type="direct" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className={`font-semibold text-[13.5px] truncate block ${isActive ? "text-primary" : "text-on-surface"}`}>
                        {item.name}
                      </span>
                      <p className="text-xs text-on-surface-variant/55 truncate mt-0.5 font-medium">
                        {item.room?.lastMessage || (item.major ?? "Tap to message")}
                      </p>
                    </div>

                    {isOpening && <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          )
        ) : displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center px-6">
            <empty.icon className="w-8 h-8 text-on-surface-variant/30 mb-3" />
            <p className="text-sm font-semibold text-on-surface-variant/60">{empty.title}</p>
            <p className="text-xs text-on-surface-variant/40 mt-1 leading-relaxed">{empty.hint}</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {displayItems.map((room) => {
              const isActive = activeRoomId === room.id;
              return (
                <button
                  key={room.id}
                  onClick={() => handleSelectRoom(room)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left ${
                    isActive
                      ? "bg-primary/8 border border-primary/15 shadow-sm"
                      : "hover:bg-surface-container-low"
                  }`}
                >
                  <Avatar name={room.name} type={room.type} />
                  <div className="flex-1 min-w-0">
                    <span className={`font-semibold text-[13.5px] truncate block ${isActive ? "text-primary" : "text-on-surface"}`}>
                      {room.name}
                    </span>
                    <p className="text-xs text-on-surface-variant/55 truncate mt-0.5 font-medium">
                      {room.lastMessage || (room.type === "community" ? "Community chat" : "Team channel")}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

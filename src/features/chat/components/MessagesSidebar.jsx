import { useState } from "react";
import { Search, Plus, User, Users } from "lucide-react";
import useChatStore from "../store/useChatStore";

function formatTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return "";
  const now = new Date();
  const diffMs = now - date;
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 24) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return "Yesterday";
}

export default function MessagesSidebar({
  onOpenCreateGroup,
  activeSection = "messages",
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const { rooms, activeRoomId, setActiveRoom } = useChatStore();

  const sectionRooms = rooms.filter((room) => {
    if (activeSection === "communities") return room.type === "community";
    if (activeSection === "teams") return room.type === "team";
    return true; // messages tab shows all
  });

  const filteredChats = sectionRooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-[320px] shrink-0 h-full flex flex-col bg-background-light border-r border-outline-variant/20">
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-primary tracking-tight">
            Messages
          </h2>
          <button
            onClick={onOpenCreateGroup}
            className="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:bg-secondary hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-on-surface-variant/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find connections..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-outline-variant/30 rounded-xl focus:outline-none focus:border-outline-variant/60 transition-all text-sm font-medium placeholder:text-on-surface-variant/40 text-on-surface"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-3 pt-1 space-y-0.5">
        {filteredChats.map((room) => {
          const isActive = activeRoomId === room.id;
          const isDirect = room.type === "direct";
          return (
            <div
              key={room.id}
              onClick={() => setActiveRoom(room.id)}
              className={`group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${
                isActive
                  ? "bg-white shadow-soft border border-outline-variant/20"
                  : "hover:bg-white/60"
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-surface-container-highest overflow-hidden flex items-center justify-center text-primary font-bold text-sm">
                  {isDirect ? (
                    <User className="w-5 h-5 text-primary" />
                  ) : (
                    <Users className="w-5 h-5 text-primary" />
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3
                    className={`font-semibold truncate text-[14px] leading-tight transition-colors ${
                      isActive ? "text-primary" : "text-on-surface-variant"
                    }`}
                  >
                    {room.name}
                  </h3>
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <p className="text-xs text-on-surface-variant/50 truncate font-medium leading-5">
                    {room.lastMessage || (isDirect ? "Direct message" : room.type === "community" ? "Community chat" : "Team channel")}
                  </p>
                  <span className="text-[10px] font-semibold text-secondary uppercase tracking-wide ml-2 shrink-0">
                    {isDirect ? "DM" : room.type === "community" ? "Community" : "Team"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-on-surface-variant text-sm p-8 text-center">
            <p className="mb-1 font-medium">No conversations yet</p>
            <p className="text-xs text-on-surface-variant/50">
              {searchQuery ? "Try a different search term." : activeSection === "communities" ? "Join a community to see its chat." : activeSection === "teams" ? "Join a team to see its chat." : "Start a direct chat."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

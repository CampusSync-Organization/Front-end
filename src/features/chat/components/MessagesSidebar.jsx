import { useState } from "react";
import { Search, Plus } from "lucide-react";

const allChats = [
  {
    id: 1,
    name: "Sarah Chen",
    time: "2h ago",
    msg: "The sources you shared are...",
    avatar: "https://placehold.co/100x100/14213D/FCA311?text=SC",
    type: "individual",
    status: "active",
    role: "Research Fellow",
  },
  {
    id: 2,
    name: "Alex Rivera",
    time: "2h ago",
    msg: "I'll check the repository tonight.",
    avatar: "https://placehold.co/100x100/14213D/FCA311?text=AR",
    type: "individual",
    status: "offline",
  },
  {
    id: 3,
    name: "Marcus Johnson",
    time: "Yesterday",
    msg: "Are we still meeting at the library?",
    avatar: "https://placehold.co/100x100/14213D/FCA311?text=MJ",
    type: "individual",
    status: "offline",
  },
  {
    id: 101,
    name: "Project Alpha Team",
    time: "10:05 am",
    msg: "Cody: I uploaded the files.",
    avatar: "https://placehold.co/100x100/14213D/FCA311?text=PA",
    type: "group",
    participants: ["Cody, Devon, Marvin"],
    status: "group",
  },
  {
    id: 4,
    name: "Floyd Miles",
    time: "8:00 am",
    msg: "don't forget our meeting..",
    avatar: "https://placehold.co/100x100/14213D/FCA311?text=FM",
    type: "individual",
    status: "offline",
  },
];

export default function MessagesSidebar({
  activeChat,
  setActiveChat,
  onOpenCreateGroup,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = allChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const statusBadge = (chat) => {
    if (chat.type === "group") {
      return (
        <span className="text-[10px] font-semibold text-secondary uppercase tracking-wide">
          {chat.participants?.length ?? 0} members
        </span>
      );
    }
    const isActive = chat.status === "active";
    return (
      <span
        className={`text-[10px] font-bold uppercase tracking-wide ${
          isActive ? "text-secondary" : "text-on-surface-variant/50"
        }`}
      >
        {isActive ? "Active" : "Offline"}
      </span>
    );
  };

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

        {/* Search bar — white, elevated */}
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
        {filteredChats.map((chat) => {
          const isActive = activeChat?.id === chat.id;
          return (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${
                isActive
                  ? "bg-white shadow-soft border border-outline-variant/20"
                  : "hover:bg-white/60"
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-surface-container-highest overflow-hidden flex items-center justify-center text-primary font-bold text-sm">
                  {chat.avatar.includes("placehold") ? (
                    <span>
                      {chat.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  ) : (
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                {chat.type === "individual" && (
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background-light ${
                      chat.status === "active"
                        ? "bg-secondary"
                        : "bg-on-surface-variant/30"
                    }`}
                  />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3
                    className={`font-semibold truncate text-[14px] leading-tight transition-colors ${
                      isActive ? "text-primary" : "text-on-surface-variant"
                    }`}
                  >
                    {chat.name}
                  </h3>
                  {chat.time && (
                    <span className="text-[11px] text-on-surface-variant/40 shrink-0 ml-2">
                      {chat.time}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <p className="text-xs text-on-surface-variant/50 truncate font-medium leading-5">
                    {chat.msg}
                  </p>
                  {statusBadge(chat)}
                </div>
              </div>
            </div>
          );
        })}

        {filteredChats.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-on-surface-variant text-sm p-8 text-center">
            <p className="mb-1 font-medium">No results found</p>
            <p className="text-xs text-on-surface-variant/50">
              Try a different search term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

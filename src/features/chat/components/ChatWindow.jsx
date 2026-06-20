import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { Send, ArrowLeft, MessageSquare, Users, Users2, ShieldAlert, X, Lightbulb, Trash2, Check } from "lucide-react";
import useChatStore from "../store/useChatStore";
import { chatSocket } from "../services/chatSocket";
import { useEventStore } from "../../events-communities/store/useEventStore";

const NO_ROOM_MESSAGES = [];

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return isNaN(d) ? "" : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function initials(name = "") {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}
function avatarHue(name = "") {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xfffff;
  return (h % 280) + 30;
}

function RoomAvatar({ name = "", type, size = 10 }) {
  const hue = avatarHue(name);
  const Icon = type === "community" ? Users : type === "team" ? Users2 : null;
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center font-bold text-sm shrink-0`}
      style={{
        background: `hsl(${hue},55%,88%)`,
        color: `hsl(${hue},55%,32%)`,
        width: `${size * 4}px`,
        height: `${size * 4}px`,
      }}
    >
      {Icon ? <Icon className="w-5 h-5" style={{ color: `hsl(${hue},55%,32%)` }} /> : initials(name)}
    </div>
  );
}

const ChatBubble = ({ message, currentUserId, memberNameMap = {}, isGroup = false, onDelete, isRoomAdmin = false }) => {
  const [hovered, setHovered] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const isSent = Number(message.sender_id) === Number(currentUserId);
  const isTemp = String(message.id).startsWith("tmp-");
  const canDelete = !isTemp && (isSent || isRoomAdmin);
  const senderName =
    !isSent && isGroup
      ? (memberNameMap[Number(message.sender_id)] ?? message.sender_name ?? null)
      : null;

  const handleMouseLeave = () => {
    setHovered(false);
    setConfirming(false);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setConfirming(true);
  };

  const handleConfirm = (e) => {
    e.stopPropagation();
    setConfirming(false);
    onDelete(message.id);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setConfirming(false);
  };

  return (
    <div
      className={`flex items-end gap-2 max-w-[75%] ${isSent ? "ml-auto flex-row-reverse" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {canDelete && (
        <div className={`shrink-0 transition-all duration-150 ${(hovered || confirming) ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          {confirming ? (
            <div className="flex items-center gap-1 bg-white border border-red-200 rounded-xl shadow-sm px-2 py-1">
              <span className="text-[11px] font-semibold text-red-600 whitespace-nowrap">Delete?</span>
              <button
                onClick={handleConfirm}
                className="p-0.5 rounded-md text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                title="Confirm"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleCancel}
                className="p-0.5 rounded-md text-outline/50 hover:bg-surface-container hover:text-on-surface transition-colors"
                title="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleDeleteClick}
              className="p-1.5 rounded-xl text-outline/30 hover:text-red-500 hover:bg-red-50 transition-all"
              title="Delete message"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
      <div className={`flex flex-col gap-1 ${isSent ? "items-end" : "items-start"}`}>
        {senderName && (
          <span className="text-[11px] font-semibold text-primary/70 px-1">{senderName}</span>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl max-w-full ${
            isSent
              ? "bg-primary text-white rounded-tr-sm"
              : "bg-surface-container-low text-on-surface rounded-tl-sm"
          }`}
        >
          <p className="text-[14.5px] leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
        <span className="text-[11px] text-outline/60 px-1">{formatTime(message.created_at)}</span>
      </div>
    </div>
  );
};

const DateDivider = ({ label }) => (
  <div className="flex items-center gap-3 py-1">
    <div className="flex-1 h-px bg-outline-variant/20" />
    <span className="text-[11px] font-bold uppercase tracking-widest text-outline/50 shrink-0">
      {label}
    </span>
    <div className="flex-1 h-px bg-outline-variant/20" />
  </div>
);

function groupByDate(messages) {
  const groups = [];
  let currentDate = null;
  messages.forEach((msg) => {
    const d = new Date(msg.created_at);
    const label = isNaN(d) ? "" : formatDateLabel(msg.created_at);
    if (label !== currentDate) {
      currentDate = label;
      groups.push({ type: "divider", label });
    }
    groups.push({ type: "message", msg });
  });
  return groups;
}

function ChatHeaderAvatar({ avatarUrl, name, type }) {
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
  return <RoomAvatar name={name} type={type} size={10} />;
}

export default function ChatWindow({ activeChat, onOpenAi, onOpenContact }) {
  const [inputValue, setInputValue] = useState("");
  const [moderationFeedback, setModerationFeedback] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const moderationSubscribed = useRef(false);

  const currentUser = useSelector((state) => state.auth?.user);
  const currentUserId = currentUser?.userID ?? currentUser?.id;

  const activeRoomId = useChatStore((s) => s.activeRoomId);
  const roomMessages = useChatStore((s) => {
    const rid = s.activeRoomId;
    return rid ? (s.messages[rid] ?? NO_ROOM_MESSAGES) : NO_ROOM_MESSAGES;
  });
  const sendMessage = useChatStore((s) => s.sendMessage);
  const deleteMessage = useChatStore((s) => s.deleteMessage);
  const fetchMessages = useChatStore((s) => s.fetchMessages);
  const pollMessages = useChatStore((s) => s.pollMessages);
  const teams = useChatStore((s) => s.teams);
  const communities = useEventStore((s) => s.communities);
  const lastSentRef = useRef(null);

  const isRoomAdmin = useMemo(() => {
    if (!currentUserId || !activeChat) return false;
    if (activeChat.type === "team") {
      const team = teams.find((t) => Number(t.id) === Number(activeChat.teamId));
      return team ? Number(team.owner_id) === Number(currentUserId) : false;
    }
    if (activeChat.type === "community") {
      const community = communities.find(
        (c) =>
          (c.roomId != null && Number(c.roomId) === Number(activeChat.id)) ||
          (c.id != null && activeChat.communityId != null && Number(c.id) === Number(activeChat.communityId))
      );
      return community ? Number(community.moderatorId) === Number(currentUserId) : false;
    }
    return false;
  }, [activeChat, teams, communities, currentUserId]);

  useEffect(() => {
    if (activeRoomId) {
      fetchMessages(activeRoomId);
    }
  }, [activeRoomId, fetchMessages]);

  useEffect(() => {
    if (!activeRoomId) return;
    const id = setInterval(() => pollMessages(activeRoomId), 4000);
    return () => clearInterval(id);
  }, [activeRoomId, pollMessages]);

  const memberNameMap = useMemo(() => {
    const map = {};
    if (activeChat?.type === "team" && activeChat.teamId) {
      const team = teams.find((t) => Number(t.id) === Number(activeChat.teamId));
      (team?.members ?? []).forEach((m) => {
        const id = m.user_id ?? m.id ?? m.userID;
        const name = m.name ?? m.username ?? m.full_name ?? null;
        if (id != null && name) map[Number(id)] = name;
      });
    }
    (activeChat?.members ?? []).forEach((m) => {
      if (m?.id != null && !map[Number(m.id)]) {
        map[Number(m.id)] = m.name ?? m.full_name ?? null;
      }
    });
    return map;
  }, [activeChat?.members, activeChat?.teamId, activeChat?.type, teams]);

  const isGroup = activeChat?.type === "community" || activeChat?.type === "team";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [roomMessages.length]);

  useEffect(() => {
    if (moderationSubscribed.current) return;
    moderationSubscribed.current = true;
    const unsubscribe = chatSocket.onModeration(({ explanation, suggestion }) => {
      console.log("[ChatWindow] moderation handler fired, showing banner", { explanation, suggestion });
      setModerationFeedback({ explanation, suggestion });
    });
    return () => {
      moderationSubscribed.current = false;
      unsubscribe();
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [inputValue]);

  if (!activeRoomId) {
    return (
      <div className="flex-1 flex flex-col h-full items-center justify-center bg-surface-container-lowest gap-4 text-center px-6">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center">
          <MessageSquare className="w-7 h-7 text-on-surface-variant/40" />
        </div>
        <div>
          <h2 className="text-[17px] font-bold text-on-surface-variant tracking-tight">
            Select a conversation
          </h2>
          <p className="text-sm text-on-surface-variant/50 mt-1">
            Pick a chat from the sidebar to start messaging.
          </p>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (!inputValue.trim() || !activeRoomId) return;
    setModerationFeedback(null);
    lastSentRef.current = { roomId: activeRoomId, content: inputValue.trim() };
    sendMessage(activeRoomId, inputValue.trim());
    setInputValue("");
  };

  const handleSendAnyway = () => {
    if (!lastSentRef.current) return;
    const { roomId, content } = lastSentRef.current;
    lastSentRef.current = null;
    setModerationFeedback(null);
    sendMessage(roomId, content, true);
  };

  const chatName = activeChat?.name ?? "Chat";

  const grouped = groupByDate(roomMessages);

  return (
    <div className="flex-1 flex flex-col h-full bg-white min-w-0 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 flex items-center justify-between border-b border-outline-variant/15 bg-white shrink-0">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onOpenContact}>
          <div className="relative">
            <ChatHeaderAvatar avatarUrl={activeChat?.avatarUrl} name={chatName} type={activeChat?.type} />
            {activeChat?.type === "direct" && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
            )}
          </div>
          <div>
            <h2 className="font-bold text-[15px] text-primary leading-tight">{chatName}</h2>
            <p className="text-[11.5px] text-on-surface-variant/60 font-medium capitalize">
              {activeChat?.type === "direct"
                ? "Direct Message"
                : activeChat?.type === "community"
                ? "Community Chat"
                : "Team Channel"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 space-y-3">
        {grouped.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-on-surface-variant/40 font-medium">
              No messages yet. Say hello! 👋
            </p>
          </div>
        )}

        {grouped.map((item, idx) =>
          item.type === "divider" ? (
            <DateDivider key={`d-${idx}`} label={item.label} />
          ) : (
            <ChatBubble
              key={item.msg.id}
              message={item.msg}
              currentUserId={currentUserId}
              memberNameMap={memberNameMap}
              isGroup={isGroup}
              isRoomAdmin={isRoomAdmin}
              onDelete={(id) => deleteMessage(activeRoomId, id)}
            />
          )
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Moderation feedback banner */}
      {moderationFeedback && (
        <div className="mx-5 mb-2 mt-1 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 flex gap-3 items-start shrink-0">
          <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-amber-800 mb-1">Message blocked</p>
            {moderationFeedback.explanation && (
              <p className="text-[12.5px] text-amber-700 leading-snug">{moderationFeedback.explanation}</p>
            )}
            {moderationFeedback.suggestion && (
              <div className="flex items-start gap-1.5 mt-2">
                <Lightbulb className="w-3.5 h-3.5 text-[#14213D] mt-0.5 shrink-0" />
                <p className="text-[12px] text-[#14213D] font-medium leading-snug">{moderationFeedback.suggestion}</p>
              </div>
            )}
            <button
              onClick={handleSendAnyway}
              className="mt-3 text-[12px] font-semibold text-amber-800 underline underline-offset-2 hover:text-amber-900 transition-colors"
            >
              Send anyway
            </button>
          </div>
          <button
            onClick={() => setModerationFeedback(null)}
            className="text-amber-500 hover:text-amber-700 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input */}
      <div className="px-5 py-3 shrink-0 border-t border-outline-variant/10">
        <div className="flex items-end gap-3 bg-surface-container-low rounded-2xl px-4 py-2.5 border border-outline-variant/20 focus-within:border-primary/30 transition-colors">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type a message…"
            rows={1}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 py-1 text-[14px] font-medium resize-none max-h-32 placeholder:text-on-surface-variant/40 text-on-surface leading-relaxed"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="p-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-center text-on-surface-variant/30 mt-1.5 font-medium tracking-wide">
          Enter to send · Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}

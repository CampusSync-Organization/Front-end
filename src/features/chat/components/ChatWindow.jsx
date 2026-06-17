import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Paperclip,
  Smile,
  Image,
  Send,
  Download,
  ArrowLeft,
  Sparkle,
} from "lucide-react";
import useChatStore from "../store/useChatStore";

function formatTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const ChatBubble = ({ message, currentUserId, memberNameMap = {}, isGroup = false }) => {
  const isSent = Number(message.sender_id) === Number(currentUserId);
  const senderName = !isSent && isGroup
    ? (memberNameMap[Number(message.sender_id)] ?? message.sender_name ?? null)
    : null;

  return (
    <div
      className={`flex gap-3 max-w-[640px] ${
        isSent ? "flex-row-reverse ml-auto" : ""
      }`}
    >
      <div className={`flex flex-col gap-1.5 ${isSent ? "items-end" : ""}`}>
        {senderName && (
          <span className="text-[11px] font-semibold text-primary ml-1">{senderName}</span>
        )}
        <div
          className={`p-4 rounded-2xl ${
            isSent
              ? "bg-primary text-white rounded-tr-sm"
              : "bg-surface-container-low text-on-surface rounded-tl-sm"
          }`}
        >
          <p className="text-[15px] leading-relaxed font-medium">
            {message.content}
          </p>
        </div>

        <span
          className={`text-[11px] font-semibold text-outline px-1 ${
            isSent ? "mr-1" : "ml-1"
          }`}
        >
          {formatTime(message.created_at)}
        </span>
      </div>
    </div>
  );
};

const DateDivider = ({ date }) => (
  <div className="flex justify-center py-2">
    <span className="text-[10px] font-black uppercase tracking-widest text-outline bg-surface-container-low px-3 py-1 rounded-full">
      {date}
    </span>
  </div>
);

export default function ChatWindow({
  activeChat,
  onOpenAi,
  onOpenContact,
  onBack,
}) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const currentUser = useSelector((state) => state.auth?.user);
  const currentUserId = currentUser?.userID ?? currentUser?.id;

  const { activeRoomId, messages, fetchMessages, sendMessage } = useChatStore();
  const roomMessages = messages[activeRoomId] ?? [];
  // Build a sender id → name map from room members for group chats
  const memberNameMap = (() => {
    if (activeChat?.type !== "community" && activeChat?.type !== "team") return {};
    const list = activeChat?.members ?? [];
    const map = {};
    list.forEach((m) => {
      if (typeof m === "object" && m.id != null) map[Number(m.id)] = m.name;
    });
    return map;
  })();

  useEffect(() => {
    if (activeRoomId) {
      fetchMessages(activeRoomId);
    }
  }, [activeRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [roomMessages]);

  if (!activeChat && !activeRoomId) {
    return (
      <div className="flex-1 flex h-full items-center justify-center bg-surface-container-lowest">
        <div className="text-center text-outline">
          <h2 className="text-2xl font-bold text-on-surface-variant mb-2 tracking-tight">
            Select a conversation
          </h2>
          <p className="text-sm font-medium">
            Choose a chat from the sidebar to start messaging.
          </p>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (!inputValue.trim() || !activeRoomId) return;
    sendMessage(activeRoomId, inputValue.trim());
    setInputValue("");
  };

  const chatName = activeChat?.name ?? "Chat";
  const chatType = activeChat?.type;

  return (
    <div className="flex-1 flex flex-col h-full bg-white min-w-0 overflow-hidden">
      {/* Fixed top bar */}
      <div className="px-4 md:px-6 py-4 flex items-center justify-between border-b border-outline-variant/20 bg-white shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="md:hidden p-2 rounded-xl hover:bg-neutral-light transition-colors text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={onOpenContact}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden flex items-center justify-center text-primary font-bold text-sm">
                {chatName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              {chatType === "direct" && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-secondary rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <h2 className="font-bold text-primary leading-none tracking-tight">
                {chatName}
              </h2>
              {chatType && (
                <p className="text-xs text-secondary font-semibold mt-0.5 capitalize">
                  {chatType === "direct" ? "Direct Message" : "Team"}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenAi}
            className="p-2.5 rounded-xl hover:bg-surface-container-high transition-colors text-on-surface-variant"
          >
            <Sparkle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 md:p-6 space-y-6">
        {roomMessages.length > 0 && (
          <DateDivider
            date={new Date(roomMessages[0].created_at).toLocaleDateString(
              undefined,
              { year: "numeric", month: "long", day: "numeric" }
            )}
          />
        )}

        {roomMessages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            currentUserId={currentUserId}
            memberNameMap={memberNameMap}
            isGroup={activeChat?.type === "community" || activeChat?.type === "team"}
          />
        ))}

        {roomMessages.length === 0 && (
          <div className="flex items-center justify-center h-full text-on-surface-variant/50 text-sm font-medium">
            No messages yet. Say hello!
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="px-4 md:px-6 py-4 shrink-0 border-t border-outline-variant/10">
        <div className="flex items-end gap-3 bg-surface-container-low rounded-2xl px-3 py-2 border border-outline-variant/20 focus-within:border-outline-variant/50 transition-colors">
          {/* Attachment icons */}
          <div className="flex items-center gap-0.5 pb-1 shrink-0">
            <button className="p-1.5 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-container-high">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-1.5 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-container-high">
              <Smile className="w-5 h-5" />
            </button>
            <button className="p-1.5 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-container-high">
              <Image className="w-5 h-5" />
            </button>
          </div>

          {/* Textarea */}
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 py-2 text-sm font-medium resize-none max-h-32 min-h-[36px] placeholder:text-on-surface-variant/50 text-on-surface"
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="p-2.5 bg-primary hover:bg-secondary text-white rounded-xl font-bold text-sm flex items-center justify-center transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 mb-0.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[10px] text-center text-on-surface-variant/40 mt-2 font-medium tracking-wide">
          Enter to send &middot; Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}

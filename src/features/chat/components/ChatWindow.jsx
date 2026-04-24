import { useState } from "react";
import {
  Video,
  Phone,
  MoreVertical,
  Paperclip,
  Smile,
  Image,
  Send,
  Download,
  Edit3,
  ArrowLeft,
  Sparkle,
} from "lucide-react";
import ChatRightPanel from "./ChatRightPanel";

const MOCK_MESSAGES = [
  {
    id: 1,
    type: "received",
    sender: "Sarah Chen",
    senderAvatar: "https://placehold.co/40x40/14213D/FCA311?text=SC",
    text: "Hey! I finally got around to reading that paper on Bayesian networks we discussed yesterday. The methodology section was surprisingly clear!",
    time: "10:42 AM",
    attachment: null,
  },
  {
    id: 2,
    type: "sent",
    text: "Right? I thought you'd like it. I'm actually trying to apply that same node structure to our collaborative project's data set.",
    time: "10:45 AM",
  },
  {
    id: 3,
    type: "received",
    sender: "Sarah Chen",
    senderAvatar: "https://placehold.co/40x40/14213D/FCA311?text=SC",
    text: "That's a great idea. Here are the supplementary sources I found that might help with the weighting logic:",
    time: "10:48 AM",
    attachment: {
      name: "Bayesian_Supplement_v2.pdf",
      size: "2.4 MB",
      type: "PDF Document",
    },
  },
];

const ChatBubble = ({ message }) => {
  const isSent = message.type === "sent";
  const hasAttachment = !!message.attachment;

  return (
    <div
      className={`flex gap-3 max-w-[640px] ${
        isSent ? "flex-row-reverse ml-auto" : ""
      }`}
    >
      <div className={`flex flex-col gap-1.5 ${isSent ? "items-end" : ""}`}>
        {!isSent && (
          <div className="flex items-center gap-2.5 px-1">
            <img
              src={message.senderAvatar}
              alt={message.sender}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <span className="text-sm font-bold text-on-surface">
              {message.sender}
            </span>
          </div>
        )}

        <div
          className={`p-4 rounded-2xl ${
            isSent
              ? "bg-primary text-white rounded-tr-sm"
              : "bg-surface-container-low text-on-surface rounded-tl-sm"
          }`}
        >
          <p className="text-[15px] leading-relaxed font-medium">
            {message.text}
          </p>
        </div>

        {hasAttachment && (
          <div
            className={`flex items-center gap-4 p-4 rounded-2xl border border-outline-variant/20 hover:bg-surface-container-high transition-colors cursor-pointer group max-w-sm ${
              isSent
                ? "bg-surface-container-low"
                : "bg-surface-container-lowest"
            }`}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-secondary/20">
              <span className="text-secondary text-sm font-bold">PDF</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-on-surface truncate">
                {message.attachment.name}
              </p>
              <p className="text-xs text-outline">
                {message.attachment.size} &bull; {message.attachment.type}
              </p>
            </div>
            <Download className="w-4 h-4 text-outline group-hover:text-secondary shrink-0 transition-colors" />
          </div>
        )}

        <span
          className={`text-[11px] font-semibold text-outline px-1 ${
            isSent ? "mr-1" : "ml-1"
          }`}
        >
          {message.time}
        </span>
      </div>
    </div>
  );
};

const DateDivider = () => (
  <div className="flex justify-center py-2">
    <span className="text-[10px] font-black uppercase tracking-widest text-outline bg-surface-container-low px-3 py-1 rounded-full">
      September 24, 2024
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

  if (!activeChat) {
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
    if (!inputValue.trim()) return;
    setInputValue("");
  };

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
                {activeChat.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              {activeChat.type === "individual" && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-secondary rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <h2 className="font-bold text-primary leading-none tracking-tight">
                {activeChat.name}
              </h2>
              {activeChat.role && (
                <p className="text-xs text-secondary font-semibold mt-0.5">
                  {activeChat.role}
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
        <DateDivider />

        {MOCK_MESSAGES.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}

        <div className="flex items-center gap-2 text-secondary font-bold text-xs animate-pulse">
          <Edit3 className="w-3.5 h-3.5" />
          <span>{activeChat.name} is typing...</span>
        </div>
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

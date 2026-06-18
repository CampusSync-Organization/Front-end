import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";
import useChatStore from "../store/useChatStore";

export default function StartDirectChatButton({ userId, userName, className = "" }) {
  const navigate = useNavigate();
  const { openDirectChat } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await openDirectChat(userId, userName); // pass name so sidebar shows it correctly
      navigate("/Chat-Main-Page");
    } catch (err) {
      const status = err?.response?.status;
      if (status === 403) {
        toast.error("You can only message connections.");
      } else {
        toast.error("Failed to open chat.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      aria-label={`Message ${userName ?? "user"}`}
      className={`flex items-center gap-2 bg-primary text-white rounded-xl px-4 py-2 font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        <MessageSquare className="w-4 h-4 shrink-0" />
      )}
      {isLoading ? "Opening…" : "Message"}
    </button>
  );
}

import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useChatStore from "../store/useChatStore";

const CreateGroupModal = ({ isOpen, onClose }) => {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { createTeam } = useChatStore();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!teamName.trim()) return;
    setIsSubmitting(true);
    try {
      const team = await createTeam(teamName.trim(), description.trim() || undefined);
      setTeamName("");
      setDescription("");
      onClose();
      // If the backend returned a chat_room_id, the store already set activeRoomId —
      // navigate to the chat so the owner lands in the new team room immediately.
      if (team?.chat_room_id) {
        navigate("/Chat-Main-Page");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl w-full max-w-[440px] flex flex-col shadow-soft-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 pb-4 border-b border-neutral-light">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-xl text-primary tracking-tight">
              Create Team
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-neutral-light transition-colors text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Create a new team to collaborate with others.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1.5">
              Team Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="e.g. Research Alpha"
              className="w-full px-4 py-3 bg-neutral-light rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary/30 placeholder:text-on-surface-variant/40 text-on-surface transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface mb-1.5">
              Description <span className="text-on-surface-variant/40 font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this team about?"
              rows={3}
              className="w-full px-4 py-3 bg-neutral-light rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary/30 placeholder:text-on-surface-variant/40 text-on-surface transition-all resize-none"
            />
          </div>
        </div>

        <div className="p-5 border-t border-neutral-light bg-neutral-light">
          <button
            className="w-full py-3.5 bg-primary hover:bg-secondary text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed shadow-soft"
            disabled={!teamName.trim() || isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Creating..." : "Create Team"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;

import React from "react";
import { AlertTriangle, Lightbulb, ThumbsUp, Users } from "lucide-react";

const AnalysisCard = ({
  title,
  message,
  suggestion,
  timeAgo,
  colorClass,
  icon: CARD_ICON,
}) => {
  return (
    <div
      className={`p-4 rounded-xl border-l-4 ${colorClass} bg-white shadow-sm mb-4`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-full ${colorClass.replace("border-", "bg-").replace("500", "100")} shrink-0`}
        >
          <CARD_ICON
            size={18}
            className={`${colorClass.replace("border-", "text-")}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className={`font-bold text-sm mb-1 ${colorClass.replace("border-", "text-")}`}
          >
            {title}
          </h4>
          <p className="text-muted-foreground text-xs mb-2 leading-relaxed">
            {message}
          </p>

          {suggestion && (
            <div className="bg-neutral-light p-2 rounded-lg border border-border-light mb-2">
              <p className="text-xs text-muted-gray font-medium mb-1">
                Try this instead:
              </p>
              <p className="text-xs text-primary italic">"{suggestion}"</p>
            </div>
          )}

          <p className="text-[10px] text-muted-gray font-medium">{timeAgo}</p>
        </div>
      </div>
    </div>
  );
};

const ChatRightPanel = ({ type }) => {
  if (type !== "ai") {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
        <div className="w-16 h-16 bg-neutral-light rounded-full flex items-center justify-center mb-4">
          <Users size={32} className="text-muted-gray" />
        </div>
        <h3 className="text-lg font-bold text-primary mb-2">Contact Info</h3>
        <p className="text-sm">Select a contact to view their details here.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-neutral-light">
        <h3 className="font-bold text-primary flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-secondary"></span>
          AI Conversation Analysis
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnalysisCard
          title="Harsh Tone Detected"
          message="This message contains confrontational language that might escalate the conversation."
          suggestion="I feel like my perspective isn't being heard. Can we talk about this?"
          timeAgo="2 min ago"
          colorClass="border-red-500"
          icon={AlertTriangle}
        />

        <AnalysisCard
          title="Clarity Suggestion"
          message="Adding specific details would make your point clearer and more persuasive."
          timeAgo="5 min ago"
          colorClass="border-emerald-500"
          icon={Lightbulb}
        />

        <AnalysisCard
          title="Passive-Aggressive Language"
          message="This message might come across as dismissive or sarcastic."
          timeAgo="8 min ago"
          colorClass="border-amber-500"
          icon={AlertTriangle}
        />

        <AnalysisCard
          title="Communication Win"
          message="Great use of empathy! This response showed understanding of the other person's perspective."
          timeAgo="12 min ago"
          colorClass="border-green-500"
          icon={ThumbsUp}
        />
      </div>
    </div>
  );
};

export default ChatRightPanel;

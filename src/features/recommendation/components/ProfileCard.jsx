import React, { useState } from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { UserAvatar } from "../../../shared/ui/UserAvatar";
import {
  Briefcase,
  Eye,
  UserPlus,
  Sparkles,
  Zap,
  ClockArrowDown,
  UserCheck,
  X,
} from "lucide-react";
import clsx from "clsx";
import {
  acceptConnectionRequest,
  addConnection,
  dismissPendingConnectionRequest,
  selectDeclinedRequesterIds,
  selectConnectedUserIds,
  selectPendingRequesterIds,
  selectSentRequestUserIds,
} from "../../../services/connections/store/connectionsSlice";

const ProfileCard = ({ profile = {}, variants }) => {
  const {
    name = "Anonymous Student",
    pfp, // Backend uses 'pfp'
    tags = ["Student", "CampusSync User"],
    explanation = "", // Backend uses 'explanation' string
    id,
  } = profile;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const connectedUserIds = useSelector(selectConnectedUserIds);
  const declinedRequesterIds = useSelector(selectDeclinedRequesterIds);
  const pendingRequesterIds = useSelector(selectPendingRequesterIds);
  const sentRequestUserIds = useSelector(selectSentRequestUserIds);
  const [isSending, setIsSending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const targetUserId = profile.user_id || id;
  const isConnected = connectedUserIds.includes(targetUserId);
  const isRequestDeclined = declinedRequesterIds.includes(targetUserId);
  const isRequestPending = sentRequestUserIds.includes(targetUserId);
  const isIncomingRequest = pendingRequesterIds.includes(targetUserId);

  // --- Data Logic Helpers ---

  // 2. Parse the explanation string into an array for the bullet points
  // This looks for the part after "due to similar" and splits by commas
  const parseExplanation = (text) => {
    if (!text) return ["Great personality match"];
    const parts = text.split("due to similar");
    if (parts.length > 1) {
      return parts[1].split(",").map((item) => item.trim());
    }
    return [text];
  };

  const matchReasons = parseExplanation(explanation);

  // 3. Placeholders for data not yet in backend

  const role = "Undergraduate";
  const isBestMatch = id % 5 === 0; // Just a placeholder logic for visual flair
  const connectDisabled =
    !targetUserId || isSending || isConnected || isRequestPending || isRequestDeclined;
  const connectLabel = isSending
    ? "Sending..."
    : isConnected
      ? "Connected"
      : isRequestDeclined
        ? "Declined"
      : isRequestPending
        ? "Pending"
        : "Connect";
  const ConnectIcon = isConnected
    ? UserCheck
    : isRequestDeclined
      ? X
    : isRequestPending
      ? ClockArrowDown
      : UserPlus;

  const handleConnect = () => {
    if (!targetUserId || connectDisabled) return;
    setIsSending(true);
    dispatch(addConnection(targetUserId))
      .unwrap()
      .then(() => {
        toast.success("Connection request sent");
      })
      .catch((err) => {
        toast.error(err || "Failed to send connection request");
      })
      .finally(() => {
        setIsSending(false);
      });
  };

  const handleConfirm = () => {
    if (!targetUserId || isConfirming) return;
    setIsConfirming(true);
    dispatch(acceptConnectionRequest(targetUserId))
      .unwrap()
      .then(() => {
        toast.success("Connection request accepted");
      })
      .catch((err) => {
        toast.error(err || "Failed to accept connection request");
      })
      .finally(() => {
        setIsConfirming(false);
      });
  };

  const handleDecline = () => {
    if (!targetUserId) return;
    dispatch(dismissPendingConnectionRequest(targetUserId));
    toast.success("Connection request declined");
  };

  return (
    <Motion.div
      variants={variants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative bg-white rounded-3xl p-5 shadow-soft hover:shadow-soft-lg transition-shadow duration-300 border border-neutral-200/60 overflow-hidden flex flex-col"
    >
      {/* Best Match Badge */}
      {isBestMatch && (
        <div className="absolute top-3 right-3 bg-secondary/10 text-secondary-dark px-3 py-1 rounded-full flex items-center gap-1.5 border border-secondary/20 z-10">
          <Sparkles className="w-3 h-3 text-secondary" />
          <span className="text-xs font-semibold text-secondary">
            Best Match
          </span>
        </div>
      )}

      {/* Profile Header */}
      <div className="flex flex-col items-center mb-6 pt-6">
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-neutral-50 shadow-sm">
            <UserAvatar
              src={pfp}
              name={name}
              className="w-full h-full object-cover text-2xl transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow-sm border border-neutral-100">
            <div className="bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-primary mb-1 text-center">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5" />
          {role}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1.5 bg-secondary/20 text-secondary text-xs font-bold rounded-lg border border-neutral-100/50"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Why This Match Section */}
      <div className="bg-background rounded-2xl p-4 mb-6 border border-neutral-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-indigo-50 rounded-lg">
            <Zap className="w-4 h-4 text-indigo-600" />
          </div>
          <span className="text-xs font-bold text-primary uppercase tracking-wide">
            Why this match
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {matchReasons.map((reason, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-neutral-100/80 shadow-sm"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-secondary/80"></div>
              <span className="text-xs font-medium text-primary/80">
                {reason}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div
        className={clsx(
          "mt-auto grid gap-3",
          isIncomingRequest && !isConnected && !isRequestDeclined
            ? "grid-cols-3"
            : "grid-cols-2",
        )}
      >
        <button
          onClick={() => navigate(`/user-profile/${id}`)}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-neutral-200 text-primary text-sm font-semibold hover:bg-neutral-50 transition-colors"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        {isIncomingRequest && !isConnected && !isRequestDeclined ? (
          <>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isConfirming}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-primary text-white text-sm font-semibold shadow-lg transition-all hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UserCheck className="w-4 h-4" />
              {isConfirming ? "..." : "Confirm"}
            </button>
            <button
              type="button"
              onClick={handleDecline}
              disabled={isConfirming}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-200 text-slate-700 text-sm font-semibold transition-colors hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <X className="w-4 h-4" />
              Decline
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={handleConnect}
            disabled={connectDisabled}
            className={clsx(
              "flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold shadow-lg transition-all hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:hover:translate-y-0",
              isConnected
                ? "bg-emerald-600 text-white"
                : isRequestDeclined
                  ? "bg-slate-200 text-slate-600 shadow-none"
                : isRequestPending
                  ? "bg-slate-200 text-slate-600 shadow-none"
                  : "bg-primary text-white hover:bg-primary/80 disabled:opacity-60",
            )}
          >
            <ConnectIcon className="w-4 h-4" />
            {connectLabel}
          </button>
        )}
      </div>
    </Motion.div>
  );
};

export default ProfileCard;

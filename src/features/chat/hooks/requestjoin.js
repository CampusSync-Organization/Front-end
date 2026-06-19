import { toast } from "sonner";
import { useSelector } from "react-redux";
import useChatStore from "../store/useChatStore";

export function useJoinRequest(teamId) {
  const currentUser = useSelector((s) => s.auth.user);
  const currentUserId = currentUser?.userID ?? currentUser?.id ?? null;
  const requestKey = currentUserId ? `${currentUserId}:${teamId}` : String(teamId);
  const requestJoinTeam = useChatStore((s) => s.requestJoinTeam);
  const joinStatusFromStore = useChatStore(
    (s) => s.joinRequestStatus[requestKey] ?? "idle",
  );
  const joinError = useChatStore(
    (s) => s.joinRequestError[requestKey] ?? null,
  );
  // If the backend already flagged this team as having a pending request (survives refresh)
  const hasPendingFromBackend = useChatStore(
    (s) => s.teams.find((t) => String(t.id) === String(teamId))?.join_request_status === "pending",
  );
  const joinStatus = joinStatusFromStore !== "idle" ? joinStatusFromStore : hasPendingFromBackend ? "sent" : "idle";

  const handleJoinRequest = async () => {
    if (!teamId) {
      toast.error("No team linked to this announcement.");
      return;
    }
    try {
      await requestJoinTeam(teamId, currentUserId);
    } catch (err) {
      const message =
        err.response?.data?.detail ??
        err.response?.data?.message ??
        joinError ??
        "Failed to send join request.";
      toast.error(message);
    }
  };

  return { handleJoinRequest, joinStatus, joinError };
}

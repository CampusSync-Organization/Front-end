import { toast } from "sonner";
import { useSelector } from "react-redux";
import useChatStore from "../store/useChatStore";

export function useJoinRequest(teamId) {
  const currentUser = useSelector((s) => s.auth.user);
  const currentUserId = currentUser?.userID ?? currentUser?.id ?? null;
  const requestKey = currentUserId ? `${currentUserId}:${teamId}` : String(teamId);
  const requestJoinTeam = useChatStore((s) => s.requestJoinTeam);
  const joinStatus = useChatStore(
    (s) => s.joinRequestStatus[requestKey] ?? "idle",
  );
  const joinError = useChatStore(
    (s) => s.joinRequestError[requestKey] ?? null,
  );

  const handleJoinRequest = async () => {
    if (!teamId) {
      toast.error("No team linked to this announcement.");
      return;
    }
    try {
      await requestJoinTeam(teamId, currentUserId);
      toast.success("Join request sent!");
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

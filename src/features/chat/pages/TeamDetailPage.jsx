import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Users2,
  UserCheck,
  LogOut,
  CheckCircle,
  Clock,
  MessageSquare,
} from "lucide-react";
import useChatStore from "../store/useChatStore";

export default function TeamDetailPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth?.user);
  const currentUserId = authUser?.userID ?? authUser?.id ?? null;

  const teams = useChatStore((s) => s.teams);
  const rooms = useChatStore((s) => s.rooms);
  const fetchTeam = useChatStore((s) => s.fetchTeam);
  const approveJoinRequest = useChatStore((s) => s.approveJoinRequest);
  const leaveTeam = useChatStore((s) => s.leaveTeam);
  const setActiveRoom = useChatStore((s) => s.setActiveRoom);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approvingIds, setApprovingIds] = useState(new Set());
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (!teamId) return;
    setIsLoading(true);
    fetchTeam(teamId)
      .catch(() => setError("Failed to load team details."))
      .finally(() => setIsLoading(false));
  }, [teamId]);

  const team = teams.find((t) => String(t.id) === String(teamId));

  const isOwner =
    team?.owner_id != null && Number(team.owner_id) === Number(currentUserId);

  const isMember =
    !isOwner &&
    Array.isArray(team?.members) &&
    team.members.some(
      (m) => Number(m.user_id ?? m.id ?? m.userID) === Number(currentUserId)
    );

  // Find the team's group chat room if it already exists in the store
  const teamRoom = rooms.find(
    (r) => r.type === "team" && Number(r.teamId) === Number(teamId)
  );

  const handleOpenChat = () => {
    if (!teamRoom) return;
    setActiveRoom(teamRoom.id);
    navigate("/Chat-Main-Page");
  };

  const handleApprove = async (requestId) => {
    setApprovingIds((prev) => new Set(prev).add(requestId));
    try {
      await approveJoinRequest(teamId, requestId);
      await fetchTeam(teamId);
      // approveJoinRequest already sets activeRoomId in the store
      navigate("/Chat-Main-Page");
    } catch {
      // error already toasted in store
    } finally {
      setApprovingIds((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  };

  const handleLeave = async () => {
    if (!window.confirm("Are you sure you want to leave this team?")) return;
    setIsLeaving(true);
    try {
      await leaveTeam(Number(teamId));
      navigate("/teams");
    } catch {
      // error already toasted in store
    } finally {
      setIsLeaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-lg">{error ?? "Team not found."}</p>
        <button
          onClick={() => navigate("/teams")}
          className="flex items-center gap-2 text-primary font-semibold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Teams
        </button>
      </div>
    );
  }

  const joinRequests = Array.isArray(team.join_requests)
    ? team.join_requests.filter((r) => !r.approved)
    : [];
  const members = Array.isArray(team.members) ? team.members : [];

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-border/40 py-8 px-6 sm:px-12 shadow-sm">
        <div className="max-w-[900px] mx-auto">
          <button
            onClick={() => navigate("/teams")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium text-sm mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Teams
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Users2 className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{team.name}</h1>
                {team.owner_name && (
                  <p className="text-sm text-muted-foreground mt-1">Owned by {team.owner_name}</p>
                )}
                {members.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {members.length} member{members.length !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {teamRoom && (
                <button
                  onClick={handleOpenChat}
                  className="flex items-center gap-2 bg-[#FCA311] text-white rounded-xl px-4 py-2 font-semibold text-sm hover:bg-[#FCA311]/90 transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  Open Team Chat
                </button>
              )}
              {isMember && (
                <button
                  onClick={handleLeave}
                  disabled={isLeaving}
                  className="flex items-center gap-2 border border-red-200 text-red-600 rounded-xl px-4 py-2 font-semibold text-sm hover:bg-red-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <LogOut className="w-4 h-4" />
                  {isLeaving ? "Leaving..." : "Leave Team"}
                </button>
              )}
              {isOwner && (
                <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1.5 rounded-full">
                  Owner
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-6 sm:px-12 mt-10 space-y-10">
        {/* Description */}
        {team.description && (
          <section className="bg-white rounded-2xl border border-border shadow-sm p-6">
            <h2 className="text-lg font-semibold text-foreground mb-3">About</h2>
            <p className="text-muted-foreground leading-relaxed">{team.description}</p>
          </section>
        )}

        {/* Team Chat CTA — shown when no room exists yet and user is owner */}
        {isOwner && !teamRoom && (
          <section className="bg-white rounded-2xl border border-dashed border-[#FCA311]/40 shadow-sm p-6 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FCA311]/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[#FCA311]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">No team chat yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Approve a join request below to create the team group chat automatically.
              </p>
            </div>
          </section>
        )}

        {/* Members */}
        <section className="bg-white rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Users2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Members ({members.length})
            </h2>
          </div>

          {members.length === 0 ? (
            <p className="text-muted-foreground text-sm">No members yet.</p>
          ) : (
            <ul className="divide-y divide-border/40">
              {members.map((member) => {
                const memberId = member.user_id ?? member.id ?? member.userID;
                const memberName = member.name ?? member.username ?? `User ${memberId}`;
                return (
                  <li
                    key={memberId}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary">
                        {memberName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {memberName}
                      </p>
                      {member.email && (
                        <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                      )}
                    </div>
                    {Number(memberId) === Number(team.owner_id) && (
                      <span className="ml-auto text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full shrink-0">
                        Owner
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Join Requests — owner only */}
        {isOwner && (
          <section className="bg-white rounded-2xl border border-border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-foreground">
                Pending Join Requests ({joinRequests.length})
              </h2>
            </div>

            {joinRequests.length === 0 ? (
              <p className="text-muted-foreground text-sm">No pending requests.</p>
            ) : (
              <ul className="divide-y divide-border/40">
                {joinRequests.map((req) => {
                  const reqId = req.id ?? req.request_id;
                  const requesterName =
                    req.name ?? req.username ?? req.user_name ?? `User ${req.user_id}`;
                  return (
                    <li key={reqId} className="flex items-center gap-3 py-3">
                      <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
                        <span className="text-sm font-bold text-amber-600">
                          {requesterName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {requesterName}
                        </p>
                        {req.email && (
                          <p className="text-xs text-muted-foreground truncate">{req.email}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleApprove(reqId)}
                        disabled={approvingIds.has(reqId)}
                        className="flex items-center gap-1.5 bg-primary text-white rounded-xl px-3.5 py-1.5 text-xs font-semibold hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        {approvingIds.has(reqId) ? "Approving..." : "Approve"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

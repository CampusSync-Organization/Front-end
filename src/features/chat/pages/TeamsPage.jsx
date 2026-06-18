import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Users2, Search, Plus, UserCheck, Settings } from "lucide-react";
import useChatStore from "../store/useChatStore";
import CreateGroupModal from "../components/CreateGroupModal";

export default function TeamsPage() {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth?.user);
  const currentUserId = authUser?.userID ?? authUser?.id ?? null;

  const { teams, fetchTeams, requestJoinTeam } = useChatStore();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestingIds, setRequestingIds] = useState(new Set());

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const filtered = teams.filter((t) =>
    t.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRequestJoin = async (e, teamId) => {
    e.stopPropagation();
    setRequestingIds((prev) => new Set(prev).add(teamId));
    try {
      await requestJoinTeam(teamId);
    } finally {
      setRequestingIds((prev) => {
        const next = new Set(prev);
        next.delete(teamId);
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24">
      <CreateGroupModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchTeams();
        }}
      />

      {/* Header */}
      <div className="bg-white border-b border-border/40 py-10 px-6 sm:px-12 mb-10 shadow-sm">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Teams</h1>
            <p className="text-muted-foreground text-lg">Discover and join teams to collaborate with others.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white rounded-xl px-5 py-2.5 font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            Create Team
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 sm:px-12 space-y-8">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-dashed border-border/60 rounded-3xl shadow-sm">
            <Users2 className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">
              {search ? "No teams match your search" : "No teams yet"}
            </h3>
            <p className="text-muted-foreground">
              {search ? "Try a different search term." : "Be the first to create a team!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((team) => {
              const isOwner =
                team.owner_id != null && Number(team.owner_id) === Number(currentUserId);
              const hasRequested = team.join_request_status === "pending";

              return (
                <div
                  key={team.id}
                  onClick={() => navigate(`/teams/${team.id}`)}
                  className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col overflow-hidden group"
                >
                  {/* Card top accent */}
                  <div className="h-1.5 bg-gradient-to-r from-primary to-secondary" />

                  <div className="p-6 flex flex-col flex-1 gap-3">
                    {/* Icon + Name */}
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Users2 className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground text-base leading-tight group-hover:text-primary transition-colors truncate">
                          {team.name}
                        </h3>
                        {team.member_count != null && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {team.member_count} member{team.member_count !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {team.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {team.description}
                      </p>
                    )}

                    <div className="flex-1" />

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/40 mt-auto">
                      {team.owner_name ? (
                        <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                          by {team.owner_name}
                        </span>
                      ) : (
                        <span />
                      )}

                      {isOwner ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/teams/${team.id}`);
                          }}
                          className="flex items-center gap-1.5 border border-border rounded-xl px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-all"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          Manage
                        </button>
                      ) : hasRequested ? (
                        <button
                          disabled
                          className="flex items-center gap-1.5 border border-border rounded-xl px-3 py-1.5 text-xs font-semibold text-muted-foreground bg-muted cursor-not-allowed"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Requested
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleRequestJoin(e, team.id)}
                          disabled={requestingIds.has(team.id)}
                          className="bg-primary text-white rounded-xl px-3 py-1.5 text-xs font-semibold hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {requestingIds.has(team.id) ? "Sending..." : "Request to Join"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

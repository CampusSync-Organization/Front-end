import { useEffect } from "react";
import { useEventStore } from "../store/useEventStore";
import { CommunityCard } from "../components/CommunityCard";
import { Users, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyCommunitiesPage() {
  const navigate = useNavigate();
  const { 
    communities, 
    fetchCommunities, 
    isLoadingCommunities,
    currentUser,
    joinCommunity,
    leaveCommunity
  } = useEventStore();

  useEffect(() => {
    if (communities.length === 0) {
      fetchCommunities();
    }
  }, [communities.length, fetchCommunities]);

  const joinedCommunities = communities.filter(c => c.members?.includes(currentUser.id));
  const createdCommunities = communities.filter(c => c.organizerId === currentUser.id);

  if (isLoadingCommunities) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24">
      <div className="bg-white border-b border-border/40 py-10 px-6 sm:px-12 mb-10 shadow-sm">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">My Communities</h1>
          <p className="text-muted-foreground text-lg">Manage the communities you organize and follow.</p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 sm:px-12 space-y-16">
        
        {/* Joined Communities */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-border/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Communities I'm In ({joinedCommunities.length})</h2>
            </div>
            <span className="text-sm font-medium text-muted-foreground bg-muted px-4 py-1.5 rounded-full">Following</span>
          </div>
          
          {joinedCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedCommunities.map(community => (
                <div key={community.id} className="h-full">
                  <CommunityCard 
                    community={community}
                    isJoined={true}
                    onJoinToggle={async (id, isJoined) => {
                      if (isJoined) await leaveCommunity(id);
                      else await joinCommunity(id);
                    }}
                    onClick={(id) => navigate(`/events-communities?communityId=${id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-border/60 rounded-3xl shadow-sm">
              <Users className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">No communities yet</h3>
              <p className="text-muted-foreground mb-6">You haven't joined any communities.</p>
            </div>
          )}
        </section>

        {/* Created Communities */}
        <section>
          <div className="flex items-center justify-between mb-8 border-b border-border/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-semibold">Communities I Organize ({createdCommunities.length})</h2>
            </div>
            <span className="text-sm font-medium text-amber-700 bg-amber-50 px-4 py-1.5 rounded-full">Admin</span>
          </div>
          
          {createdCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdCommunities.map(community => (
                <div key={community.id} className="h-full">
                  <CommunityCard 
                    community={community}
                    isJoined={true}
                    onClick={(id) => navigate(`/events-communities?communityId=${id}`)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-border/60 rounded-3xl shadow-sm">
              <Calendar className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-medium text-foreground mb-2">No created communities</h3>
              <p className="text-muted-foreground">You haven't organized any communities yet.</p>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

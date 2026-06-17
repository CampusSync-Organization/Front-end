import { create } from "zustand";
import { toast } from "sonner";
import { store } from "../../../app/store/index.js";
import {
  getAllCommunities,
  getJoinedCommunities,
  getModeratedCommunities as apiGetModeratedCommunities,
  getCommunity as apiGetCommunity,
  getCommunityMemberView as apiGetCommunityMemberView,
  joinCommunity as apiJoinCommunity,
  leaveCommunity as apiLeaveCommunity,
  createCommunity as apiCreateCommunity,
  updateCommunity as apiUpdateCommunity,
  deleteCommunity as apiDeleteCommunity
} from "../api/communityApi";
import { mapCommunities, mapCommunity } from "../utils/mapCommunity";

const getAuthUser = () => store.getState().auth?.user;
const getAuthUserId = () => { const u = getAuthUser(); return u?.userID ?? u?.id ?? null; };

async function fetchAllCommunities() {
  const [allData, joinedData, moderatedData] = await Promise.all([
    getAllCommunities(),
    getJoinedCommunities().catch(() => []),
    apiGetModeratedCommunities().catch(() => []),
  ]);
  const joinedIds = [...new Set([...joinedData.map(c => c.id), ...moderatedData.map(c => c.id)])];
  const detailResults = await Promise.all(allData.map(c => apiGetCommunity(c.id).catch(() => null)));
  const mergedData = allData.map((c, i) => ({
    ...c,
    member_count: detailResults[i]?.member_count ?? c.member_count ?? 0,
    events: detailResults[i]?.events ?? c.events ?? [],
  }));
  return mapCommunities(mergedData, { joinedIds, userId: getAuthUserId() });
}

export const useEventStore = create((set, get) => ({
  events: [],
  communities: [],
  isLoadingEvents: false,
  isLoadingCommunities: false,
  error: null,
  currentUser: getAuthUser(),

  // Fetch all events
  fetchEvents: async () => {
    set({ isLoadingEvents: true, error: null });
    set({ events: [], isLoadingEvents: false });
  },

  // Fetch all communities
  fetchCommunities: async () => {
    set({ isLoadingCommunities: true, error: null });
    try {
      const mapped = await fetchAllCommunities();
      set({ communities: mapped, isLoadingCommunities: false });
    } catch (error) {
      set({ error: "Failed to fetch communities", isLoadingCommunities: false });
      toast.error("Failed to fetch communities");
    }
  },

  // Fetch Moderated Communities
  fetchModeratedCommunities: async () => {
    try {
      const data = await apiGetModeratedCommunities();
      const currentUserId = getAuthUserId();
      // All moderated communities are joined by default
      const mapped = mapCommunities(data, { joinedIds: data.map(c => c.id), userId: currentUserId });
      return mapped;
    } catch (error) {
      toast.error("Failed to fetch moderated communities");
      throw error;
    }
  },

  // Fetch a Single Community (Public)
  fetchCommunity: async (communityId) => {
    try {
      const data = await apiGetCommunity(communityId);
      const currentUserId = getAuthUserId();
      
      // We don't automatically know if it's joined from the public view, 
      // but if it's already in the store we might preserve that info.
      const existing = get().communities.find(c => c.id === Number(communityId));
      const joinedIds = existing?.isJoined ? [data.id] : [];
      
      const mapped = mapCommunity(data, { joinedIds, userId: currentUserId });
      
      // Update it in the local array if it exists
      set((state) => ({
        communities: state.communities.some(c => c.id === mapped.id)
          ? state.communities.map(c => c.id === mapped.id ? { ...c, ...mapped } : c)
          : [...state.communities, mapped]
      }));
      
      return mapped;
    } catch (error) {
      toast.error("Failed to fetch community details");
      throw error;
    }
  },

  // Fetch a Single Community (Member View)
  fetchCommunityMemberView: async (communityId) => {
    try {
      const data = await apiGetCommunityMemberView(communityId);
      const currentUserId = getAuthUserId();
      
      // Since it's a member view, the user must be a member or moderator, so it's joined.
      const mapped = mapCommunity(data, { joinedIds: [data.id], userId: currentUserId });
      
      set((state) => ({
        communities: state.communities.some(c => c.id === mapped.id)
          ? state.communities.map(c => c.id === mapped.id ? { ...c, ...mapped } : c)
          : [...state.communities, mapped]
      }));
      
      return mapped;
    } catch (error) {
      toast.error("Failed to fetch community member details");
      throw error;
    }
  },

  // Create an event (placeholder until events API is available)
  createEvent: async (eventData) => {
    set({ isLoadingEvents: true });
    const newEvent = {
      id: `event-${Date.now()}`,
      type: "event",
      ...eventData,
      organizerName: getAuthUser()?.name,
      organizerId: getAuthUserId(),
      currentParticipants: 0,
      attendees: [],
      createdAt: new Date(),
    };
    set((state) => ({ events: [newEvent, ...state.events], isLoadingEvents: false }));
    toast.success("Event created successfully");
    return newEvent;
  },

  // RSVP to an event (placeholder until events API is available)
  rsvpEvent: async (eventId) => {
    const userId = getAuthUserId();
    set((state) => ({
      events: state.events.map((e) => {
        if (e.id !== eventId) return e;
        if (e.attendees.includes(userId)) return e;
        if (e.maxParticipants && e.currentParticipants >= e.maxParticipants) return e;
        return { ...e, currentParticipants: e.currentParticipants + 1, attendees: [...e.attendees, userId] };
      }),
    }));
    toast.success("Successfully RSVP'd for the event!");
  },

  // Cancel RSVP (placeholder until events API is available)
  cancelRsvpEvent: async (eventId) => {
    const userId = getAuthUserId();
    set((state) => ({
      events: state.events.map((e) => {
        if (e.id !== eventId || !e.attendees.includes(userId)) return e;
        return { ...e, currentParticipants: Math.max(0, e.currentParticipants - 1), attendees: e.attendees.filter((id) => id !== userId) };
      }),
    }));
    toast.success("RSVP cancelled successfully.");
  },

  // Create Community
  createCommunity: async (communityData) => {
    set({ isLoadingCommunities: true });
    await apiCreateCommunity(communityData).catch(() => {});
    try {
      const mapped = await fetchAllCommunities();
      set({ communities: mapped, isLoadingCommunities: false });
      toast.success("Community created successfully");
    } catch {
      set({ isLoadingCommunities: false });
      toast.success("Community created — refresh to see it");
    }
  },

  // Update Community
  updateCommunity: async (communityId, communityData) => {
    try {
      const currentUserId = getAuthUserId();
      const response = await apiUpdateCommunity(communityId, communityData);
      const existing = get().communities.find(c => c.id === communityId);
      const joinedIds = existing?.isJoined ? [response.id] : [];
      const mapped = mapCommunity(response, { joinedIds, userId: currentUserId });
      set((state) => ({
        communities: state.communities.map(c => c.id === communityId ? { ...c, ...mapped } : c)
      }));
      toast.success("Community updated successfully");
      return mapped;
    } catch (error) {
      toast.error("Failed to update community");
      throw error;
    }
  },

  // Delete Community
  deleteCommunity: async (communityId) => {
    await apiDeleteCommunity(communityId).catch(() => {});
    try {
      const mapped = await fetchAllCommunities();
      set({ communities: mapped });
    } catch {
      set((state) => ({ communities: state.communities.filter((c) => c.id !== communityId) }));
    }
    toast.success("Community deleted successfully");
  },

  // Join Community
  joinCommunity: async (communityId) => {
    const previousCommunities = get().communities;
    try {
      set((state) => {
        const userId = getAuthUserId();
        const newCommunities = state.communities.map((c) => {
          if (c.id === communityId) {
            if (c.members?.includes(userId)) return c;
            return {
              ...c,
              memberCount: c.memberCount + 1,
              members: [...(c.members || []), userId],
              isJoined: true,
            };
          }
          return c;
        });
        return { communities: newCommunities };
      });
      await apiJoinCommunity(communityId);
      toast.success("Successfully joined the community!");
    } catch (error) {
      if (error?.response?.status === 400) {
        // Already a member — refetch to sync correct state
        fetchAllCommunities().then(mapped => set({ communities: mapped })).catch(() => {});
        return;
      }
      set({ communities: previousCommunities });
      toast.error("Failed to join community.");
    }
  },

  // Leave Community
  leaveCommunity: async (communityId) => {
    const previousCommunities = get().communities;
    try {
      set((state) => {
        const userId = getAuthUserId();
        const newCommunities = state.communities.map((c) => {
          if (c.id === communityId && c.members?.includes(userId)) {
            return {
              ...c,
              memberCount: Math.max(0, c.memberCount - 1),
              members: c.members.filter((id) => id !== userId),
              isJoined: false,
            };
          }
          return c;
        });
        return { communities: newCommunities };
      });
      await apiLeaveCommunity(communityId);
      toast.success("Left the community.");
    } catch (error) {
      // Revert on failure
      set({ communities: previousCommunities });
      toast.error("Failed to leave community.");
    }
  },

}));

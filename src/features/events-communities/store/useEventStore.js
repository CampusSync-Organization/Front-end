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
import {
  getAllEvents as apiGetAllEvents,
  getEventById as apiGetEventById,
  getMyOrganizedEvents as apiGetMyOrganizedEvents,
  reserveEvent as apiReserveEvent,
  cancelReservation as apiCancelReservation,
  checkAttendance as apiCheckAttendance,
  createEvent as apiCreateEvent,
  createCommunityEvent as apiCreateCommunityEvent,
  deleteEvent as apiDeleteEvent,
  updateEvent as apiUpdateEvent,
} from "../api/eventApi";
import { mapEvent, mapEvents } from "../utils/mapEvent";

const getAuthUser = () => store.getState().auth?.user;
const getAuthUserId = () => { const u = getAuthUser(); return u?.userID ?? u?.id ?? null; };

function syncCommunityRooms(communities) {
  import("../../chat/store/useChatStore").then(({ default: useChatStore }) => {
    const { addRoom } = useChatStore.getState();
    communities.forEach((c) => {
      if (c.roomId) {
        addRoom({ id: c.roomId, type: "community", name: c.name, lastMessage: "" });
      }
    });
  });
}

async function fetchAndSyncMyCommunityChats() {
  try {
    const api = (await import("../../../services/api")).default;

    // Fetch member chats + moderated communities in parallel
    const [chatsRes, moderatedRes] = await Promise.allSettled([
      api.get("/communities/me/chats"),
      api.get("/communities/me/moderated"),
    ]);

    const { addRoom } = (await import("../../chat/store/useChatStore")).default.getState();

    // Member community chats
    const chats = chatsRes.value?.data?.community_chats ?? [];
    chats.forEach((item) => {
      const room = item.chat_room;
      if (room?.id) {
        addRoom({ id: room.id, type: "community", name: item.community_name, lastMessage: "" });
      }
    });

    // Moderated communities — fetch their chat room via member/chats endpoint or by community id
    const moderated = moderatedRes.value?.data ?? [];
    await Promise.all(
      moderated.map(async (c) => {
        try {
          const { data } = await api.get(`/communities/${c.id}/member`);
          if (data?.room_id) {
            addRoom({ id: data.room_id, type: "community", name: c.name, lastMessage: "" });
          }
        } catch {
          // not a member view — skip
        }
      })
    );
  } catch {
    // silently fail
  }
}

async function fetchAllCommunities() {
  const [allData, joinedData, moderatedData] = await Promise.all([
    getAllCommunities(),
    getJoinedCommunities().catch(() => []),
    apiGetModeratedCommunities().catch(() => []),
  ]);
  const joinedIds = [...new Set([...joinedData.map(c => c.id), ...moderatedData.map(c => c.id)])];

  // Fetch public detail for member_count + events, and member view for joined ones to get room_id
  const detailResults = await Promise.all(allData.map(c => apiGetCommunity(c.id).catch(() => null)));
  const memberViewResults = await Promise.all(
    allData.map(c =>
      joinedIds.includes(c.id)
        ? apiGetCommunityMemberView(c.id).catch(() => null)
        : Promise.resolve(null)
    )
  );

  const mergedData = allData.map((c, i) => ({
    ...c,
    member_count: detailResults[i]?.member_count ?? c.member_count ?? 0,
    events: detailResults[i]?.events ?? c.events ?? [],
    // room_id may come from member view or public view
    room_id: memberViewResults[i]?.room_id ?? detailResults[i]?.room_id ?? c.room_id ?? null,
  }));

  const mapped = mapCommunities(mergedData, { joinedIds, userId: getAuthUserId() });
  syncCommunityRooms(mapped.filter(c => c.isJoined));
  return mapped;
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
    try {
      const [allData, organizedData] = await Promise.all([
        apiGetAllEvents(),
        apiGetMyOrganizedEvents().catch(() => []),
      ]);
      const organizedIds = new Set(organizedData.map((e) => e.id));
      // Check attendance for each event in parallel (best-effort)
      const attendanceResults = await Promise.allSettled(
        allData.map((e) => apiCheckAttendance(e.id))
      );
      const mapped = allData.map((e, i) => {
        const isAttending = attendanceResults[i]?.value?.is_attending ?? false;
        return mapEvent(e, { isAttending });
      });
      set({ events: mapped, isLoadingEvents: false });
    } catch {
      set({ isLoadingEvents: false });
      toast.error("Failed to load events.");
    }
  },

  // Fetch all communities
  fetchCommunities: async () => {
    set({ isLoadingCommunities: true, error: null });
    try {
      const [mapped] = await Promise.all([
        fetchAllCommunities(),
        fetchAndSyncMyCommunityChats(),
      ]);
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

  // Create an event
  createEvent: async (eventData) => {
    try {
      const raw = eventData.communityId
        ? await apiCreateCommunityEvent(eventData.communityId, eventData)
        : await apiCreateEvent(eventData);
      const mapped = mapEvent(raw, { isAttending: false });
      set((state) => ({ events: [mapped, ...state.events] }));
      toast.success("Event created successfully");
      return mapped;
    } catch {
      toast.error("Failed to create event.");
    }
  },

  // RSVP to an event
  rsvpEvent: async (eventId) => {
    const userId = getAuthUserId();
    // Optimistic update
    set((state) => ({
      events: state.events.map((e) => {
        if (e.id !== eventId) return e;
        return { ...e, isAttending: true, currentParticipants: e.currentParticipants + 1, attendees: [...e.attendees, userId] };
      }),
    }));
    try {
      await apiReserveEvent(eventId);
      toast.success("Successfully RSVP'd for the event!");
    } catch (err) {
      // Revert
      set((state) => ({
        events: state.events.map((e) => {
          if (e.id !== eventId) return e;
          return { ...e, isAttending: false, currentParticipants: Math.max(0, e.currentParticipants - 1), attendees: e.attendees.filter((id) => id !== userId) };
        }),
      }));
      const msg = err?.response?.data?.detail ?? "Failed to RSVP.";
      toast.error(msg);
    }
  },

  // Cancel RSVP
  cancelRsvpEvent: async (eventId) => {
    const userId = getAuthUserId();
    // Optimistic update
    set((state) => ({
      events: state.events.map((e) => {
        if (e.id !== eventId) return e;
        return { ...e, isAttending: false, currentParticipants: Math.max(0, e.currentParticipants - 1), attendees: e.attendees.filter((id) => id !== userId) };
      }),
    }));
    try {
      await apiCancelReservation(eventId);
      toast.success("RSVP cancelled successfully.");
    } catch {
      // Revert
      set((state) => ({
        events: state.events.map((e) => {
          if (e.id !== eventId) return e;
          return { ...e, isAttending: true, currentParticipants: e.currentParticipants + 1, attendees: [...e.attendees, userId] };
        }),
      }));
      toast.error("Failed to cancel RSVP.");
    }
  },

  // Create Community
  createCommunity: async (communityData) => {
    set({ isLoadingCommunities: true });
    await apiCreateCommunity(communityData).catch(() => {});
    try {
      const mapped = await fetchAllCommunities();
      set({ communities: mapped, isLoadingCommunities: false });
      await fetchAndSyncMyCommunityChats();
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
      const result = await apiJoinCommunity(communityId);
      // Backend returns { chat_room: { id, name } }
      const roomId = result?.chat_room?.id ?? result?.room_id ?? null;
      if (roomId) {
        const community = get().communities.find(c => c.id === communityId);
        import("../../chat/store/useChatStore").then(({ default: useChatStore }) => {
          useChatStore.getState().addRoom({
            id: roomId,
            type: "community",
            name: result?.chat_room?.name ?? community?.name ?? `Community ${communityId}`,
            lastMessage: "",
          });
        });
      }
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
      // Remove community room from chat sidebar
      const community = get().communities.find(c => c.id === communityId);
      if (community?.roomId) {
        import("../../chat/store/useChatStore").then(({ default: useChatStore }) => {
          useChatStore.setState((state) => ({
            rooms: state.rooms.filter(r => r.id !== community.roomId),
          }));
        });
      }
      toast.success("Left the community.");
    } catch (error) {
      // Revert on failure
      set({ communities: previousCommunities });
      toast.error("Failed to leave community.");
    }
  },

}));

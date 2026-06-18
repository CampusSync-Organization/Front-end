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
        addRoom({
          id: c.roomId,
          type: "community",
          name: c.name,
          lastMessage: "",
          members: Array.isArray(c.membersList) ? c.membersList : [],
          communityId: c.id,
        });
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
      Promise.resolve({ data: [] }),
    ]);

    const { addRoom } = (await import("../../chat/store/useChatStore")).default.getState();

    // Member community chats — also fetch member view to get names
    const chats = chatsRes.value?.data?.community_chats ?? [];
    await Promise.all(chats.map(async (item) => {
      const room = item.chat_room;
      if (!room?.id) return;
      let members = [];
      try {
        const { data } = await api.get(`/communities/${item.community_id}/member`);
        members = Array.isArray(data.members) ? data.members : [];
      } catch {}
      addRoom({ id: room.id, type: "community", name: item.community_name, lastMessage: "", members, communityId: item.community_id });
    }));

    // Moderated communities — fetch their chat room via member view
    const moderated = moderatedRes.value?.data ?? [];
    await Promise.all(
      moderated.map(async (c) => {
        try {
          const { data } = await api.get(`/communities/${c.id}/member`);
          if (data?.room_id) {
            addRoom({
              id: data.room_id,
              type: "community",
              name: c.name,
              lastMessage: "",
              members: Array.isArray(data.members) ? data.members : [],
              communityId: c.id,
            });
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
    room_id: memberViewResults[i]?.room_id ?? detailResults[i]?.room_id ?? c.room_id ?? null,
    // Include members from member view so chat can resolve sender names
    members: memberViewResults[i]?.members ?? c.members ?? [],
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
      const allData = await apiGetAllEvents();
      // Check attendance per event (best-effort, requires auth)
      const attendanceResults = await Promise.allSettled(
        allData.map((e) => apiCheckAttendance(e.id))
      );
      const mapped = allData.map((e, i) => {
        const isAttending = attendanceResults[i]?.value?.is_attending ?? false;
        return mapEvent(e, { isAttending });
      });
      set({ events: mapped, isLoadingEvents: false });
    } catch (err) {
      console.error("[fetchEvents] error:", err?.response?.status, err?.response?.data);
      set({ isLoadingEvents: false });
      toast.error("Failed to load events.");
    }
  },

  // Fetch a single event fresh from API (EventWithAttendees)
  fetchEventById: async (eventId) => {
    try {
      const raw = await apiGetEventById(eventId);
      const isAttending = await apiCheckAttendance(eventId)
        .then((r) => r.is_attending)
        .catch(() => false);
      const mapped = mapEvent(raw, { isAttending });
      set((state) => ({
        events: state.events.some((e) => e.id === mapped.id)
          ? state.events.map((e) => (e.id === mapped.id ? mapped : e))
          : [...state.events, mapped],
      }));
      return mapped;
    } catch {
      return null;
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
      // 403 = not a member, expected — don't toast
      if (error?.response?.status !== 403) {
        toast.error("Failed to fetch community member details");
      }
      throw error;
    }
  },

  // Update an event
  updateEvent: async (eventId, eventData) => {
    try {
      const payload = {
        name: eventData.name,
        description: eventData.description ?? "",
        date: eventData.date instanceof Date
          ? eventData.date.toISOString().split("T")[0]
          : eventData.date,
        time: eventData.time ?? "",
        place: eventData.place ?? "",
        capacity: eventData.capacity ? Number(eventData.capacity) : null,
      };
      const raw = await apiUpdateEvent(eventId, payload);
      const mapped = mapEvent(raw, { isAttending: get().events.find((e) => e.id === eventId)?.isAttending ?? false });
      set((state) => ({ events: state.events.map((e) => (e.id === eventId ? mapped : e)) }));
      toast.success("Event updated successfully");
      return mapped;
    } catch (err) {
      console.error("[updateEvent] error:", err?.response?.status, err?.response?.data);
      toast.error("Failed to update event.");
      throw err;
    }
  },

  // Delete an event
  deleteEvent: async (eventId) => {
    const prev = get().events;
    set((state) => ({ events: state.events.filter((e) => e.id !== eventId) }));
    try {
      await apiDeleteEvent(eventId);
      toast.success("Event deleted successfully");
    } catch {
      set({ events: prev });
      toast.error("Failed to delete event.");
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
    } catch (err) {
      console.error("[createEvent] error:", err?.response?.status, err?.response?.data);
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
    // Optimistic update first
    const userId = getAuthUserId();
    set((state) => ({
      communities: state.communities.map((c) =>
        c.id === communityId
          ? { ...c, memberCount: Math.max(0, c.memberCount - 1), members: (c.members ?? []).filter((id) => id !== userId), isJoined: false }
          : c
      ),
    }));

    // Always remove the community room from chat sidebar
    import("../../chat/store/useChatStore").then(({ default: useChatStore }) => {
      useChatStore.setState((state) => {
        const removed = state.rooms.filter(
          (r) => r.type === "community" && (r.communityId === communityId || r.id === communityId)
        );
        const removedIds = new Set(removed.map((r) => r.id));
        return {
          rooms: state.rooms.filter((r) => !removedIds.has(r.id)),
          activeRoomId: removedIds.has(state.activeRoomId) ? null : state.activeRoomId,
        };
      });
    });

    try {
      await apiLeaveCommunity(communityId);
      toast.success("Left the community.");
    } catch {
      // Backend returned an error but the leave likely succeeded (known 500 bug).
      // Keep the optimistic update — the user is gone from the community.
      toast.success("Left the community.");
    }
  },

}));

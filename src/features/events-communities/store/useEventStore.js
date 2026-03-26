import { create } from "zustand";
import { mockEvents, mockCommunities, mockCurrentUser } from "../data/mockData";
import { toast } from "sonner";

// Simulate network delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const useEventStore = create((set, get) => ({
  events: [],
  communities: [],
  isLoadingEvents: false,
  isLoadingCommunities: false,
  error: null,
  currentUser: mockCurrentUser,

  // Fetch all events
  fetchEvents: async () => {
    set({ isLoadingEvents: true, error: null });
    try {
      await delay(600); // simulated loading time
      set({ events: mockEvents, isLoadingEvents: false });
    } catch (error) {
      set({ error: "Failed to fetch events", isLoadingEvents: false });
      toast.error("Failed to fetch events");
    }
  },

  // Fetch all communities
  fetchCommunities: async () => {
    set({ isLoadingCommunities: true, error: null });
    try {
      await delay(500); 
      set({ communities: mockCommunities, isLoadingCommunities: false });
    } catch (error) {
      set({ error: "Failed to fetch communities", isLoadingCommunities: false });
      toast.error("Failed to fetch communities");
    }
  },

  // Create an event
  createEvent: async (eventData) => {
    set({ isLoadingEvents: true });
    try {
      await delay(500);
      const newEvent = {
        id: `event-${Date.now()}`,
        type: "event",
        ...eventData,
        organizerName: get().currentUser.name,
        organizerId: get().currentUser.id,
        currentParticipants: 0,
        attendees: [],
        createdAt: new Date(),
      };
      set((state) => ({ events: [newEvent, ...state.events], isLoadingEvents: false }));
      toast.success("Event created successfully");
      return newEvent;
    } catch (error) {
      set({ error: "Failed to create event", isLoadingEvents: false });
      toast.error("Could not create event");
    }
  },

  // RSVP to an event
  rsvpEvent: async (eventId) => {
    try {
      // Optimistic update locally
      set((state) => {
        const userId = state.currentUser.id;
        const newEvents = state.events.map((e) => {
          if (e.id === eventId) {
            // Prevent duplicate RSVP or over max participants
            if (e.attendees.includes(userId)) return e;
            if (e.maxParticipants && e.currentParticipants >= e.maxParticipants) return e;
            return {
              ...e,
              currentParticipants: e.currentParticipants + 1,
              attendees: [...e.attendees, userId],
            };
          }
          return e;
        });
        return { events: newEvents };
      });
      // Simulate API call
      await delay(300);
      toast.success("Successfully RSVP'd for the event!");
    } catch (error) {
      toast.error("Failed to RSVP. Please try again.");
    }
  },

  // Cancel RSVP
  cancelRsvpEvent: async (eventId) => {
    try {
      // Optimistic update
      set((state) => {
        const userId = state.currentUser.id;
        const newEvents = state.events.map((e) => {
          if (e.id === eventId && e.attendees.includes(userId)) {
            return {
              ...e,
              currentParticipants: Math.max(0, e.currentParticipants - 1),
              attendees: e.attendees.filter((id) => id !== userId),
            };
          }
          return e;
        });
        return { events: newEvents };
      });
      await delay(300);
      toast.success("RSVP cancelled successfully.");
    } catch (error) {
      toast.error("Failed to cancel RSVP.");
    }
  },

  // Join Community
  joinCommunity: async (communityId) => {
    try {
      set((state) => {
        const userId = state.currentUser.id;
        const newCommunities = state.communities.map((c) => {
          if (c.id === communityId) {
            if (c.members?.includes(userId)) return c;
            return {
              ...c,
              memberCount: c.memberCount + 1,
              members: [...(c.members || []), userId],
            };
          }
          return c;
        });
        return { communities: newCommunities };
      });
      await delay(300);
      toast.success("Successfully joined the community!");
    } catch (error) {
      toast.error("Failed to join community.");
    }
  },

  // Leave Community
  leaveCommunity: async (communityId) => {
    try {
      set((state) => {
        const userId = state.currentUser.id;
        const newCommunities = state.communities.map((c) => {
          if (c.id === communityId && c.members?.includes(userId)) {
            return {
              ...c,
              memberCount: Math.max(0, c.memberCount - 1),
              members: c.members.filter((id) => id !== userId),
            };
          }
          return c;
        });
        return { communities: newCommunities };
      });
      await delay(300);
      toast.success("Left the community.");
    } catch (error) {
      toast.error("Failed to leave community.");
    }
  },

}));

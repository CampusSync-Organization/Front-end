import { create } from "zustand";
import { toast } from "sonner";
import { chatSocket } from "../services/chatSocket";
import { getOrCreateDirectChat, getRoomMessages, postMessage } from "../api/chatApi";
import {
  createTeam as apiCreateTeam,
  requestJoinTeam as apiRequestJoinTeam,
  approveJoinRequest as apiApproveJoinRequest,
  getTeam as apiGetTeam,
  leaveTeam as apiLeaveTeam,
} from "../api/teamApi";
import { store } from "../../../app/store/index.js";

const useChatStore = create((set, get) => ({
  rooms: [],
  messages: {},
  activeRoomId: null,
  isConnected: false,
  teams: [],

  connectSocket() {
    const token = store.getState().auth?.token;
    if (!token) return;

    chatSocket.connect(token);
    set({ isConnected: true });

    chatSocket.onMessage((msg) => {
      get().receiveMessage(msg);
    });
  },

  disconnectSocket() {
    chatSocket.disconnect();
    set({ isConnected: false });
  },

  setActiveRoom(roomId) {
    set({ activeRoomId: roomId });
  },

  async fetchMessages(roomId) {
    if (!roomId) return;
    try {
      const msgs = await getRoomMessages(roomId);
      set((state) => ({
        messages: {
          ...state.messages,
          [roomId]: msgs,
        },
      }));
    } catch (err) {
      toast.error("Failed to load messages.");
    }
  },

  async sendMessage(roomId, content) {
    if (!roomId || !content) return;
    const currentUserId = store.getState().auth?.user?.userID ?? store.getState().auth?.user?.id;
    const optimistic = {
      id: `tmp-${Date.now()}`,
      room_id: roomId,
      sender_id: currentUserId,
      content,
      created_at: new Date().toISOString(),
    };
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...(state.messages[roomId] ?? []), optimistic],
      },
    }));

    try {
      chatSocket.send(roomId, content);
    } catch {
      set((state) => ({
        messages: {
          ...state.messages,
          [roomId]: (state.messages[roomId] ?? []).filter((m) => m.id !== optimistic.id),
        },
      }));
      try {
        const msg = await postMessage(roomId, content);
        set((state) => ({
          messages: {
            ...state.messages,
            [roomId]: [...(state.messages[roomId] ?? []), msg],
          },
        }));
      } catch {
        toast.error("Failed to send message.");
      }
    }
  },

  async openDirectChat(userId) {
    try {
      const room = await getOrCreateDirectChat(userId);
      const roomEntry = {
        id: room.id,
        type: "direct",
        name: `User ${userId}`,
        lastMessage: "",
        members: room.members ?? [],
      };
      get().addRoom(roomEntry);
      set({ activeRoomId: room.id });
      await get().fetchMessages(room.id);
    } catch (err) {
      toast.error("Failed to open direct chat.");
      throw err;
    }
  },

  receiveMessage(msg) {
    set((state) => {
      const existing = state.messages[msg.room_id] ?? [];
      if (existing.some((m) => m.id === msg.id)) return {};
      const currentUserId = store.getState().auth?.user?.userID ?? store.getState().auth?.user?.id;
      const filtered =
        msg.sender_id === currentUserId
          ? existing.filter(
              (m) => !(String(m.id).startsWith("tmp-") && m.content === msg.content)
            )
          : existing;
      return {
        messages: {
          ...state.messages,
          [msg.room_id]: [...filtered, msg],
        },
        rooms: state.rooms.map((r) =>
          r.id === msg.room_id ? { ...r, lastMessage: msg.content } : r
        ),
      };
    });
  },

  addRoom(room) {
    set((state) => {
      const exists = state.rooms.some((r) => r.id === room.id);
      if (exists) {
        return {
          rooms: state.rooms.map((r) => (r.id === room.id ? { ...r, ...room } : r)),
        };
      }
      return { rooms: [...state.rooms, room] };
    });
  },

  async createTeam(name, description) {
    try {
      const team = await apiCreateTeam(name, description);
      const roomEntry = {
        id: team.id,
        type: "team",
        name: team.name,
        lastMessage: "",
        members: [],
      };
      get().addRoom(roomEntry);
      set({ activeRoomId: team.id });
      // Also add to teams list
      set((state) => ({
        teams: [
          ...state.teams.filter((t) => t.id !== team.id),
          team,
        ],
      }));
    } catch (err) {
      toast.error("Failed to create team.");
    }
  },

  async fetchTeams() {
    // GET /teams not implemented by backend — no-op, keep in-session teams
  },

  async fetchTeam(teamId) {
    try {
      const team = await apiGetTeam(teamId);
      set((state) => ({
        teams: state.teams.some((t) => t.id === team.id)
          ? state.teams.map((t) => (t.id === team.id ? team : t))
          : [...state.teams, team],
      }));
      return team;
    } catch (err) {
      toast.error("Failed to load team details.");
      throw err;
    }
  },

  async requestJoinTeam(teamId) {
    try {
      await apiRequestJoinTeam(teamId);
      set((state) => ({
        teams: state.teams.map((t) =>
          t.id === teamId ? { ...t, join_request_status: "pending" } : t
        ),
      }));
      toast.success("Join request sent!");
    } catch (err) {
      toast.error("Failed to send join request.");
      throw err;
    }
  },

  async approveJoinRequest(teamId, requestId) {
    try {
      const result = await apiApproveJoinRequest(teamId, requestId);
      toast.success("Join request approved!");
      return result;
    } catch (err) {
      toast.error("Failed to approve join request.");
      throw err;
    }
  },

  async leaveTeam(teamId) {
    try {
      await apiLeaveTeam(teamId);
      set((state) => ({
        rooms: state.rooms.filter((r) => !(r.id === teamId && r.type === "team")),
        teams: state.teams.filter((t) => t.id !== teamId),
      }));
      toast.success("You have left the team.");
    } catch (err) {
      toast.error("Failed to leave team.");
      throw err;
    }
  },
}));

export default useChatStore;

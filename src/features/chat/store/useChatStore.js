import { create } from "zustand";
import { toast } from "sonner";
import { chatSocket } from "../services/chatSocket";
import {
  getUserChats,
  getOrCreateDirectChat,
  getRoomMessages,
  postMessage,
} from "../api/chatApi";
import {
  createTeam as apiCreateTeam,
  requestJoinTeam as apiRequestJoinTeam,
  approveJoinRequest as apiApproveJoinRequest,
  getTeam as apiGetTeam,
  leaveTeam as apiLeaveTeam,
} from "../api/teamApi";
import { store } from "../../../app/store/index.js";

function getCurrentUserId() {
  const user = store.getState().auth?.user;
  return user?.userID ?? user?.id ?? null;
}

/** Resolve a display name for a direct-chat room from its members array. */
function resolveDmName(members, currentUserId, fallback) {
  if (!Array.isArray(members) || !currentUserId) return fallback;
  const other = members.find(
    (m) => Number(m.id ?? m.user_id) !== Number(currentUserId)
  );
  if (!other) return fallback;
  const name =
    other.name ??
    other.full_name ??
    (other.first_name
      ? `${other.first_name} ${other.last_name ?? ""}`.trim()
      : null);
  return name || fallback;
}

const useChatStore = create((set, get) => ({
  rooms: [],
  messages: {},
  activeRoomId: null,
  isConnected: false,
  isLoadingRooms: false,
  teams: [],

  // ── Socket ───────────────────────────────────────────────────────────────────

  connectSocket() {
    const token = store.getState().auth?.token;
    if (!token) return;
    chatSocket.connect(token);
    set({ isConnected: true });
    chatSocket.onMessage((msg) => get().receiveMessage(msg));
  },

  disconnectSocket() {
    chatSocket.disconnect();
    set({ isConnected: false });
  },

  // ── Rooms ────────────────────────────────────────────────────────────────────

  /** Load all of the current user's existing direct chat rooms from the API. */
  async fetchRooms() {
    set({ isLoadingRooms: true });
    try {
      const data = await getUserChats();
      const rooms = Array.isArray(data) ? data : data?.chats ?? data?.rooms ?? [];
      const currentUserId = getCurrentUserId();

      rooms.forEach((room) => {
        const type = room.type ?? (room.is_direct ? "direct" : "direct");
        const name =
          type === "direct"
            ? resolveDmName(room.members, currentUserId, `User ${room.id}`)
            : room.name ?? `Room ${room.id}`;

        const members = room.members ?? [];
        const peerId = members.find(
          (m) => Number(m.id ?? m.user_id) !== Number(currentUserId)
        )?.id ?? null;

        get().addRoom({
          id: room.id,
          type,
          name,
          lastMessage: room.last_message?.content ?? room.lastMessage ?? "",
          members,
          peerId: peerId ? Number(peerId) : null,
        });
      });
    } catch {
      // Endpoint may not exist or user has no chats — silently ignore
    } finally {
      set({ isLoadingRooms: false });
    }
  },

  setActiveRoom(roomId) {
    set({ activeRoomId: roomId });
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

  // ── Messages ─────────────────────────────────────────────────────────────────

  async fetchMessages(roomId) {
    if (!roomId) return;
    try {
      const msgs = await getRoomMessages(roomId);
      set((state) => ({
        messages: { ...state.messages, [roomId]: msgs },
      }));
    } catch {
      toast.error("Failed to load messages.");
    }
  },

  async sendMessage(roomId, content) {
    if (!roomId || !content) return;
    const currentUserId = getCurrentUserId();
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
          [roomId]: (state.messages[roomId] ?? []).filter(
            (m) => m.id !== optimistic.id
          ),
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

  receiveMessage(msg) {
    set((state) => {
      const existing = state.messages[msg.room_id] ?? [];
      if (existing.some((m) => m.id === msg.id)) return {};
      const currentUserId = getCurrentUserId();
      const filtered =
        msg.sender_id === currentUserId
          ? existing.filter(
              (m) =>
                !(String(m.id).startsWith("tmp-") && m.content === msg.content)
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

  // ── Direct Chat ──────────────────────────────────────────────────────────────

  async openDirectChat(userId, name) {
    try {
      const room = await getOrCreateDirectChat(userId);
      const currentUserId = getCurrentUserId();

      // Best-effort name resolution: members array > passed name > fallback
      const roomName =
        resolveDmName(room.members, currentUserId, null) ??
        name ??
        `User ${userId}`;

      const roomEntry = {
        id: room.id,
        type: "direct",
        name: roomName,
        lastMessage: "",
        members: room.members ?? [],
        peerId: Number(userId),
      };
      get().addRoom(roomEntry);
      set({ activeRoomId: room.id });
      await get().fetchMessages(room.id);
    } catch (err) {
      toast.error("Failed to open direct chat.");
      throw err;
    }
  },

  // ── Teams ────────────────────────────────────────────────────────────────────

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
      set((state) => ({
        teams: [...state.teams.filter((t) => t.id !== team.id), team],
      }));
    } catch {
      toast.error("Failed to create team.");
    }
  },

  async fetchTeams() {
    // GET /teams not implemented by backend — no-op
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
    } catch {
      toast.error("Failed to load team details.");
      throw new Error("fetchTeam failed");
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
    } catch {
      toast.error("Failed to send join request.");
      throw new Error("requestJoinTeam failed");
    }
  },

  async approveJoinRequest(teamId, requestId) {
    try {
      const result = await apiApproveJoinRequest(teamId, requestId);
      toast.success("Join request approved!");
      return result;
    } catch {
      toast.error("Failed to approve join request.");
      throw new Error("approveJoinRequest failed");
    }
  },

  async leaveTeam(teamId) {
    try {
      await apiLeaveTeam(teamId);
      set((state) => ({
        rooms: state.rooms.filter(
          (r) => !(r.id === teamId && r.type === "team")
        ),
        teams: state.teams.filter((t) => t.id !== teamId),
      }));
      toast.success("You have left the team.");
    } catch {
      toast.error("Failed to leave team.");
    }
  },
}));

export default useChatStore;

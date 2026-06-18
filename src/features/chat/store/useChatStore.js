import { create } from "zustand";
import { persist } from "zustand/middleware";
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
  getIncomingJoinRequests as apiGetIncomingJoinRequests,
  getTeam as apiGetTeam,
  leaveTeam as apiLeaveTeam,
} from "../api/teamApi";
import { getProfileByUserId } from "../../profile/api/profileApi";
import { store } from "../../../app/store/index.js";

function getCurrentUserId() {
  const user = store.getState().auth?.user;
  return user?.userID ?? user?.id ?? null;
}

function getJoinRequestKey(teamId, userId = getCurrentUserId()) {
  return userId ? `${userId}:${teamId}` : String(teamId);
}

/** Resolve a display name for a direct-chat room from its members array. */
function resolveDmName(members, currentUserId, fallback) {
  if (!Array.isArray(members) || !currentUserId) return fallback;
  const other = members.find(
    (m) => Number(m.id ?? m.user_id) !== Number(currentUserId),
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

/** Look up a user's name from Redux connections/recommendations store by ID. */
function resolveNameFromStore(userId) {
  const state = store.getState();
  const connections = state.connections?.hydratedConnections ?? [];
  const recommendations = state.recommendations?.items ?? [];
  const all = [...connections, ...recommendations];
  const found = all.find((u) => Number(u.user_id ?? u.id) === Number(userId));
  return found?.name ?? found?.full_name ?? null;
}

/** Look up a peer by name or room name and return their avatar_url and user_id. */
function resolvePeerFromStore(name) {
  if (!name) return { avatarUrl: null, userId: null };
  const state = store.getState();
  const connections = state.connections?.hydratedConnections ?? [];
  const recommendations = state.recommendations?.items ?? [];
  const all = [...connections, ...recommendations];
  const found = all.find((u) => {
    const uName = u.name ?? u.full_name ?? `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim();
    return uName && uName === name;
  });
  return {
    avatarUrl: found?.avatar_url ?? null,
    userId: found?.user_id ?? found?.id ?? null,
  };
}

const useChatStore = create(
  persist(
    (set, get) => ({
  rooms: [],
  messages: {},
  activeRoomId: null,
  isConnected: false,
  isLoadingRooms: false,
  teams: [],
  pendingOptimistic: null,

  // ── Socket ───────────────────────────────────────────────────────────────────

  connectSocket() {
    const token = store.getState().auth?.token;
    if (!token) return;
    chatSocket.connect(token);
    set({ isConnected: true });
    chatSocket.onMessage((msg) => get().receiveMessage(msg));
    chatSocket.onModeration(() => {
      const pending = get().pendingOptimistic;
      if (!pending) return;
      set((state) => ({
        pendingOptimistic: null,
        messages: {
          ...state.messages,
          [pending.roomId]: (state.messages[pending.roomId] ?? []).filter(
            (m) => m.id !== pending.id
          ),
        },
      }));
    });
  },

  disconnectSocket() {
    chatSocket.disconnect();
    set({ isConnected: false });
  },

  // ── Rooms ────────────────────────────────────────────────────────────────────

  /** Load all of the current user's existing direct chat rooms from the API. */
  async fetchRooms() {
    if (get().isLoadingRooms) return;
    set({ isLoadingRooms: true });
    try {
      const data = await getUserChats();
      const rooms = Array.isArray(data) ? data : data?.chats ?? data?.rooms ?? [];
      const currentUserId = getCurrentUserId();

      const roomEntries = [];

      rooms.forEach((room) => {
        const type = room.type ?? (room.is_direct ? "direct" : "direct");
        const members = room.members ?? [];
        const peer = members.find(
          (m) => Number(m.id ?? m.user_id) !== Number(currentUserId)
        );
        const peerId = peer?.id ?? null;

        let name;
        let avatarUrl = peer?.avatar_url ?? null;
        let resolvedPeerId = peerId;
        if (type === "direct") {
          const resolved = peer?.name ?? peer?.full_name ?? (peerId ? resolveNameFromStore(peerId) : null) ?? room.name ?? null;
          name = resolved ?? null;
          // Try to get avatar + userId from connections/recommendations store by name
          if (!avatarUrl && name) {
            const fromStore = resolvePeerFromStore(name);
            avatarUrl = fromStore.avatarUrl;
            if (!resolvedPeerId && fromStore.userId) resolvedPeerId = fromStore.userId;
          }
        } else {
          name = room.name ?? `Room ${room.id}`;
        }
      },

        const roomEntry = {
          id: room.id,
          type,
          name: name ?? `User ${resolvedPeerId ?? room.id}`,
          lastMessage: room.last_message?.content ?? "",
          avatarUrl,
          members,
          peerId: resolvedPeerId ? Number(resolvedPeerId) : null,
        };
        get().addRoom(roomEntry);
        roomEntries.push({ roomEntry, name, peerId: resolvedPeerId, type });
      });

      // Batch-fetch last messages and resolve names in background
      roomEntries.forEach(({ roomEntry, peerId, type }) => {
        // Fetch real last message for each room (only update lastMessage field)
        getRoomMessages(roomEntry.id).then((msgs) => {
          if (msgs?.length) {
            const last = msgs[msgs.length - 1];
            get().addRoom({ id: roomEntry.id, lastMessage: last.content });
          }
        }).catch(() => {});

        // Fetch profile for direct chats to resolve name and avatar (only update changed fields)
        if (type === "direct" && peerId) {
          getProfileByUserId(peerId).then((profile) => {
            const resolvedName = profile?.name ?? profile?.full_name ?? null;
            const resolvedAvatar = profile?.avatar_url ?? null;
            if (resolvedName || resolvedAvatar) {
              get().addRoom({
                id: roomEntry.id,
                ...(resolvedName ? { name: resolvedName } : {}),
                ...(resolvedAvatar ? { avatarUrl: resolvedAvatar } : {}),
              });
            }
          }).catch(() => {});
        }
      });
    } catch (err) {
      console.error("[fetchRooms] failed:", err?.response?.status, err?.message);
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
          rooms: state.rooms.map((r) => {
            if (r.id !== room.id) return r;
            return {
              ...r,
              ...room,
              // Preserve good existing values when the incoming update has nothing better
              lastMessage: room.lastMessage || r.lastMessage || "",
              avatarUrl: room.avatarUrl ?? r.avatarUrl ?? null,
            };
          }),
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
      const lastMsg = msgs?.length ? msgs[msgs.length - 1] : null;
      set((state) => ({
        messages: { ...state.messages, [roomId]: msgs },
        rooms: state.rooms.map((r) =>
          r.id === roomId && lastMsg
            ? { ...r, lastMessage: lastMsg.content }
            : r
        ),
      }));
    } catch {
      toast.error("Failed to load messages.");
    }
  },

  async sendMessage(roomId, content, override = false) {
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
      pendingOptimistic: { roomId, id: optimistic.id, content },
    }));

    try {
      chatSocket.send(roomId, content, override);
      if (override) {
        // Once backend confirms the overridden message, reconnect to reset the
        // backend's per-connection override flag so future messages are moderated.
        let done = false;
        let unsubConfirm;
        const doReconnect = () => {
          if (done) return;
          done = true;
          if (unsubConfirm) unsubConfirm();
          chatSocket.softReconnect();
        };
        unsubConfirm = chatSocket.onMessage((msg) => {
          if (
            Number(msg.sender_id) === Number(currentUserId) &&
            msg.content === content
          ) {
            doReconnect();
          }
        });
        // Safety fallback: reconnect after 4s even if confirmation never arrives
        setTimeout(doReconnect, 4000);
      }
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
                (m) => m.id !== optimistic.id,
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
                    !(
                      String(m.id).startsWith("tmp-") &&
                      m.content === msg.content
                    ),
                )
              : existing;
          return {
            messages: {
              ...state.messages,
              [msg.room_id]: [...filtered, msg],
            },
            rooms: state.rooms.map((r) =>
              r.id === msg.room_id ? { ...r, lastMessage: msg.content } : r,
            ),
          };
        });
      },

      // ── Direct Chat ──────────────────────────────────────────────────────────────

      async openDirectChat(userId, name, avatarUrl) {
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
            avatarUrl: avatarUrl ?? null,
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
      async requestJoinTeam(teamId, userId = getCurrentUserId()) {
        const requestKey = getJoinRequestKey(teamId, userId);

        set((state) => ({
          joinRequestStatus: {
            ...state.joinRequestStatus,
            [requestKey]: "pending",
          },
          joinRequestError: { ...state.joinRequestError, [requestKey]: null },
        }));
      } catch (err) {
        const detail = err?.response?.data?.detail;
        if (detail?.code === "MESSAGE_FLAGGED") {
          set((state) => ({
            messages: {
              ...state.messages,
              [roomId]: (state.messages[roomId] ?? []).filter((m) => m.id !== optimistic.id),
            },
          }));
          chatSocket.moderationHandlers.forEach((h) =>
            h({ explanation: detail.explanation, suggestion: detail.suggestion ?? null })
          );
        } else {
          toast.error("Failed to send message.");
        }
      }
    }
  },

  receiveMessage(msg) {
    set((state) => {
      const existing = state.messages[msg.room_id] ?? [];
      if (existing.some((m) => m.id === msg.id)) return {};
      const currentUserId = getCurrentUserId();
      const isMine = Number(msg.sender_id) === Number(currentUserId);
      const pending = state.pendingOptimistic;
      const filtered = isMine
        ? existing.filter((m) => {
            if (!String(m.id).startsWith("tmp-")) return true;
            // Remove the tracked optimistic by exact ID first, then fall back to content
            if (pending && m.id === pending.id) return false;
            return m.content !== msg.content;
          })
        : existing;
      return {
        pendingOptimistic: null,
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

  async openDirectChat(userId, name, avatarUrl) {
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
        avatarUrl: avatarUrl ?? null,
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
    }),
    {
      name: `chat-rooms-${store.getState().auth?.user?.userID ?? store.getState().auth?.user?.id ?? "guest"}`,
      partialize: (state) => ({
        rooms: state.rooms,
        activeRoomId: state.activeRoomId,
        messages: Object.fromEntries(
          Object.entries(state.messages).map(([roomId, msgs]) => [
            roomId,
            msgs.filter((m) => !String(m.id).startsWith("tmp-")).slice(-50),
          ])
        ),
      }),
    }
  )
);

export default useChatStore;

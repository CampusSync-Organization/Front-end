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
  getAllTeams as apiGetAllTeams,
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

let _modUnsub = null;

const useChatStore = create(
  persist(
    (set, get) => ({
  rooms: [],
  messages: {},
  activeRoomId: null,
  isConnected: false,
  lastConfirmedMessage: null,
  isLoadingRooms: false,
  isLoadingIncomingJoinRequests: false,
  incomingJoinRequestsError: null,
  teams: [],
  pendingOptimistic: null,
  incomingJoinRequests: [],
  joinRequestStatus: {},
  joinRequestError: {},
  _fetchingMessages: null,

  // ── Socket ───────────────────────────────────────────────────────────────────

  connectSocket() {
    const token = store.getState().auth?.token;
    if (!token) return;
    chatSocket.connect(token);
    set({ isConnected: true });
    chatSocket.handlers = [];
    chatSocket.onMessage((msg) => get().receiveMessage(msg));
    if (_modUnsub) { _modUnsub(); _modUnsub = null; }
    _modUnsub = chatSocket.onModeration((data) => {
      const pending = get().pendingOptimistic;
      if (pending) {
        set((state) => ({
          pendingOptimistic: null,
          lastConfirmedMessage: null,
          messages: {
            ...state.messages,
            [pending.roomId]: (state.messages[pending.roomId] ?? []).filter(
              (m) => m.id !== pending.id
            ),
          },
        }));
        return;
      }
      const lastConfirmed = get().lastConfirmedMessage;
      if (lastConfirmed && Date.now() - lastConfirmed.addedAt < 10000) {
        set((state) => ({
          lastConfirmedMessage: null,
          messages: {
            ...state.messages,
            [lastConfirmed.roomId]: (state.messages[lastConfirmed.roomId] ?? []).filter(
              (m) => m.id !== lastConfirmed.id
            ),
          },
        }));
      }
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
      const newRooms = [];

      rooms.forEach((room) => {
        const type = room.type ?? (room.is_direct ? "direct" : "group");
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
          if (!avatarUrl && name) {
            const fromStore = resolvePeerFromStore(name);
            avatarUrl = fromStore.avatarUrl;
            if (!resolvedPeerId && fromStore.userId) resolvedPeerId = fromStore.userId;
          }
        } else {
          name = room.name ?? `Room ${room.id}`;
        }

        const roomEntry = {
          id: room.id,
          type,
          name: name ?? `User ${resolvedPeerId ?? room.id}`,
          lastMessage: room.last_message?.content ?? "",
          avatarUrl,
          members,
          peerId: resolvedPeerId ? Number(resolvedPeerId) : null,
          teamId: room.team_id ?? null,
        };
        newRooms.push(roomEntry);
        roomEntries.push({ roomEntry, name, peerId: resolvedPeerId, type });
      });

      // Discard any rooms not returned by the API — removes stale rooms from
      // old sessions or localStorage that the current user is no longer a member of.
      const freshIds = new Set(newRooms.map((r) => r.id));
      set((state) => ({
        rooms: state.rooms.filter((r) => freshIds.has(r.id)),
      }));

      // Batch set all rooms, merging with existing state
      set((state) => {
        const merged = [...state.rooms];
        newRooms.forEach((entry) => {
          const idx = merged.findIndex((r) => r.id === entry.id);
          if (idx !== -1) {
            merged[idx] = { ...merged[idx], ...entry };
          } else {
            merged.push(entry);
          }
        });
        return { rooms: merged };
      });

      // Batch-fetch last messages and resolve names in background
      const pendingUpdates = roomEntries.flatMap(({ roomEntry, peerId, type }) => {
        const jobs = [];

        jobs.push(
          getRoomMessages(roomEntry.id).then((msgs) => {
            if (msgs?.length) {
              const last = msgs[msgs.length - 1];
              return { id: roomEntry.id, lastMessage: last.content };
            }
            return null;
          }).catch(() => null)
        );

        if (type === "direct" && peerId) {
          jobs.push(
            getProfileByUserId(peerId).then((profile) => {
              const resolvedName = profile?.name ?? profile?.full_name ?? null;
              const resolvedAvatar = profile?.avatar_url ?? null;
              if (resolvedName || resolvedAvatar) {
                return {
                  id: roomEntry.id,
                  ...(resolvedName ? { name: resolvedName } : {}),
                  ...(resolvedAvatar ? { avatarUrl: resolvedAvatar } : {}),
                };
              }
              return null;
            }).catch(() => null)
          );
        }

        return jobs;
      });

      // Apply all background updates in a single batch
      (async () => {
        const results = await Promise.allSettled(pendingUpdates);
        const patches = [];
        results.forEach((r) => {
          if (r.status === "fulfilled" && r.value) patches.push(r.value);
        });
        if (patches.length) {
          set((state) => {
            const rooms = [...state.rooms];
            patches.forEach((patch) => {
              const idx = rooms.findIndex((r) => r.id === patch.id);
              if (idx !== -1) rooms[idx] = { ...rooms[idx], ...patch };
            });
            return { rooms };
          });
        }
      })();
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

  _fetchingMessages: null,

  async fetchMessages(roomId) {
    if (!roomId) return;
    if (get()._fetchingMessages === roomId) return;
    set({ _fetchingMessages: roomId });
    try {
      const msgs = await getRoomMessages(roomId);
      set((state) => ({
        _fetchingMessages: null,
        messages: { ...state.messages, [roomId]: msgs },
      }));
    } catch {
      set({ _fetchingMessages: null });
      toast.error("Failed to load messages.");
    }
  },

  async pollMessages(roomId) {
    if (!roomId) return;
    if (get().pendingOptimistic?.roomId === roomId) return;
    try {
      const msgs = await getRoomMessages(roomId);
      const currentUserId = getCurrentUserId();
      set((state) => {
        const existing = state.messages[roomId] ?? [];
        const existingIds = new Set(existing.map((m) => String(m.id)));
        const incoming = msgs.filter((m) => {
          if (String(m.id).startsWith("tmp-")) return false;
          if (existingIds.has(String(m.id))) return false;
          const sid = m.sender_id ?? m.user_id ?? null;
          if (sid != null && Number(sid) === Number(currentUserId)) return false;
          return true;
        });
        if (!incoming.length) return {};
        const merged = [...existing, ...incoming].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        return { messages: { ...state.messages, [roomId]: merged } };
      });
    } catch {}
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
            [roomId]: [...(state.messages[roomId] ?? []), msg],
          },
        }));
      } catch (err) {
        const detail = err?.response?.data?.detail;
        if (detail?.code === "MESSAGE_FLAGGED") {
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
    const senderId = msg.sender_id ?? msg.user_id ?? null;
    set((state) => {
      const existing = state.messages[msg.room_id] ?? [];

      if (msg.id != null && existing.some((m) => m.id === msg.id)) return {};

      const currentUserId = getCurrentUserId();
      const isMine = senderId != null && Number(senderId) === Number(currentUserId);
      const pending = state.pendingOptimistic;

      const filtered = existing.filter((m) => {
        if (!String(m.id).startsWith("tmp-")) return true;
        if (pending && m.id === pending.id) return false;
        if (m.content === msg.content) return false;
        return true;
      });

      return {
        pendingOptimistic: null,
        lastConfirmedMessage: isMine
          ? { id: msg.id, roomId: msg.room_id, addedAt: Date.now() }
          : state.lastConfirmedMessage,
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
      chatSocket.softReconnect();
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
      set((state) => ({
        teams: [...state.teams.filter((t) => t.id !== team.id), team],
      }));

      // If the backend returns a chat_room_id (created at team creation time),
      // add it to the store immediately so the owner can chat right away.
      const chatRoomId = team.chat_room_id;
      if (chatRoomId) {
        get().addRoom({
          id: chatRoomId,
          type: "team",
          name: team.name,
          lastMessage: "",
          members: [],
          teamId: Number(team.id),
        });
        set({ activeRoomId: chatRoomId });
        chatSocket.softReconnect();
      }

      toast.success("Team created!");
      // Sync with backend so the pruning logic in fetchRooms keeps the new room
      get().fetchRooms().catch(() => {});
      return team;
    } catch {
      toast.error("Failed to create team.");
    }
  },

  async fetchTeams() {
    try {
      const data = await apiGetAllTeams();
      const teams = Array.isArray(data) ? data : Array.isArray(data?.teams) ? data.teams : [];
      set({ teams });
    } catch {
      // silently ignore — non-critical
    }
  },

  async fetchIncomingJoinRequests() {
    if (get().isLoadingIncomingJoinRequests) {
      return get().incomingJoinRequests;
    }

    set({
      isLoadingIncomingJoinRequests: true,
      incomingJoinRequestsError: null,
    });

    try {
      const data = await apiGetIncomingJoinRequests();
      const incomingJoinRequests = Array.isArray(data) ? data : [];
      set({
        incomingJoinRequests,
        incomingJoinRequestsError: null,
      });
      return incomingJoinRequests;
    } catch (err) {
      const detail = err.response?.data?.detail;
      const message = Array.isArray(detail)
        ? detail.map((d) => d.msg).join(", ")
        : detail ?? err.response?.data?.message ?? "Failed to load join requests.";
      set({ incomingJoinRequestsError: message });
      toast.error(message);
    } finally {
      set({ isLoadingIncomingJoinRequests: false });
    }
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

  async requestJoinTeam(teamId, userId) {
    const key = userId ? `${userId}:${teamId}` : String(teamId);
    set((state) => ({
      joinRequestStatus: { ...state.joinRequestStatus, [key]: "pending" },
      joinRequestError: { ...state.joinRequestError, [key]: null },
    }));
    try {
      await apiRequestJoinTeam(teamId);
      set((state) => ({
        joinRequestStatus: { ...state.joinRequestStatus, [key]: "sent" },
        teams: state.teams.map((t) =>
          Number(t.id) === Number(teamId) ? { ...t, join_request_status: "pending" } : t
        ),
      }));
      toast.success("Join request sent!");
    } catch (err) {
      const msg = err?.response?.data?.detail ?? "Failed to send join request.";
      set((state) => ({
        joinRequestStatus: { ...state.joinRequestStatus, [key]: "rejected" },
        joinRequestError: { ...state.joinRequestError, [key]: msg },
      }));
      toast.error(msg);
      throw err;
    }
  },

  async approveJoinRequest(teamId, requestId) {
    try {
      const result = await apiApproveJoinRequest(teamId, requestId);
      set((state) => ({
        incomingJoinRequests: state.incomingJoinRequests.filter(
          (r) => (r.request_id ?? r.id) !== requestId
        ),
      }));

      const chatRoomId = result?.chat_room_id;
      if (chatRoomId) {
        const team = get().teams.find((t) => String(t.id) === String(teamId));
        get().addRoom({
          id: chatRoomId,
          type: "team",
          name: team?.name ?? `Team ${teamId}`,
          lastMessage: "",
          members: [],
          teamId: Number(teamId),
        });
        set({ activeRoomId: chatRoomId });
        get().fetchMessages(chatRoomId).catch(() => {});
        // Soft-reconnect so the WS session includes the newly created room
        chatSocket.softReconnect();
      }

      await get().fetchRooms();
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
      merge: (persisted, current) => ({
        ...current,
        ...(persisted ?? {}),
        rooms: Array.isArray(persisted?.rooms) ? persisted.rooms : current.rooms,
        messages: Object.fromEntries(
          Object.entries(persisted?.messages ?? {}).map(([id, msgs]) => [
            id,
            Array.isArray(msgs) ? msgs : [],
          ])
        ),
      }),
      partialize: (state) => ({
        rooms: state.rooms,
        activeRoomId: state.activeRoomId,
        messages: Object.fromEntries(
          Object.entries(state.messages ?? {}).map(([roomId, msgs]) => [
            roomId,
            (Array.isArray(msgs) ? msgs : [])
              .filter((m) => !String(m.id).startsWith("tmp-"))
              .slice(-50),
          ])
        ),
      }),
    }
  )
);

export default useChatStore;

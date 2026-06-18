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

const useChatStore = create(
  persist(
    (set, get) => ({
      joinRequestStatus: {}, // { [userId:teamId]: "idle" | "pending" | "fulfilled" | "rejected" }
      joinRequestError: {},
      incomingJoinRequests: [],
      isLoadingIncomingJoinRequests: false,
      incomingJoinRequestsError: null,
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
        if (get().isLoadingRooms) return;
        set({ isLoadingRooms: true });
        try {
          const data = await getUserChats();
          const rooms = Array.isArray(data)
            ? data
            : (data?.chats ?? data?.rooms ?? []);
          const currentUserId = getCurrentUserId();

          const roomEntries = [];

          rooms.forEach((room) => {
            const type = room.type ?? (room.is_direct ? "direct" : "direct");
            const members = room.members ?? [];
            const peer = members.find(
              (m) => Number(m.id ?? m.user_id) !== Number(currentUserId),
            );
            const peerId = peer?.id ?? null;

            let name;
            let avatarUrl = peer?.avatar_url ?? null;
            if (type === "direct") {
              const resolved =
                peer?.name ??
                peer?.full_name ??
                (peerId ? resolveNameFromStore(peerId) : null);
              name = resolved ?? null;
            } else {
              name = room.name ?? `Room ${room.id}`;
            }

            const roomEntry = {
              id: room.id,
              type,
              name: name ?? `User ${peerId ?? room.id}`,
              lastMessage: room.last_message?.content ?? "",
              avatarUrl,
              members,
              peerId: peerId ? Number(peerId) : null,
            };
            get().addRoom(roomEntry);
            roomEntries.push({ roomEntry, name, peerId, type });
          });

          // Batch-fetch last messages and resolve names in background
          roomEntries.forEach(({ roomEntry, name, peerId, type }) => {
            // Fetch real last message for each room
            getRoomMessages(roomEntry.id)
              .then((msgs) => {
                if (msgs?.length) {
                  const last = msgs[msgs.length - 1];
                  get().addRoom({ ...roomEntry, lastMessage: last.content });
                }
              })
              .catch(() => {});

            // Resolve name for direct chats if still unresolved
            if (type === "direct" && !name && peerId) {
              getProfileByUserId(peerId)
                .then((profile) => {
                  const resolvedName =
                    profile?.name ?? profile?.full_name ?? null;
                  const resolvedAvatar = profile?.avatar_url ?? null;
                  if (resolvedName) {
                    get().addRoom({
                      ...roomEntry,
                      name: resolvedName,
                      avatarUrl: resolvedAvatar,
                    });
                  }
                })
                .catch(() => {});
            }
          });
        } catch (err) {
          console.error(
            "[fetchRooms] failed:",
            err?.response?.status,
            err?.message,
          );
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
              rooms: state.rooms.map((r) =>
                r.id === room.id ? { ...r, ...room } : r,
              ),
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
                : r,
            ),
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

        try {
          await apiRequestJoinTeam(teamId);
          set((state) => ({
            joinRequestStatus: {
              ...state.joinRequestStatus,
              [requestKey]: "fulfilled",
            },
          }));
        } catch (err) {
          const message =
            err.response?.data?.message ?? "Failed to send join request.";
          set((state) => ({
            joinRequestStatus: {
              ...state.joinRequestStatus,
              [requestKey]: "rejected",
            },
            joinRequestError: {
              ...state.joinRequestError,
              [requestKey]: message,
            },
          }));
          throw err; // re-throw so the component can react if needed
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

      async approveJoinRequest(teamId, requestId) {
        try {
          const result = await apiApproveJoinRequest(teamId, requestId);
          set((state) => ({
            incomingJoinRequests: state.incomingJoinRequests.map((request) =>
              Number(request.request_id ?? request.id) === Number(requestId)
                ? { ...request, approved: true }
                : request,
            ),
          }));
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
              (r) => !(r.id === teamId && r.type === "team"),
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
      name: "chat-rooms",
      partialize: (state) => ({ rooms: state.rooms }),
    },
  ),
);

export default useChatStore;

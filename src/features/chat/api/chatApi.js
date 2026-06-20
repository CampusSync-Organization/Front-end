import api from "../../../services/api";

export async function getUserChats() {
  const response = await api.get("/chats");
  return response.data;
}

export async function getOrCreateDirectChat(userId) {
  const response = await api.post(`/chats/direct/${userId}`);
  return response.data;
}

export async function getRoomMessages(roomId) {
  const response = await api.get(`/rooms/${roomId}/messages`);
  return response.data;
}

export async function postMessage(roomId, content) {
  const response = await api.post(`/rooms/${roomId}/messages`, {
    room_id: roomId,
    content,
  });
  return response.data;
}

export async function deleteMessage(messageId) {
  const response = await api.delete(`/messages/${messageId}`);
  return response.data;
}

import api from "../../../services/api";

/** @typedef {{ id: number, name: string, description?: string, moderator_id: number, created_at: string, updated_at: string, member_count?: number, events?: unknown[], members?: { id: number, name: string }[], posts?: { id: number, content: string }[] }} CommunityResponse */

export async function createCommunity({ name, description }) {
  const { data } = await api.post("/communities", {
    name,
    description: description || undefined,
  });
  return data;
}

export async function getAllCommunities() {
  const { data } = await api.get("/communities");
  return data;
}

export async function getCommunity(communityId) {
  const { data } = await api.get(`/communities/${communityId}`);
  return data;
}

export async function getCommunityMemberView(communityId) {
  const { data } = await api.get(`/communities/${communityId}/member`);
  return data;
}

export async function getModeratedCommunities() {
  const { data } = await api.get("/communities/me/moderated");
  return data;
}

export async function getJoinedCommunities() {
  const { data } = await api.get("/communities/me/joined");
  return data;
}

export async function updateCommunity(communityId, { name, description }) {
  const { data } = await api.put(`/communities/${communityId}`, {
    ...(name !== undefined ? { name } : {}),
    ...(description !== undefined ? { description } : {}),
  });
  return data;
}

export async function deleteCommunity(communityId) {
  const { data } = await api.delete(`/communities/${communityId}`);
  return data;
}

export async function joinCommunity(communityId) {
  const { data } = await api.post(`/communities/${communityId}/join`);
  return data;
}

export async function leaveCommunity(communityId) {
  const { data } = await api.post(`/communities/${communityId}/leave`);
  return data;
}

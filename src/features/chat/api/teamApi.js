import api from "../../../services/api";

export async function createTeam(name, description) {
  const response = await api.post("/teams", { name, description });
  return response.data;
}

export async function requestJoinTeam(teamId) {
  const response = await api.post(`/teams/${teamId}/request_join`);
  return response.data;
}

export async function approveJoinRequest(teamId, requestId) {
  const response = await api.post(`/teams/${teamId}/approve/${requestId}`);
  return response.data;
}

export async function getIncomingJoinRequests() {
  const response = await api.get("/teams/requests");
  return response.data;
}

export async function getAllTeams() {
  const response = await api.get("/teams");
  return response.data;
}

export async function getTeam(teamId) {
  const response = await api.get(`/teams/${teamId}`);
  return response.data;
}

export async function leaveTeam(teamId) {
  const response = await api.delete(`/teams/${teamId}/leave`);
  return response.data;
}

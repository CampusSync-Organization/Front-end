import api from "../../../services/api";

export async function getAllEvents() {
  const { data } = await api.get("/events");
  return data;
}

export async function getStandaloneEvents() {
  const { data } = await api.get("/events/standalone");
  return data;
}

export async function getEventById(eventId) {
  const { data } = await api.get(`/events/${eventId}`);
  return data;
}

export async function getMyOrganizedEvents() {
  const { data } = await api.get("/events/me/organized");
  return data;
}

export async function createEvent(eventData) {
  const { data } = await api.post("/events", eventData);
  return data;
}

export async function createCommunityEvent(communityId, eventData) {
  const { data } = await api.post(`/communities/${communityId}/events`, eventData);
  return data;
}

export async function getCommunityEvents(communityId) {
  const { data } = await api.get(`/communities/${communityId}/events`);
  return data;
}

export async function updateEvent(eventId, eventData) {
  const { data } = await api.put(`/events/${eventId}`, eventData);
  return data;
}

export async function deleteEvent(eventId) {
  const { data } = await api.delete(`/events/${eventId}`);
  return data;
}

export async function reserveEvent(eventId) {
  const { data } = await api.post("/events/reserve", { event_id: eventId });
  return data;
}

export async function cancelReservation(eventId) {
  const { data } = await api.post(`/events/${eventId}/cancel`);
  return data;
}

export async function checkAttendance(eventId) {
  const { data } = await api.get(`/events/${eventId}/attending`);
  return data;
}

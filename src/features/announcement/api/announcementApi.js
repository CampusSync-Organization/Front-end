import api from "../../../services/api";

export const announcementApi = {
  createAnnouncement: async (data) => {
    const response = await api.post("/announcements", data);
    return response.data;
  },
  getGlobalFeed: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/announcements?${params}`);
    console.log("announcements data: ", response.data);
    return response.data;
  },
  getMyAnnouncements: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/announcements/me?${params}`);
    return response.data;
  },
  getUserAnnouncements: async (userId) => {
    const response = await api.get(`/announcements/user/${userId}`);
    return response.data;
  },
  getConnectionsFeed: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/announcements/feed?${params}`);
    return response.data;
  },
  updateAnnouncement: async (id, updates) => {
    const response = await api.put(`/announcements/${id}`, updates);
    return response.data;
  },
  deleteAnnouncement: async (id) => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  },
};

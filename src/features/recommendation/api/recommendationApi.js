import api from "../../../services/api";

export async function getRecommendations(mode) {
  const params = mode && mode !== "all" ? { mode } : {};

  try {
    const response = await api.get("/recommendations", { params }); // ✅ no API_BASE needed, axios instance handles it
    return response.data;
  } catch (err) {
    throw err;
  }
}

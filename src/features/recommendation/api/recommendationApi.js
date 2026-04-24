import api from "../../../services/api";

export async function getRecommendations(mode) {
  const params = mode && mode !== "all" ? { mode } : {};

  try {
    const response = await api.get("/recommendations", { params }); // ✅ no API_BASE needed, axios instance handles it
    console.log("recommendations data:", response.data);
    return response.data; // ✅ returns { recommendations: [...] }
  } catch (err) {
    console.error("recommendations error:", err.response?.data);
    throw err; // ✅ rethrow so rejectWithValue in the thunk catches it
  }
}

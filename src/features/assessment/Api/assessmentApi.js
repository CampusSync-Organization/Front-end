import axios from "axios";
import { API_BASE } from "../../auth/api/authApi";
export async function updateAssessment({ token }) {
  const response = await axios.post(
    `${API_BASE}/me/assessment`,
    {}, // ← Empty body (or your assessment data if needed)
    {
      // ← Third parameter is the config object
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  console.log("assessment response", response.data);
  return response.data;
}

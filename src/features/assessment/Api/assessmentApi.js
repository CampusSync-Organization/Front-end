import api from "../../../services/api";
export async function updateAssessment() {
  try {
    const response = await api.post("/me/assessment", {});
    return response.data;
  } catch (err) {
    return;
  }
}

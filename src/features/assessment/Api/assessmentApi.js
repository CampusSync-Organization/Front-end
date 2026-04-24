import api from "../../../services/api";
export async function updateAssessment() {
  try {
    const response = await api.post("/me/assessment", {});
    console.log("assessmentupdated");
    return response.data;
  } catch (err) {
    console.log("error", err.response?.data);
    return;
  }
}

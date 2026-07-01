import api from "../../../services/api";
export async function updateStudentMatrix({ data }) {
  try {
    const response = await api.post("/student-matrix/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
}

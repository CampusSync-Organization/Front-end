import api from "../../../services/api";
export async function updateStudentMatrix({ data }) {
  try {
    const response = await api.post("/student-matrix/", data);
    console.log("matrix response: ", response, data);
    return response.data;
  } catch (error) {
    console.log(`Error ${error.response?.status} detail:`, error.response?.data);
    throw error;
  }
}

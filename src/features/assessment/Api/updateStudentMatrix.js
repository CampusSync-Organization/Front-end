import api from "../../../services/api";
export async function updateStudentMatrix({ data }) {
  try {
    const response = await api.post("/student-matrix/", data);
    console.log("matrix response: ", response, data);
    return response.data;
  } catch (error) {
    console.log("422 error detail:", error.response?.data); // ✅ this shows exactly what field is wrong
    throw error;
  }
}

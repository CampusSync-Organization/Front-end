import axios from "axios";

export const API_BASE = "https://back-end-production-7229.up.railway.app";

/**
 * Register a new user
 * @param {{ email: string, name: string, password: string }} payload
 * @returns {Promise<{ id: number, email: string, role: string, auth_provider: string, assessment_completed: boolean, is_active: boolean }>}
 */
export async function register({ email, name, password }) {
  const { data } = await axios.post(`${API_BASE}/register`, {
    email,
    name,
    password,
  });
  return data;
}

/**
 * Log in a user
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<{ id?: number, email: string, role?: string, access_token?: string, token_type?: string }>}
 */
export async function login({ email, password }) {
  const { data } = await axios.post(`${API_BASE}/login`, {
    email,
    password,
  });
  return data;
}
/**
 * Log in with Google
 * @param {{ credential: string }} credentialResponse - the response from @react-oauth/google GoogleLogin popup
 * @returns {Promise<{ id?: number, email: string, role?: string, access_token?: string, token_type?: string }>}
 */
export async function googleLogin({ credential }) {
  try {
    const response = await axios.post(`${API_BASE}/auth/google`, {
      id_token: credential,
    });
    console.log("Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error details:", error.response?.data);
    console.error("Request that was sent:", error.config?.data);
    throw error;
  }
}


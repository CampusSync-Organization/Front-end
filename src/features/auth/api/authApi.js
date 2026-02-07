import axios from "axios";

const API_BASE = "https://back-end-production-7229.up.railway.app";

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

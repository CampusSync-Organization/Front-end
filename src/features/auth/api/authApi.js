import api from "../../../services/api";

/**
 * Register a new user
 * @param {{ email: string, name: string, password: string }} payload
 * @returns {Promise<{ id: number, email: string, role: string, auth_provider: string, assessment_completed: boolean, is_active: boolean }>}
 */
export async function register({ email, name, password }) {
  const { data } = await api.post("/register", {
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
  const { data } = await api.post("/login", {
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
    const response = await api.post("/auth/google", {
      id_token: credential,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

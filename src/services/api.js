import axios from "axios";
import { store } from "../app/store/index.js";
import { API_BASE } from "../features/auth/api/authApi";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

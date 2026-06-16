import axios from "axios";
import { store } from "../app/store/index.js";

export const API_BASE_URL = "https://back-end-production-7229.up.railway.app";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

import axios from "axios";
import { store } from "../app/store/index.js";

const API_BASE = "https://back-end-production-7229.up.railway.app";

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

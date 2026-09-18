import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5001"
    : "https://shehriyar-perfumes-production.up.railway.app");
const API_URL = configuredApiUrl.replace(/\/$/, '').endsWith('/api')
  ? configuredApiUrl
  : `${configuredApiUrl.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const withAuth = (token) =>
  token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};

export default api;
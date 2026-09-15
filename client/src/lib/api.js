import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://shehriyar-perfumes-production.up.railway.app";

export const withAuth = (token) => token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};

export default api;

import { io } from "socket.io-client";

const configuredApiUrl = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5001"
    : "https://shehriyar-perfumes-production.up.railway.app");
const SOCKET_URL = configuredApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
});

export default socket;
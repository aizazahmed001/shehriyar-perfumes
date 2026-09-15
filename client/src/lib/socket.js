import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_URL ||
  "https://shehriyar-perfumes-production.up.railway.app";

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
});

export default socket;
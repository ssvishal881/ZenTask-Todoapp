import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL); // FIX: was hardcoded "http://localhost:3000"

export default socket;

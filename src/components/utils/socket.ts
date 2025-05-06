import { io, Socket } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_BASE_URL;
// Tu peux typer ici les événements si tu veux plus de contrôle
interface ServerToClientEvents {
  jobStatusUpdate: (data: {
    id: string;
    name: string;
    status: string;
    records: number;
    enriched: number;
    link: string;
  }) => void;
}

interface ClientToServerEvents {
  // Sending event here
}

// const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(BASE_URL);
const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
  io("https:google.com");

export default socket;

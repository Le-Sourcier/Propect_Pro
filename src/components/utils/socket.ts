import { io, Socket } from "socket.io-client";

const BASE_URL = import.meta.env.BASE_URL;
// Tu peux typer ici les événements si tu veux plus de contrôle
interface ServerToClientEvents {
  jobStatusUpdate: (data: {
    id: string;
    status: string;
    records: number;
    enriched: number;
    link: string;
  }) => void;
}

interface ClientToServerEvents {
  // Déclare ici les événements que tu envoies au serveur (si besoin)
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:3000"
);

export default socket;

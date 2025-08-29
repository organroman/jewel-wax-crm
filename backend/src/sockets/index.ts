import { Server } from "socket.io";
import { registerChatsHandlers } from "./chats.socket";

export function registerSocketHandlers(io: Server) {
  registerChatsHandlers(io);
}

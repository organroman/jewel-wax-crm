import { Server } from "socket.io";
import { registerOrderChatHandlers } from "./order-chat.socket";

export function registerSocketHandlers(io: Server) {
  registerOrderChatHandlers(io);
}

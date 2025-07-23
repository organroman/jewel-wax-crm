import { Server, Socket } from "socket.io";
import { OrderChatService } from "../services/order-chat-service";

export function registerOrderChatHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    const user = socket.data.user;

    socket.on("chat:join", ({ chatId }) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined room ${chatId}`);
    });

    socket.on("chat:send", async ({ chatId, message, media }) => {
      const msg = await OrderChatService.sendMessage({
        chatId,
        senderId: user?.id,
        message,
        media,
      });
      io.to(chatId).emit("chat:newMessage", msg);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });
}

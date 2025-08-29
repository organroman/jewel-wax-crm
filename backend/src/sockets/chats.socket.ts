import { Server, Socket } from "socket.io";

import { OrderChatService } from "../services/order-chat-service";
import { ChatService } from "../services/chat-service";

import { ConversationModel } from "../models/chat/conversation-model";
import { MessageModel } from "../models/chat/message-model";

import { emitBadges } from "../utils/real-time";

export function registerChatsHandlers(io: Server) {
  io.on("connection", async (socket: Socket) => {
    // console.log("User connected:", socket.id);

    const user = socket.data.user;

    if (!user?.id) return socket.disconnect(true);

    socket.join(`user:${user.id}`);
    await emitBadges(io, user.id);

    socket.on("chat:join", ({ chatId }) => {
      socket.join(chatId);
    });
    socket.on("chat:leave", ({ chatId }) => {
      socket.leave(chatId);
    });

    socket.on("chat:send", async ({ chatId, message, media }) => {
      const msg = await OrderChatService.sendMessage({
        chatId,
        senderId: user?.id,
        message,
        media,
      });
      io.to(chatId).emit("chat:newMessage", msg);
      const participants = await OrderChatService.getChatParticipants(chatId);

      const otherIds = participants
        .map((p) => p.person_id)
        .filter(
          (pid): pid is number => typeof pid === "number" && pid !== user.id
        );

      for (const pid of otherIds) {
        await emitBadges(io, pid);
      }
    });

    socket.on("chat:read", async ({ chatId, lastMessageId }) => {
      await OrderChatService.markThreadAsRead({
        chatId,
        personId: user?.id,
        lastMessageId,
      });

      await emitBadges(io, user.id);
    });

    socket.on("conversation:join", ({ conversationId }) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on("conversation:leave", ({ conversationId }) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on(
      "conversation:read",
      async ({ conversationId, lastMessageId }) => {
        await MessageModel.markRead(conversationId, user?.id, lastMessageId);

        await emitBadges(io, user.id);
      }
    );

    socket.on(
      "conversation:send",
      async ({ conversationId, text, attachments }) => {
        // send via provider(s)
        const message = await ChatService.sendMessage({
          conversation_id: conversationId,
          agent_person_id: user.id,
          text,
          attachments,
        });
        // broadcast to agents viewing
        io.to(`conversation:${conversationId}`).emit(
          "chat:newMessage",
          message
        );
        // notify assignees/participants
        const participants =
          await ConversationModel.getParticipantsByConversationsIds([
            conversationId,
          ]);
        const otherIds = participants
          .map((p) => p.person_id)
          .filter(
            (pid): pid is number => typeof pid === "number" && pid !== user.id
          );
        for (const pid of otherIds) await emitBadges(io, pid);
      }
    );

    socket.on("disconnect", () => {
      // console.log("User disconnected", socket.id);
    });
  });
}

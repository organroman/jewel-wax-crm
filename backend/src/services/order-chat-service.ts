import { PersonModel } from "../models/person-model";
import { OrderChatModel } from "../models/order-chat-model";
import {
  ChatParticipantFull,
  OrderChat,
  OrderChatMedia,
  OrderChatMediaInput,
  OrderChatMessage,
  OrderPerformer,
} from "../types/order-chat.types";
import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";
import { ActivityLogModel } from "../models/activity-log-model";
import { LOG_ACTIONS, LOG_TARGETS } from "../constants/activity-log";
import cloudinary from "../cloudinary/config";
import { s3 } from "../digital-ocean/spaces-client";

export const OrderChatService = {
  async getOrCreateChat({
    orderId,
    currentUser,
    opponentId,
    type,
  }: {
    orderId: number;
    currentUser: number;
    opponentId: number;
    type: OrderPerformer;
  }): Promise<OrderChat> {
    const newChat = await OrderChatModel.getOrCreateChatByOrderId({
      orderId,
      type,
    });

    await OrderChatModel.createChatParticipant({
      chat_id: newChat.id,
      person_id: currentUser,
    });
    await OrderChatModel.createChatParticipant({
      chat_id: newChat.id,
      person_id: opponentId,
    });

    return newChat;
  },

  async getMessages(chatId: number): Promise<OrderChatMessage[]> {
    return await OrderChatModel.getMessagesByChatId(chatId);
  },

  async getLatestMessages({
    chatId,
    limit,
  }: {
    chatId: number;
    limit: number;
  }): Promise<OrderChatMessage[]> {
    return await OrderChatModel.getLatestMessagesByChatId({ chatId, limit });
  },
  async getChatParticipants(chatId: number): Promise<ChatParticipantFull[]> {
    const participants = await OrderChatModel.getChatParticipants(chatId);

    const enriched = await Promise.all(
      participants.map(async (p) => {
        const fullPerson = await PersonModel.findById(p.person_id);

        if (!fullPerson)
          throw new AppError(ERROR_MESSAGES.PERSON_NOT_FOUND, 404);

        return {
          ...p,
          first_name: fullPerson?.first_name,
          last_name: fullPerson?.last_name,
          patronymic: fullPerson?.patronymic,
          role: fullPerson?.role,
          avatar_url: fullPerson.avatar_url,
          phone:
            fullPerson?.phones.find((p) => p.is_main)?.number ??
            fullPerson?.phones[0].number,
        };
      })
    );
    return enriched;
  },
  async getChatDetails({
    chatId,
    limit,
  }: {
    chatId: number;
    limit: number;
  }): Promise<{
    messages: OrderChatMessage[];
    media: OrderChatMedia[];
  }> {
    const [messages, media] = await Promise.all([
      OrderChatModel.getLatestMessagesByChatId({ chatId, limit }),
      OrderChatModel.getChatMedia(chatId),
    ]);

    return { messages, media };
  },

  async sendMessage({
    chatId,
    senderId,
    message,
    media,
  }: {
    chatId: number;
    senderId: number;
    message?: string;
    media?: OrderChatMediaInput[];
  }): Promise<OrderChatMessage> {
    const msg = await OrderChatModel.createChatMessage({
      chat_id: chatId,
      sender_id: senderId,
      message: message,
    });

    if (!msg) throw new AppError(ERROR_MESSAGES.FAILED_TO_SEND_MESSAGE, 500);

    let mediaIds: number[] = [];

    if (media?.length) {
      const mediaList = await Promise.all(
        media.map(
          async (m) =>
            await OrderChatModel.createChatMedia({
              ...m,
              uploader_id: senderId,
            })
        )
      );
      mediaIds = mediaList.map((item) => item.id);
    }

    if (mediaIds.length) {
      await Promise.all(
        mediaIds.map(async (mediaId) =>
          OrderChatModel.createChatMessageMedia({
            message_id: msg.id,
            media_id: mediaId,
          })
        )
      );
    }

    return await OrderChatModel.getMessageById(msg.id);
  },

  async deleteChat(chatId: number, authorId?: number): Promise<number> {
    const chatMedia = await OrderChatModel.getChatMedia(chatId);

    const images = chatMedia.filter((m) => m.type === "image") ?? [];
    const files = chatMedia.filter((m) => m.type === "file") ?? [];

    const result = await OrderChatModel.deleteChat(chatId);

    if (chatMedia.length) {
      await OrderChatModel.deleteChatMedia(chatMedia.map((m) => m.id));
    }

    if (images.length) {
      await Promise.all(
        images.map((i) => cloudinary.uploader.destroy(i.public_id))
      );
    }

    if (files.length) {
      await Promise.all(
        files.map((f) =>
          s3.deleteObject({
            Bucket: process.env.DO_SPACES_BUCKET!,
            Key: f.public_id,
          })
        )
      );
    }

    await ActivityLogModel.logAction({
      actor_id: authorId ?? null,
      action: LOG_ACTIONS.DELETE_ORDER_CHAT,
      target_id: chatId,
      target_type: LOG_TARGETS.ORDER,
    });
    return result;
  },
  async markThreadAsRead({
    chatId,
    personId,
    lastMessageId,
  }: {
    chatId: number;
    personId: number;
    lastMessageId: number;
  }) {
    const latestId =
      lastMessageId ?? (await OrderChatModel.getLatestMessageId(chatId));
    if (!latestId) return;
    await OrderChatModel.markAsReadUpTo(chatId, personId, latestId);
  },

  async getUnreadCount(chatId: number, personId: number) {
    return await OrderChatModel.getUnreadCountForChat(chatId, personId);
  },

  async markMessageAsRead(messageId: number, readerId: number) {
    return await OrderChatModel.markAsRead(messageId, readerId);
  },

  async getUnreadMapForUser(personId: number) {
    const rows = await OrderChatModel.unreadByChat(personId);
    const map: Record<number, number> = {};
    for (const r of rows) map[r.chat_id] = Number(r.unread);
    return map;
  },

  async toggleReaction({
    messageId,
    personId,
    reaction = "like",
    mode = "toggle",
  }: {
    messageId: number;
    personId: number;
    reaction?: string;
    mode?: "toggle" | "add" | "remove";
  }) {
    const existing = await OrderChatModel.getReactionsForMessage(messageId);
    const hasReacted = existing.some(
      (r) => r.person_id === personId && r.reaction === reaction
    );

    if ((mode === "toggle" && hasReacted) || mode === "remove") {
      return await OrderChatModel.removeReaction(messageId, personId, reaction);
    }

    if ((mode === "toggle" && !hasReacted) || mode === "add") {
      return await OrderChatModel.react(messageId, personId, reaction);
    }
  },
};

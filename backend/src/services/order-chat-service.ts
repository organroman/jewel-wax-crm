import { OrderChatModel } from "../models/order-chat-model";
import {
  OrderChat,
  OrderChatMediaInput,
  OrderChatMessage,
  OrderPerformer,
} from "../types/order-chat.types";

export const OrderChatService = {
  async getOrCreateChat({
    orderId,
    type,
  }: {
    orderId: number;
    type: OrderPerformer;
  }): Promise<OrderChat> {
    return await OrderChatModel.getOrCreateChatByOrderId({ orderId, type });
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

  async sendMessage({
    chatId,
    senderId,
    message,
    media,
  }: {
    chatId: number;
    senderId: number;
    message?: string;
    media?: OrderChatMediaInput;
  }): Promise<OrderChatMessage> {
    let mediaId = undefined;

    if (media) {
      const newMedia = await OrderChatModel.createChatMedia({
        ...media,
        uploader_id: senderId,
      });
      mediaId = newMedia.id;
    }

    const msg = await OrderChatModel.createChatMessage({
      chat_id: chatId,
      sender_id: senderId,
      message: message,
      media_id: mediaId,
    });
    return msg;
  },
  async markMessageAsRead(messageId: number, readerId: number) {
    return await OrderChatModel.markAsRead(messageId, readerId);
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

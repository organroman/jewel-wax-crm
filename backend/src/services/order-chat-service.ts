import { PersonModel } from "../models/person-model";
import { OrderChatModel } from "../models/order-chat-model";
import {
  ChatParticipantFull,
  OrderChat,
  OrderChatMediaInput,
  OrderChatMessage,
  OrderPerformer,
} from "../types/order-chat.types";
import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";

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
    participants: ChatParticipantFull[];
  }> {
    const [messages, participants] = await Promise.all([
      OrderChatModel.getLatestMessagesByChatId({ chatId, limit }),
      this.getChatParticipants(chatId),
    ]);

    return { messages, participants };
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

import db from "../db/db";
import {
  OrderChat,
  OrderChatInput,
  OrderChatMedia,
  OrderChatMediaInput,
  OrderChatMessage,
  OrderChatMessageInput,
  OrderPerformer,
} from "../types/order-chat.types";

export const OrderChatModel = {
  async getChatByOrderId({
    orderId,
    type = "modeller",
  }: {
    orderId: number;
    type: OrderPerformer;
  }): Promise<OrderChat> {
    console.log("OrderChat, orderId", orderId);
    const [chat] = await db<OrderChat>("order_chats")
      .where("order_id", orderId)
      .andWhere("type", type);

    return chat;
  },

  async createChat(data: OrderChatInput): Promise<OrderChat> {
    const [newOrder] = await db<OrderChat>("order_chats")
      .insert(data)
      .returning("*");
    return newOrder;
  },

  async getOrCreateChatByOrderId({
    orderId,
    type = "modeller",
  }: {
    orderId: number;
    type: OrderPerformer;
  }): Promise<OrderChat> {
    const existing = await db<OrderChat>("order_chats")
      .where({ order_id: orderId, type })
      .first();
    if (existing) return existing;

    const created = await this.createChat({ order_id: orderId, type: type });
    return created;
  },

  async createChatMessage(
    data: OrderChatMessageInput
  ): Promise<OrderChatMessage> {
    const [message] = await db<OrderChatMessage>("order_chat_messages")
      .insert({ ...data, created_at: new Date(), updated_at: new Date() })
      .returning("*");
    return message;
  },
  async getMessagesByChatId(chatId: number): Promise<OrderChatMessage[]> {
    const messages = await db<OrderChatMessage>("order_chat_messages")
      .where("chat_id", chatId)
      .select("*")
      .orderBy("created_at", "asc");

    return messages;
  },

  async getLatestMessagesByChatId({
    chatId,
    limit = 50,
  }: {
    chatId: number;
    limit: number;
  }): Promise<OrderChatMessage[]> {
    const messages = await db<OrderChatMessage>("order_chat_messages")
      .where("chat_id", chatId)
      .select("*")
      .orderBy("created_at", "desc")
      .limit(limit);

    return messages.reverse();
  },

  async createChatMedia(data: OrderChatMediaInput): Promise<OrderChatMedia> {
    const [media] = await db<OrderChatMedia>("chat_media")
      .insert(data)
      .returning("*");
    return media;
  },
  async getChatMediaById(id: number): Promise<OrderChatMedia> {
    const [media] = await db<OrderChatMedia>("chat_media")
      .where("id", id)
      .select("*");
    return media;
  },
  /*** MESSAGE READS------  */
  async markAsRead(messageId: number, readerId: number) {
    db("order_chat_message_reads")
      .insert({
        id: crypto.randomUUID(),
        message_id: messageId,
        reader_id: readerId,
      })
      .onConflict(["message_id", "reader_id"])
      .ignore();
  },

  async getReadsByMessage(messageId: number) {
    db("order_chat_message_reads").where({ message_id: messageId });
  },
  /*** MESSAGE REACTIONS------  */
  async react(messageId: number, personId: number, reaction = "like") {
    return await db("order_chat_message_reactions")
      .insert({
        id: crypto.randomUUID(),
        message_id: messageId,
        person_id: personId,
        reaction,
      })
      .onConflict(["message_id", "person_id", "reaction"])
      .ignore();
  },

  async removeReaction(messageId: number, personId: number, reaction = "like") {
    return await db("order_chat_message_reactions")
      .where({ message_id: messageId, person_id: personId, reaction })
      .delete();
  },

  async getReactionsForMessage(messageId: number) {
    return await db("order_chat_message_reactions").where({
      message_id: messageId,
    });
  },
};

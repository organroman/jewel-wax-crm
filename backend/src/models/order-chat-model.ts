import db from "../db/db";
import {
  ChatParticipant,
  ChatParticipantInput,
  OrderChat,
  OrderChatInput,
  OrderChatMedia,
  OrderChatMediaInput,
  OrderChatMessage,
  OrderChatMessageInput,
  OrderChatMessageMedia,
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
    const [chat] = await db<OrderChat>("order_chats")
      .where("order_id", orderId)
      .andWhere("type", type);

    return chat;
  },

  async createChat(data: OrderChatInput): Promise<OrderChat> {
    const [newChat] = await db<OrderChat>("order_chats")
      .insert(data)
      .returning("*");
    return newChat;
  },
  async createChatParticipant(
    data: ChatParticipantInput
  ): Promise<ChatParticipant> {
    const [newParticipant] = await db<ChatParticipant>("chat_participants")
      .insert(data)
      .returning("*");

    return newParticipant;
  },

  async getChatParticipants(chatId: number): Promise<ChatParticipant[]> {
    return await db<ChatParticipant>("chat_participants")
      .where("chat_id", chatId)
      .select("*");
  },
  async getChatMedia(chatId: number): Promise<OrderChatMedia[]> {
    return await db<OrderChatMedia>("chat_media as media")
      .join("order_chat_message_media as link", "media.id", "link.media_id")
      .join("order_chat_messages as msg", "msg.id", "link.message_id")
      .where("msg.chat_id", chatId)
      .select("media.*");
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

  async getMessageById(id: number): Promise<OrderChatMessage> {
    const [message] = await db<OrderChatMessage>("order_chat_messages as msg")
      .where("msg.id", id)
      .leftJoin("order_chat_message_media as link", "msg.id", "link.message_id")
      .leftJoin("chat_media as media", "link.media_id", "media.id")
      .select(
        "msg.*",
        db.raw(
          `COALESCE(json_agg(media.*) FILTER (WHERE media.id IS NOT NULL), '[]') as media`
        )
      )
      .groupBy("msg.id");

    return message;
  },

  async createChatMessage(
    data: OrderChatMessageInput
  ): Promise<OrderChatMessage> {
    const { media_ids, ...messageInput } = data;
    const now = new Date();
    const [message] = await db<OrderChatMessage>("order_chat_messages")
      .insert({
        ...messageInput,
        created_at: now,
        updated_at: now,
      })
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
    const messages = await db<OrderChatMessage>("order_chat_messages as msg")
      .where("msg.chat_id", chatId)
      .leftJoin("order_chat_message_media as link", "msg.id", "link.message_id")
      .leftJoin("chat_media as media", "link.media_id", "media.id")
      .select(
        "msg.*",
        db.raw(
          `COALESCE(json_agg(media.*) FILTER (WHERE media.id IS NOT NULL), '[]') as media`
        )
      )
      .groupBy("msg.id")
      .orderBy("created_at", "desc")
      .limit(limit);

    return messages.reverse();
  },

  async createChatMessageMedia({
    message_id,
    media_id,
  }: {
    message_id: number;
    media_id: number;
  }): Promise<OrderChatMessageMedia> {
    const [chatMessageMedia] = await db<OrderChatMessageMedia>(
      "order_chat_message_media"
    )
      .insert({ message_id, media_id })
      .returning("*");
    return chatMessageMedia;
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

  async deleteChat(chatId: number): Promise<number> {
    return await db<OrderChat>("order_chats").where("id", chatId).del();
  },
  async deleteChatMedia(mediaIds: number[]) {
    await db<OrderChatMedia>("chat_media").whereIn("id", mediaIds).del();
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

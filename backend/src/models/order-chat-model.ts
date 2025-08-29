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

  async getChatIdsByOrderIds(
    orderIds: number[]
  ): Promise<{ order_id: number; chat_id: number }[]> {
    const chats = await db<OrderChat>("order_chats")
      .whereIn("order_id", orderIds)
      .select("*");
    return chats.map((chat) => ({ chat_id: chat.id, order_id: chat.order_id }));
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
      .onConflict(["chat_id", "person_id"])
      .ignore()
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
    await db.raw(
      `
    INSERT INTO order_chat_message_reads (message_id, reader_id, read_at, chat_id)
    SELECT m.id, ?, NOW(), m.chat_id
    FROM order_chat_messages m
    WHERE m.id = ?
      AND m.sender_id <> ?       -- don't mark your own msgs
    ON CONFLICT (message_id, reader_id) DO NOTHING
    `,
      [readerId, messageId, readerId]
    );
  },

  async getReadsByMessage(messageId: number) {
    return await db("order_chat_message_reads").where({
      message_id: messageId,
    });
  },

  async getLatestMessageId(chatId: number): Promise<number | null> {
    const row = await db<OrderChatMessage>("order_chat_messages")
      .where("chat_id", chatId)
      .max<{ max: string }>("id as max")
      .first();
    return row?.max ? Number(row.max) : null;
  },
  async markPointerRead(
    chatId: number,
    personId: number,
    lastMessageId: number
  ) {
    await db.raw(
      `
    INSERT INTO order_chat_reads (chat_id, person_id, last_read_message_id, last_read_at)
    VALUES (?, ?, ?, NOW())
    ON CONFLICT (chat_id, person_id)
    DO UPDATE SET
      last_read_message_id = GREATEST(
        COALESCE(order_chat_reads.last_read_message_id, 0),
        EXCLUDED.last_read_message_id
      ),
      last_read_at = NOW()
  `,
      [chatId, personId, lastMessageId]
    );
  },

  async markAsReadUpTo(
    chatId: number,
    personId: number,
    lastMessageId: number
  ) {
    await db.transaction(async (trx) => {
      // 1) pointer
      await trx.raw(
        `
      INSERT INTO order_chat_reads (chat_id, person_id, last_read_message_id, last_read_at)
      VALUES (?, ?, ?, NOW())
      ON CONFLICT (chat_id, person_id)
      DO UPDATE SET
        last_read_message_id = GREATEST(
          COALESCE(order_chat_reads.last_read_message_id, 0),
          EXCLUDED.last_read_message_id
        ),
        last_read_at = NOW()
      `,
        [chatId, personId, lastMessageId]
      );

      // 2) per-message receipts (exclude author's msgs) — NOW WITH chat_id
      await trx.raw(
        `
      INSERT INTO order_chat_message_reads (message_id, reader_id, read_at, chat_id)
      SELECT m.id, ?, NOW(), m.chat_id
      FROM order_chat_messages m
      LEFT JOIN order_chat_message_reads r
        ON r.message_id = m.id AND r.reader_id = ?
      WHERE m.chat_id = ?
        AND m.id <= ?
        AND m.sender_id <> ?
        AND r.message_id IS NULL
      ON CONFLICT (message_id, reader_id) DO NOTHING
      `,
        [personId, personId, chatId, lastMessageId, personId]
      );
    });
  },

  async getUnreadCountForChat(
    chatId: number,
    personId: number
  ): Promise<number> {
    const row = await db("order_chat_messages as m")
      .leftJoin("order_chat_reads as cr", function () {
        this.on("cr.chat_id", "=", "m.chat_id").andOn(
          "cr.person_id",
          "=",
          db.raw("?", [personId])
        );
      })
      .where("m.chat_id", chatId)
      .andWhere("m.sender_id", "<>", personId)
      .andWhereRaw(
        "(cr.last_read_message_id IS NULL OR m.id > cr.last_read_message_id)"
      )
      .count<{ cnt: string }>("m.id as cnt")
      .first();

    return Number(row?.cnt || 0);
  },

  async unreadByChat(
    personId: number
  ): Promise<{ chat_id: number; unread: string }[]> {
    // returns [{ chat_id, unread }]
    return await db("order_chat_messages as m")
      .leftJoin("order_chat_reads as cr", function () {
        this.on("cr.chat_id", "=", "m.chat_id").andOn(
          "cr.person_id",
          "=",
          db.raw("?", [personId])
        );
      })
      .select("m.chat_id")
      .where("m.sender_id", "<>", personId)
      .andWhereRaw(
        "(cr.last_read_message_id IS NULL OR m.id > cr.last_read_message_id)"
      )
      .groupBy("m.chat_id")
      .count<{ chat_id: number; unread: string }[]>("m.id as unread");
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

import db from "../../db/db";
import {
  Message,
  MessageAttachment,
  DeliveryState,
} from "../../types/chat.types";

export const MessageModel = {
  async insertMessage(input: Partial<Message>): Promise<Message> {
    const [row] = await db<Message>("messages").insert(input).returning("*");
    return row;
  },
  async updateMessage(input: Partial<Message>, id: string) {
    await db<Message>("messages").update(input).where("id", id);
  },

  async insertAttachments(
    message_id: string,
    files: Array<
      Omit<MessageAttachment, "id" | "message_id" | "extra"> & { extra?: any }
    >
  ) {
    if (!files?.length) return;
    const rows = files.map((f) => ({
      ...f,
      message_id,
    }));
    await db<MessageAttachment>("message_attachments").insert(rows);
  },

  async addDelivery(
    message_id: string,
    state: DeliveryState,
    provider_code?: string | null,
    provider_message?: string | null
  ) {
    await db("message_delivery").insert({
      message_id,
      state,
      provider_code: provider_code ?? null,
      provider_message: provider_message ?? null,
      created_at: db.fn.now(),
    });
  },

  async getByConversation(
    conversation_id: number,
    limit = 50,
    before?: string
  ) {
    const q = db<Message>("messages")
      .where({ conversation_id })
      .orderBy("created_at", "asc")
      .limit(limit);
    if (before) q.andWhere("created_at", "<", before);
    return await q;
  },

  async getByExternalId(
    conversation_id: number,
    external_message_id: string
  ): Promise<Message | undefined> {
    return await db<Message>("messages")
      .where({ conversation_id, external_message_id })
      .first();
  },

  async getAttachmentsByMessageIds(
    ids: string[]
  ): Promise<MessageAttachment[]> {
    return await db<MessageAttachment>("message_attachments")
      .whereIn("message_id", ids)
      .select("*");
  },
  async getMessageById(id: string): Promise<Message | undefined> {
    return await db<Message>("messages").where("id", id).first();
  },
  async markRead(
    conversationId: number,
    personId: number,
    lastMessageId: number
  ) {
    await db.raw(
      `
      INSERT INTO conversation_reads (conversation_id, person_id, last_read_message_id, last_read_at)
      VALUES (?, ?, ?, NOW())
      ON CONFLICT (conversation_id, person_id) DO UPDATE SET
        last_read_message_id = GREATEST(
          COALESCE(conversation_reads.last_read_message_id, 0),
          EXCLUDED.last_read_message_id
        ),
        last_read_at = NOW()
    `,
      [conversationId, personId, lastMessageId]
    );
  },

  async unreadByConversation(personId: number) {
    return await db("conversations as c")
      .leftJoin("conversation_reads as cr", function () {
        this.on("cr.conversation_id", "=", "c.id").andOn(
          "cr.person_id",
          "=",
          db.raw("?", [personId])
        );
      })
      .select("c.id as conversation_id")
      .select(
        db.raw(`
        COALESCE((
          SELECT COUNT(1) FROM messages m
          WHERE m.conversation_id = c.id
            AND m.sender = 'contact'
            AND (cr.last_read_message_id IS NULL OR m.id::bigint > cr.last_read_message_id::bigint)
        ), 0) as unread
      `)
      );
  },
};

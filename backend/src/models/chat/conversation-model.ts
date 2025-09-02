import {
  Conversation,
  ConversationParticipant,
  ConversationStatus,
} from "../../types/chat.types";
import db from "../../db/db";

export const ConversationModel = {
  async findByChannelAndExternalId(
    channel_id: number,
    external_conversation_id: string
  ): Promise<Conversation | undefined> {
    return db<Conversation>("conversations")
      .where({ channel_id, external_conversation_id })
      .first();
  },

  async findById(id: number): Promise<Conversation | undefined> {
    return db<Conversation>("conversations as c")
      .where("c.id", id)
      .first()
      .leftJoin("channels as ch", "ch.id", "c.channel_id")
      .select("c.*", "ch.id as channel_id", "ch.provider");
  },

  async create(input: Partial<Conversation>): Promise<Conversation> {
    const [row] = await db<Conversation>("conversations")
      .insert(input)
      .returning("*");
    return row;
  },

  async updateLastMessageAt(id: number): Promise<void> {
    await db<Conversation>("conversations")
      .update({ last_message_at: db.fn.now(), updated_at: db.fn.now() })
      .where({ id });
  },

  async setStatus(id: number, status: ConversationStatus): Promise<void> {
    await db<Conversation>("conversations").update({ status }).where({ id });
  },

  async list(params: {
    status?: ConversationStatus;
    channel_id?: number;
    limit?: number;
    offset?: number;
  }): Promise<Conversation[]> {
    const q = db("conversations as c")
      .select(
        "c.*",
        db.raw(`COALESCE(ct.full_name, ct.username) as contact_name`),
        "ch.account_label",
        "ch.provider"
      )
      .leftJoin("conversation_participants as cp", function () {
        this.on("cp.conversation_id", "=", "c.id").andOnNotNull(
          "cp.contact_id"
        );
      })
      .leftJoin("contacts as ct", "ct.id", "cp.contact_id")
      .leftJoin("channels as ch", "ch.id", "c.channel_id")
      .groupBy(
        "c.id",
        "ct.full_name",
        "ct.username",
        "ch.account_label",
        "ch.provider"
      )
      .orderBy([{ column: "c.last_message_at", order: "desc", nulls: "last" }]);

    if (params.status) q.where("c.status", params.status);
    if (params.channel_id) q.where("c.channel_id", params.channel_id);
    if (params.limit) q.limit(params.limit);
    if (params.offset) q.offset(params.offset);

    return await q;
  },
  async getParticipantsByConversationsIds(
    ids: number[]
  ): Promise<ConversationParticipant[]> {
    return await db<ConversationParticipant>("conversation_participants")
      .whereIn("conversation_id", ids)
      .select("*");
  },

  async createParticipant(data: {
    conversation_id: number;
    contact_id: number | null;
    person_id: number | null;
    role: string;
    added_at: Date;
  }) {
    await db("conversation_participants")
      .insert(data)
      .onConflict(["conversation_id", "contact_id", "person_id"])
      .ignore();
  },
  async updateParticipant(data: {
    conversation_id: number;
    contact_id: number;
    person_id: number | null;
  }) {
    await db<ConversationParticipant>("conversation_participants")
      .where("conversation_id", data.conversation_id)
      .andWhere("contact_id", data.contact_id)
      .update({ person_id: data.person_id });
  },
};

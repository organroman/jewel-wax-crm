import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const exists = await knex.schema.hasTable("order_chat_reads");
  if (!exists) {
    await knex.schema.createTable("order_chat_reads", (t) => {
      t.integer("chat_id")
        .notNullable()
        .references("id")
        .inTable("order_chats")
        .onDelete("CASCADE");
      t.integer("person_id")
        .notNullable()
        .references("id")
        .inTable("persons")
        .onDelete("CASCADE");
      t.integer("last_read_message_id").nullable(); // points to order_chat_messages.id
      t.timestamp("last_read_at", { useTz: true }).defaultTo(knex.fn.now());
      t.primary(["chat_id", "person_id"]);
    });
  }

  // helpful indexes
  await knex.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'order_chat_reads_person_idx') THEN
        CREATE INDEX order_chat_reads_person_idx ON order_chat_reads(person_id);
      END IF;
    END $$;
  `);

  // (optional but recommended) indexes to speed counts
  await knex.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'order_chat_messages_chat_id_id_idx') THEN
        CREATE INDEX order_chat_messages_chat_id_id_idx ON order_chat_messages(chat_id, id);
      END IF;
    END $$;
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("order_chat_reads");
}

import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("order_chat_message_reads", (table) => {
    table
      .integer("chat_id")
      .notNullable()
      .references("id")
      .inTable("order_chats")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("order_chat_message_reads", (table) => {
    table.dropColumn("chat_id");
  });
}

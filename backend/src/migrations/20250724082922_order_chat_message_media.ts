import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("order_chat_message_media", (table) => {
    table.increments("id").primary();
    table
      .integer("message_id")
      .unsigned()
      .references("id")
      .inTable("order_chat_messages")
      .onDelete("CASCADE");
    table
      .integer("media_id")
      .unsigned()
      .references("id")
      .inTable("chat_media")
      .onDelete("CASCADE");
    table.unique(["message_id", "media_id"]);
  });

  await knex.schema.table("order_chat_messages", (table) => {
    table.dropColumn("media_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("order_chat_message_media");
  await knex.schema.table("order_chat_messages", (table) => {
    table
      .integer("media_id")
      .nullable()
      .references("id")
      .inTable("chat_media")
      .onDelete("SET NULL");
  });
}

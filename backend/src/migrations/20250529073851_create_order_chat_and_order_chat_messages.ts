import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("order_chats", function (table) {
    table.increments("id").primary();
    table
      .integer("order_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table
      .integer("creator_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("persons");
    table
      .integer("receiver_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("persons");
    table.timestamps(true, true);
  });

  await knex.schema.createTable("order_chat_messages", function (table) {
    table.increments("id").primary();
    table
      .integer("chat_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("order_chats")
      .onDelete("CASCADE");
    table
      .integer("sender_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("persons");
    table.text("text");
    table.string("image_url");
    table.boolean("is_read").defaultTo(false);
    table.timestamp("read_at");
    table.timestamp("sent_at").defaultTo(knex.fn.now());
    table.timestamps(true, true); // created_at, updated_at
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("order_chats");
  await knex.schema.dropTable("order_chat_messages");
}

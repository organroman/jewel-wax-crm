import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("order_chat_message_reactions");
  await knex.schema.dropTableIfExists("order_chat_message_reads");
  await knex.schema.dropTableIfExists("order_chat_messages");
  await knex.schema.dropTableIfExists("order_chats");
  await knex.schema.dropTableIfExists("chat_media");

  // 1. order_chats
  await knex.schema.createTable("order_chats", (table) => {
    table.increments("id").primary();
    table
      .integer("order_id")
      .notNullable()
      .references("id")
      .inTable("orders")
      .onDelete("CASCADE");
    table
      .enu("type", ["modeller", "miller", "printer"], {
        useNative: true,
        enumName: "chat_type",
      })
      .defaultTo("modeller");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // 2. chat_media
  await knex.schema.createTable("chat_media", (table) => {
    table.increments("id").primary();
    table
      .integer("uploader_id")
      .notNullable()
      .references("id")
      .inTable("persons")
      .onDelete("CASCADE");
    table.enu("type", ["image", "file", "video", "audio"], {
      useNative: true,
      enumName: "chat_media_type",
    });
    table.text("url").notNullable();
    table.text("name");
    table.integer("size");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // 3. order_chat_messages
  await knex.schema.createTable("order_chat_messages", (table) => {
    table.increments("id").primary();
    table
      .integer("chat_id")
      .notNullable()
      .references("id")
      .inTable("order_chats")
      .onDelete("CASCADE");
    table
      .integer("sender_id")
      .notNullable()
      .references("id")
      .inTable("persons")
      .onDelete("CASCADE");
    table.text("message").nullable();
    table
      .integer("media_id")
      .nullable()
      .references("id")
      .inTable("chat_media")
      .onDelete("SET NULL");
    table
      .integer("reply_to_message_id")
      .nullable()
      .references("id")
      .inTable("order_chat_messages")
      .onDelete("SET NULL");
    table.boolean("is_edited").defaultTo(false);
    table.boolean("is_deleted").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // 4. order_chat_message_reads
  await knex.schema.createTable("order_chat_message_reads", (table) => {
    table.increments("id").primary();
    table
      .integer("message_id")
      .notNullable()
      .references("id")
      .inTable("order_chat_messages")
      .onDelete("CASCADE");
    table
      .integer("reader_id")
      .notNullable()
      .references("id")
      .inTable("persons")
      .onDelete("CASCADE");
    table.timestamp("read_at").defaultTo(knex.fn.now());
    table.unique(["message_id", "reader_id"]);
  });

  // 5. order_chat_message_reactions
  await knex.schema.createTable("order_chat_message_reactions", (table) => {
    table.increments("id").primary();
    table
      .integer("message_id")
      .notNullable()
      .references("id")
      .inTable("order_chat_messages")
      .onDelete("CASCADE");
    table
      .integer("person_id")
      .notNullable()
      .references("id")
      .inTable("persons")
      .onDelete("CASCADE");
    table.text("reaction").notNullable().defaultTo("like");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.unique(["message_id", "person_id", "reaction"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("order_chat_message_reactions");
  await knex.schema.dropTableIfExists("order_chat_message_reads");
  await knex.schema.dropTableIfExists("order_chat_messages");
  await knex.schema.dropTableIfExists("order_chats");
  await knex.schema.dropTableIfExists("chat_media");

  await knex.raw("DROP TYPE IF EXISTS chat_type");
  await knex.raw("DROP TYPE IF EXISTS chat_media_type");
}

import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("request_participants");

  // --- Enums ---
  await knex.raw(
    `CREATE TYPE message_direction AS ENUM ('inbound','outbound')`
  );
  await knex.raw(
    `CREATE TYPE sender_type AS ENUM ('contact','agent','system')`
  );
  await knex.raw(
    `CREATE TYPE conversation_status AS ENUM ('open','pending','snoozed','closed')`
  );
  await knex.raw(
    `CREATE TYPE delivery_state AS ENUM ('queued','sent','delivered','read','failed')`
  );
  await knex.raw(
    `CREATE TYPE content_kind AS ENUM ('text','image','file','audio','video','location','other')`
  );

  // --- Channels ---
  await knex.schema.createTable("channels", (t) => {
    t.increments("id").primary();
    t.string("provider", 40).notNullable(); // telegram, whatsapp, etc.
    t.string("account_label", 100).notNullable();
    t.string("external_account_id", 120).notNullable();
    t.boolean("is_active").notNullable().defaultTo(true);
    t.jsonb("settings").notNullable().defaultTo("{}");
    t.timestamps(true, true);
    t.unique(["provider", "external_account_id"]);
  });

  // --- Conversations ---
  await knex.schema.createTable("conversations", (t) => {
    t.increments("id").primary();
    t.integer("channel_id")
      .references("id")
      .inTable("channels")
      .onDelete("CASCADE")
      .notNullable();
    t.string("external_conversation_id", 150);
    t.enu("status", null, {
      useNative: true,
      existingType: true,
      enumName: "conversation_status",
    })
      .notNullable()
      .defaultTo("open");
    t.string("subject", 200);
    t.timestamp("last_message_at");
    t.timestamps(true, true);
    t.unique(["channel_id", "external_conversation_id"]);
  });

  // --- Conversation participants ---
  await knex.schema.createTable("conversation_participants", (t) => {
    t.increments("id").primary();
    t.integer("conversation_id")
      .references("id")
      .inTable("conversations")
      .onDelete("CASCADE")
      .notNullable();
    t.integer("contact_id")
      .references("id")
      .inTable("contacts")
      .onDelete("SET NULL");
    t.integer("person_id")
      .references("id")
      .inTable("persons")
      .onDelete("SET NULL");
    t.string("role", 20).notNullable().defaultTo("member"); // member/admin/assignee
    t.timestamp("added_at").defaultTo(knex.fn.now());
    t.unique(["conversation_id", "contact_id", "person_id"]);
  });

  // --- Messages ---
  await knex.schema.createTable("messages", (t) => {
    t.bigIncrements("id").primary();
    t.integer("conversation_id")
      .references("id")
      .inTable("conversations")
      .onDelete("CASCADE")
      .notNullable();
    t.enu("direction", null, {
      useNative: true,
      existingType: true,
      enumName: "message_direction",
    }).notNullable();
    t.enu("sender", null, {
      useNative: true,
      existingType: true,
      enumName: "sender_type",
    }).notNullable();
    t.integer("sender_contact_id")
      .references("id")
      .inTable("contacts")
      .onDelete("SET NULL");
    t.integer("sender_person_id")
      .references("id")
      .inTable("persons")
      .onDelete("SET NULL");
    t.string("external_message_id", 150);
    t.enu("content_kind", null, {
      useNative: true,
      existingType: true,
      enumName: "content_kind",
    })
      .notNullable()
      .defaultTo("text");
    t.text("body");
    t.jsonb("metadata").notNullable().defaultTo("{}");
    t.timestamp("sent_at");
    t.timestamps(true, true);
    t.unique(["conversation_id", "external_message_id"]);
    t.check(
      `(sender = 'contact' AND sender_contact_id IS NOT NULL AND sender_person_id IS NULL)
       OR (sender = 'agent' AND sender_person_id IS NOT NULL AND sender_contact_id IS NULL)
       OR (sender = 'system' AND sender_contact_id IS NULL AND sender_person_id IS NULL)`
    );
  });

  // --- Message attachments ---
  await knex.schema.createTable("message_attachments", (t) => {
    t.bigIncrements("id").primary();
    t.bigInteger("message_id")
      .references("id")
      .inTable("messages")
      .onDelete("CASCADE")
      .notNullable();
    t.text("url").notNullable();
    t.string("mime", 120);
    t.string("file_name", 255);
    t.integer("byte_size");
    t.integer("width");
    t.integer("height");
    t.integer("duration_ms");
    t.jsonb("extra").notNullable().defaultTo("{}");
  });

  // --- Message delivery states (outbound only) ---
  await knex.schema.createTable("message_delivery", (t) => {
    t.bigIncrements("id").primary();
    t.bigInteger("message_id")
      .references("id")
      .inTable("messages")
      .onDelete("CASCADE")
      .notNullable();
    t.enu("state", null, {
      useNative: true,
      existingType: true,
      enumName: "delivery_state",
    }).notNullable();
    t.string("provider_code", 60);
    t.text("provider_message");
    t.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("message_delivery");
  await knex.schema.dropTableIfExists("message_attachments");
  await knex.schema.dropTableIfExists("messages");
  await knex.schema.dropTableIfExists("conversation_participants");
  await knex.schema.dropTableIfExists("conversations");
  await knex.schema.dropTableIfExists("channels");

  await knex.raw(`DROP TYPE IF EXISTS delivery_state`);
  await knex.raw(`DROP TYPE IF EXISTS content_kind`);
  await knex.raw(`DROP TYPE IF EXISTS sender_type`);
  await knex.raw(`DROP TYPE IF EXISTS message_direction`);
  await knex.raw(`DROP TYPE IF EXISTS conversation_status`);
}

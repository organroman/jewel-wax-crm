import type { Knex } from "knex";

export const config = { transaction: false };

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("request_participants");
  await knex.schema.dropTableIfExists("requests");
  await knex.schema.dropTableIfExists("contacts");

  // Contacts table
  await knex.schema.createTable("contacts", (table) => {
    table.increments("id").primary();
    table.enu(
      "source",
      [
        "telegram",
        "viber",
        "facebook",
        "instagram",
        "whatsapp",
        "form",
        "manual",
      ],
      {
        useNative: true,
        enumName: "contact_source",
      }
    );
    table.string("external_id", 100).notNullable(); // e.g., chat_id
    table.string("username", 100);
    table.string("full_name", 150);
    table.string("phone", 20);
    table
      .integer("person_id")
      .references("id")
      .inTable("persons")
      .onDelete("SET NULL");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.unique(["source", "external_id"]);
  });

  // Requests table
  await knex.schema.createTable("requests", (table) => {
    table.increments("id").primary();
    table.text("message").notNullable();
    table.enu(
      "source",
      [
        "telegram",
        "viber",
        "facebook",
        "instagram",
        "whatsapp",
        "form",
        "manual",
      ],
      {
        useNative: true,
        enumName: "request_source",
      }
    );
    table
      .enu("status", ["new", "in_progress", "done", "canceled"], {
        useNative: true,
        enumName: "request_status",
      })
      .notNullable()
      .defaultTo("new");
    table
      .integer("contact_id")
      .references("id")
      .inTable("contacts")
      .onDelete("SET NULL");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // Participants table
  await knex.schema.createTable("request_participants", (table) => {
    table.increments("id").primary();
    table
      .integer("request_id")
      .references("id")
      .inTable("requests")
      .onDelete("CASCADE");
    table
      .integer("contact_id")
      .references("id")
      .inTable("contacts")
      .onDelete("CASCADE");
    table.timestamp("added_at").defaultTo(knex.fn.now());

    table.unique(["request_id", "contact_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("request_participants");
  await knex.schema.dropTableIfExists("requests");
  await knex.schema.dropTableIfExists("contacts");

  await knex.raw(`DROP TYPE IF EXISTS contact_source`);
  await knex.raw(`DROP TYPE IF EXISTS request_source`);
  await knex.raw(`DROP TYPE IF EXISTS request_status`);
}

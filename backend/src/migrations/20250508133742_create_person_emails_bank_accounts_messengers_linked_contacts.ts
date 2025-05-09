import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("person_emails", function (table) {
    table.increments("id").primary();
    table
      .integer("person_id")
      .references("id")
      .inTable("persons")
      .onDelete("CASCADE");
    table.string("email").notNullable();
    table.boolean("is_main").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("person_messengers", (table) => {
    table.increments("id").primary();

    table
      .integer("person_id")
      .references("id")
      .inTable("persons")
      .onDelete("CASCADE");

    table
      .integer("phone_id")
      .references("id")
      .inTable("phones")
      .onDelete("CASCADE");

    table
      .enu("platform", null, {
        useNative: true,
        existingType: true,
        enumName: "contact_source",
      })
      .notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.unique(["person_id", "phone_id", "platform"]);
  });

  await knex.schema.createTable("person_bank_accounts", function (table) {
    table.increments("id").primary();

    table
      .integer("person_id")
      .references("id")
      .inTable("persons")
      .onDelete("CASCADE");

    table.string("bank_name"); // e.g. Monobank, PrivatBank
    table.string("bank_code"); // MFO, optional
    table.string("tax_id"); // ЄДРПОУ / ІПН
    table.string("iban"); // Preferred if full bank transfer
    table.string("card_number"); // Optional if card transfer
    table.boolean("is_main").defaultTo(false);

    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.unique(["person_id", "card_number"]);
  });

  await knex.schema.createTable("person_contacts", function (table) {
    table.increments("id").primary();
    table
      .integer("person_id")
      .references("id")
      .inTable("persons")
      .onDelete("CASCADE");
    table
      .integer("contact_id")
      .references("id")
      .inTable("contacts")
      .onDelete("SET NULL");
    table.string("relation_type"); // e.g., "представник"
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.unique(["person_id", "contact_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("person_emails");
  await knex.schema.dropTableIfExists("person_messengers");
  await knex.schema.dropTableIfExists("person_bank_accounts");
  await knex.schema.dropTableIfExists("person_contacts");
}

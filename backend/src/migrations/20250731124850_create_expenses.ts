import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    ALTER TYPE payment_method ADD VALUE IF NOT EXISTS 'bank_transfer';
  `);

  await knex.schema.createTable("expenses", (table) => {
    table.increments("id").primary();
    table
      .integer("order_id")
      .unsigned()
      .references("id")
      .inTable("orders")
      .onDelete("SET NULL");

    table
      .integer("related_person_id")
      .unsigned()
      .references("id")
      .inTable("persons")
      .onDelete("SET NULL");

    table
      .enu(
        "category",
        ["modelling", "printing", "milling", "materials", "other"],
        {
          useNative: true,
          enumName: "expenses_category",
        }
      )
      .notNullable();

    table
      .enu("payment_method", null, {
        useNative: true,
        enumName: "payment_method",
        existingType: true,
      })
      .notNullable()
      .defaultTo("cash");

    table.decimal("amount", 12, 2).notNullable();

    table.text("description").nullable();

    table
      .integer("created_by")
      .unsigned()
      .references("id")
      .inTable("persons")
      .onDelete("SET NULL");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("expenses");
}

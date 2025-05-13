import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("delivery_addresses", (table) => {
    table.boolean("is_main").notNullable().defaultTo(false);
  });

  await knex.raw(`
    CREATE UNIQUE INDEX delivery_addresses_one_main_per_person
    ON delivery_addresses (person_id)
    WHERE is_main = TRUE
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`DROP INDEX IF EXISTS delivery_addresses_one_main_per_person`);

  await knex.schema.alterTable("delivery_addresses", (table) => {
    table.dropColumn("is_main");
  });
}

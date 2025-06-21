import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("delivery_addresses", (table) => {
    table.integer("person_id").unsigned().nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("delivery_addresses", (table) => {
    table.integer("person_id").unsigned().notNullable().alter();
  });
}

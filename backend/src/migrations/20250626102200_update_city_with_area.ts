import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("cities", (table) => {
    table.string("region").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("cities", (table) => {
    table.dropColumn("region");
  });
}

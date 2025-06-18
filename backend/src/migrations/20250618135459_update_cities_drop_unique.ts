import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("cities", (table) => {
    table.dropUnique(["area_ref"], "cities_area_ref_unique");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("cities", (table) => {
    table.unique(["area_ref"], "cities_area_ref_unique");
  });
}

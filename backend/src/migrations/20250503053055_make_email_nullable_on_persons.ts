import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("persons", (table) => {
    table.string("email").nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("persons", (table) => {
    table.string("email").notNullable().alter();
  });
}
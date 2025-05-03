import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  
    await knex.schema.alterTable("persons", (table) => {
    table.dropColumn("full_name");
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.string("patronymic").nullable();
  });

  await knex.schema.createTable("phones", (table) => {
    table.increments("id").primary();
    table
      .integer("person_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("persons")
      .onDelete("CASCADE");

    table.string("number").notNullable();
    table.boolean("is_main").defaultTo(false);

    table.timestamps(true, true);

    knex.raw("CREATE UNIQUE INDEX one_main_phone_per_person ON phones(person_id) WHERE is_main = true");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("phones");

  await knex.schema.alterTable("persons", (table) => {
    table.dropColumns("first_name", "last_name", "patronymic");
    table.string("full_name").notNullable();
  });
}


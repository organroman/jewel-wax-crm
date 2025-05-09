import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("contacts", (table) => {
    table.string("avatar_url");
  });

  await knex.schema.alterTable("persons", (table) => {
    table.string("avatar_url").nullable();
  });

  await knex.schema.createTable("countries", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable().unique();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("cities", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table
      .integer("country_id")
      .references("id")
      .inTable("countries")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.unique(["name", "country_id"]);
  });

  await knex.schema.createTable("person_locations", (table) => {
    table.increments("id").primary();
    table
      .integer("person_id")
      .references("id")
      .inTable("persons")
      .onDelete("CASCADE");
    table
      .integer("city_id")
      .references("id")
      .inTable("cities")
      .onDelete("CASCADE");
    table.boolean("is_main").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.unique(["person_id", "city_id"]);
  });

  await knex.schema.alterTable("persons", (table) => {
    table.dropColumn("city"); // remove old city string field
    table.dropColumn("email");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("contacts", (table) => {
    table.string("avatar_url");
  });
  await knex.schema.alterTable("persons", (table) => {
    table.string("city"); // add city field back
    table.string("email");
    table.dropColumn("avatar_url");
  });

  await knex.schema.dropTableIfExists("person_locations");
  await knex.schema.dropTableIfExists("cities");
  await knex.schema.dropTableIfExists("countries");
}

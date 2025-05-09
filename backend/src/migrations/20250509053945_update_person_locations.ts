import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("person_locations", (table) => {
    table.dropUnique(["person_id", "city_id"]);
    // table.dropColumn("city_id");

    // Add country_id and city_id
    table
      .integer("country_id")
      .references("id")
      .inTable("countries")
      .onDelete("CASCADE")
      .notNullable();



    // Recreate unique constraint to avoid duplicate location rows
    table.unique(["person_id", "country_id", "city_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
     await knex.schema.alterTable("person_locations", (table) => {
       table.dropUnique(["person_id", "country_id", "city_id"]);
       table.dropColumn("country_id");
       table.dropColumn("city_id");

       table
         .integer("city_id")
         .references("id")
         .inTable("cities")
         .onDelete("CASCADE");

       table.unique(["person_id", "city_id"]);
     });
}

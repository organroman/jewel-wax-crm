import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
     await knex.schema.createTable("contacts", (table) => {
       table.increments("id").primary();
       table
         .enu("source", ["telegram", "viber", "facebook", "form", "manual"])
         .notNullable();
       table.string("external_id", 100).notNullable(); // e.g., chat_id
       table.string("username", 100);
       table.string("full_name", 150);
       table.string("phone", 20);
       table
         .integer("person_id")
         .references("id")
         .inTable("persons")
         .onDelete("SET NULL");
       table.timestamp("created_at").defaultTo(knex.fn.now());

       table.unique(["source", "external_id"]);
     });

      await knex.schema.createTable("requests", (table) => {
        table.increments("id").primary();
        table.text("message").notNullable();
        table
          .enu("source", ["telegram", "viber", "facebook", "instagram", "whatsapp", "form", "manual"])
          .notNullable();
        table
          .integer("person_id")
          .references("id")
          .inTable("persons")
          .onDelete("SET NULL");
        table
          .integer("contact_id")
          .references("id")
          .inTable("contacts")
          .onDelete("SET NULL");
        table.integer("score");
        table.boolean("is_qualified").defaultTo(false);
        table.timestamp("created_at").defaultTo(knex.fn.now());
      });

}


export async function down(knex: Knex): Promise<void> {
     await knex.schema.dropTableIfExists("requests");
     await knex.schema.dropTableIfExists("contacts");
}


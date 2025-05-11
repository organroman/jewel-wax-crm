import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("enums", (table) => {
    table.increments("id").primary();
    table.string("type").notNullable();
    table.string("value").notNullable();
    table.string("label").notNullable(); 
    table.integer("sort_order").defaultTo(0);
    table.boolean("is_active").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    table.unique(["type", "value"]);
  });

  await knex.schema.raw(`
    CREATE INDEX idx_enums_type_value ON enums (type, value);
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("enums");
}

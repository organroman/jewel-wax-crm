import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("order_stage_statuses");
  await knex.schema.dropTableIfExists("order_services");
  await knex.schema.alterTable("orders", (table) => {
    table.integer("modeller_id").unsigned().references("id").inTable("persons");
    table.decimal("modeling_cost", 10, 2).defaultTo(0.0);
    table.integer("miller_id").unsigned().references("id").inTable("persons");
    table.decimal("milling_cost", 10, 2).defaultTo(0.0);
    table.integer("printer_id").unsigned().references("id").inTable("persons");
    table.decimal("printing_cost", 10, 2).defaultTo(0.0);
    table.enu("stage_new_status", null, {
      useNative: true,
      existingType: true,
      enumName: "order_stage_status",
    });
    table.timestamp("stage_new_completed_at");
    table.enu("stage_modeling_status", null, {
      useNative: true,
      existingType: true,
      enumName: "order_stage_status",
    });
    table.timestamp("stage_modeling_completed_at");
    table.enu("stage_milling_status", null, {
      useNative: true,
      existingType: true,
      enumName: "order_stage_status",
    });
    table.timestamp("stage_milling_completed_at");
    table.enu("stage_printing_status", null, {
      useNative: true,
      existingType: true,
      enumName: "order_stage_status",
    });
    table.timestamp("stage_printing_completed_at");
    table.enu("stage_done_status", null, {
      useNative: true,
      existingType: true,
      enumName: "order_stage_status",
    });
    table.timestamp("stage_done_completed_at");
  });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("orders", (table) => {
      table.dropColumn("modeller_id");
      table.dropColumn("modeling_cost");
      table.dropColumn("miller_id");
      table.dropColumn("milling_cost");
      table.dropColumn("printer_id");
      table.dropColumn("printing_cost");

      table.dropColumn("stage_new_status");
      table.dropColumn("stage_new_completed_at");

      table.dropColumn("stage_modeling_status");
      table.dropColumn("stage_modeling_completed_at");

      table.dropColumn("stage_milling_status");
      table.dropColumn("stage_milling_completed_at");

      table.dropColumn("stage_printing_status");
      table.dropColumn("stage_printing_completed_at");

      table.dropColumn("stage_done_status");
      table.dropColumn("stage_done_completed_at");
    });

    await knex.schema.createTable("order_services", (table) => {
      table.increments("id").primary();
      table
        .integer("order_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("orders")
        .onDelete("CASCADE");
      table.string("stage").notNullable(); 
      table.integer("person_id").unsigned().references("id").inTable("persons");
      table.decimal("cost", 10, 2).defaultTo(0.0);
    });

    await knex.schema.createTable("order_stage_statuses", (table) => {
      table.increments("id").primary();
      table
        .integer("order_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("orders")
        .onDelete("CASCADE");
      table.string("stage").notNullable();
      table.enu("status", null, {
        useNative: true,
        existingType: true,
        enumName: "order_stage_status",
      });
      table.timestamp("completed_at");
    });
}

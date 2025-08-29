import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("conversation_reads", (t) => {
    t.integer("conversation_id")
      .notNullable()
      .references("id")
      .inTable("conversations")
      .onDelete("CASCADE");

    t.integer("person_id")
      .notNullable()
      .references("id")
      .inTable("persons")
      .onDelete("CASCADE");

    t.bigInteger("last_read_message_id").nullable();
    t.timestamp("last_read_at", { useTz: true }).defaultTo(knex.fn.now());

    t.primary(["conversation_id", "person_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("conversation_reads");
}

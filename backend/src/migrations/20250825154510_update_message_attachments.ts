import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("message_attachments", (table) => {
    table.dropColumn("mime");
    table.dropColumn("file_name");
    table.dropColumn("byte_size");
    table.dropColumn("width");
    table.dropColumn("height");
    table.dropColumn("duration_ms");
    table.enu("type", ["image", "file", "video", "audio"], {
      useNative: true,
      existingType: true,
      enumName: "chat_media_type",
    });
    table.text("name");
    table.integer("size");
    table.string("public_id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("message_attachments", (table) => {
    table.string("mime", 120);
    table.string("file_name", 255);
    table.integer("byte_size");
    table.integer("width");
    table.integer("height");
    table.integer("duration_ms");
    table.dropColumn("type");
    table.dropColumn("name");
    table.dropColumn("size");
    table.dropColumn("public_id");
  });
}

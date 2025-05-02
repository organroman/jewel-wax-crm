
import db from "../db/db";

export const EnumModel = {
  async getEnumValues(
    enumName: string
  ): Promise<{ value: string; label: string }[]> {
    const result = await db.raw(`SELECT unnest(enum_range(NULL::${enumName}))`);
    return result.rows.map((r: { unnest: string }) => r.unnest);
  },
};

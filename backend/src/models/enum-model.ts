import { EnumItem } from "../types/shared.types";
import db from "../db/db";

export const EnumModel = {
  async getEnum(enumType: string): Promise<EnumItem[]> {
    const enums = await db<EnumItem>("enums")
      .where("type", enumType)
      .select("label", "value", "type")
      .orderBy("sort_order", "asc");
    return enums;
  },
  async getAllEnums(): Promise<EnumItem[]> {
    const enums = await db<EnumItem>("enums")
      .select("label", "value", "type")
      .orderBy([
        { column: "type", order: "asc" },
        { column: "sort_order", order: "asc" },
      ]);

    return enums;
  },

  async getAllEnumsGrouped(): Promise<Record<string, EnumItem[]>> {
    const raw = await this.getAllEnums();

    return raw.reduce<Record<string, EnumItem[]>>((acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    }, {});
  },
};

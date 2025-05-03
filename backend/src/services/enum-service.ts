import { EnumModel } from "../models/enum-model";

export const EnumService = {
  async getUserRoles() {
    const values = await EnumModel.getEnumValues("person_role");
    return values.map((value) => ({
      value,
    }));
  },
};

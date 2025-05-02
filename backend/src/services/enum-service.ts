import { EnumModel } from "../models/enum-model";
import { formatLabel } from "../utils/helpers";

export const EnumService = {
  async getUserRoles() {
    const values = await EnumModel.getEnumValues("user_role");
    return values.map((value) => ({
      value,
      label: formatLabel(value),
    }));
  },
};

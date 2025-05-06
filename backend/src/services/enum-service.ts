import { EnumModel } from "../models/enum-model";

export const EnumService = {
  async getUserRoles() {
    const values = await EnumModel.getEnumValues("person_role");
    return values.map((value) => ({
      value,
    }));
  },
  async getRequestStatuses() {
    const values = await EnumModel.getEnumValues("request_status");
    return values;
  },
  async getRequestSources() {
    const values = await EnumModel.getEnumValues("request_source");
    return values;
  },
  async getContactSources() {
    const values = await EnumModel.getEnumValues("contact_source");
    return values;
  },
};

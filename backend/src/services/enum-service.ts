import { EnumModel } from "../models/enum-model";

export const EnumService = {
  async getAllEnumsGrouped() {
    return await EnumModel.getAllEnumsGrouped();
  },
  async getUserRoles() {
    const values = await EnumModel.getEnum("person_role");
    return values.map((value) => ({
      value,
    }));
  },
  async getRequestStatuses() {
    const values = await EnumModel.getEnum("request_status");
    return values;
  },
  async getRequestSources() {
    const values = await EnumModel.getEnum("request_source");
    return values;
  },
  async getContactSources() {
    const values = await EnumModel.getEnum("contact_source");
    return values;
  },
};

import { Channel, Provider } from "../../types/chat.types";
import db from "../../db/db";

export const ChannelModel = {
  async getByProviderAndExternalId(
    provider: Provider | string,
    external_id: string
  ): Promise<Channel | undefined> {
    return db<Channel>("channels")
      .where({ provider, external_account_id: external_id })
      .first();
  },
  async getById(id: number): Promise<Channel | undefined> {
    return db<Channel>("channels").where({ id }).first();
  },
};

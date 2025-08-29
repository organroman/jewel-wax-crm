import {
  Contact,
  ContactSource,
  CreateContactInput,
  GetAllContactsOptions,
  UpdateContactInput,
} from "../types/contact.types";
import { PaginatedResult } from "../types/shared.types";

import db from "../db/db";
import { paginateQuery } from "../utils/pagination";

export const ContactModel = {
  async findByExternalId(
    source: ContactSource,
    external_id: string
  ): Promise<Contact | undefined> {
    return db<Contact>("contacts").where({ source, external_id }).first();
  },

  async create(data: CreateContactInput): Promise<Contact> {
    const [contact] = await db<Contact>("contacts").insert(data).returning("*");
    return contact;
  },

  async getAll({
    page,
    limit,
    filters,
    search,
    sortBy,
    order,
  }: GetAllContactsOptions): Promise<PaginatedResult<Contact>> {
    const baseQuery = db<Contact>("contacts").select("*");

    if (filters?.source) baseQuery.where("source", filters.source);

    if (search) {
      baseQuery.where((qb) => {
        qb.whereILike("username", `%${search}%`)
          .orWhereILike("full_name", `%${search}%`)
          .orWhereILike("phone", `%${search}%`);
      });
    }

    return await paginateQuery<Contact>(baseQuery, {
      page,
      limit,
      sortBy,
      order,
    });
  },
  async getContactsByIds(ids: number[]): Promise<Contact[]> {
    return await db<Contact>("contacts").whereIn("id", ids).select("*");
  },
  async findById(contactId: number): Promise<Contact | null> {
    const [contact] = await db<Contact>("contacts")
      .where("id", contactId)
      .select("*");

    return contact;
  },
  async update(contactId: number, data: UpdateContactInput): Promise<Contact> {
    const [updatedContact] = await db<Contact>("contacts")
      .where("id", contactId)
      .update({ ...data, updated_at: new Date() })
      .returning("*");

    return updatedContact;
  },

  async delete(contactId: number): Promise<number> {
    return await db<Contact>("contacts").where("id", contactId).del();
  },
};

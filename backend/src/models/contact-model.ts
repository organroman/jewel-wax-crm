import {
  Contact,
  ContactSource,
  CreateContactInput,
  GetAllContactsOptions,
  UpdateContactInput,
} from "../types/contact.types";
import { PaginatedResult } from "../types/shared.types";

import db from "../db/db";

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
    page = 1,
    limit = 10,
    filters = {},
    search,
    sortBy = "created_at",
    order = "desc",
  }: GetAllContactsOptions): Promise<PaginatedResult<Contact>> {
    const offset = (page - 1) * limit;
    const baseQuery = db<Contact>("contacts").select("*");

    if (filters.source) baseQuery.where("source", filters.source);

    if (search) {
      baseQuery.where((qb) => {
        qb.whereILike("username", `%${search}%`)
          .orWhereILike("full_name", `%${search}%`)
          .orWhereILike("phone", `%${search}%`);
      });
    }

    const countQuery = baseQuery.clone().clearSelect().count("*");

    baseQuery.offset(offset).limit(limit).orderBy(sortBy, order);

    const contacts = await baseQuery;
    const countResult = await countQuery;
    const total = parseInt(countResult[0]);

    return {
      data: contacts,
      total,
      limit,
      page,
    };
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

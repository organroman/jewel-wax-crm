import { PaginatedResult } from "../types/shared.types";
import {
  CreateRequestInput,
  GetAllRequestOptions,
  Request,
  RequestWithContact,
  UpdateRequestInput,
} from "../types/request.types";
import db from "../db/db";
import { paginateQuery } from "../utils/pagination";

export const RequestModel = {
  async getAll({
    page,
    limit,
    filters,
    search,
    sortBy = "created_at",
    order = "desc",
  }: GetAllRequestOptions): Promise<PaginatedResult<RequestWithContact>> {
    const baseQuery = db("requests")
      .select(
        "requests.*",
        "contacts.full_name as contact_full_name",
        "contacts.username as contact_username",
        "contacts.phone as contact_phone"
      )
      .leftJoin("contacts", "contacts.id", "requests.contact_id");

    if (filters?.source) baseQuery.where("source", filters.source);
    if (filters?.status) baseQuery.where("status", filters.status);

    if (search) {
      baseQuery.where((qb) => {
        qb.whereILike("requests.message", `%${search}%`)
          .orWhereILike("contacts.full_name", `%${search}%`)
          .orWhereILike("contacts.username", `%${search}%`)
          .orWhereILike("contacts.phone", `%${search}%`);
      });
    }

    return await paginateQuery<RequestWithContact>(baseQuery, {
      page,
      limit,
      sortBy,
      order,
    });
  },

  async findById(requestId: number): Promise<Request | null> {
    const [request] = await db<Request>("requests")
      .where("id", requestId)
      .select("*");
    return request;
  },
  async findByContactId(contactId: number): Promise<Request[]> {
    return await db<Request>("requests")
      .where("contact_id", contactId)
      .orderBy("created_at", "desc");
  },
  async exists(message: string, contactId?: number): Promise<boolean> {
    const exists = await db("requests")
      .where({ contact_id: contactId, message })
      .andWhere("created_at", ">", db.raw("NOW() - INTERVAL '10 minutes'"))
      .first();

    return !!exists;
  },

  async create(data: CreateRequestInput): Promise<Request> {
    const [request] = await db<Request>("requests").insert(data).returning("*");
    return request;
  },

  async getWithContact(requestId: number): Promise<any | null> {
    return await db("requests")
      .leftJoin("contacts", "requests.contact_id", "contacts.id")
      .select(
        "requests.*",
        "contacts.full_name",
        "contacts.phone",
        "contacts.username"
      )
      .where("requests.id", requestId)
      .first();
  },

  async update(requestId: number, data: UpdateRequestInput): Promise<Request> {
    const [updatedRequest] = await db<Request>("requests")
      .where("id", requestId)
      .update({ ...data, updated_at: new Date() })
      .returning("*");

    return updatedRequest;
  },

  async delete(requestId: number): Promise<number> {
    return await db<Request>("requests").where("id", requestId).del();
  },
};

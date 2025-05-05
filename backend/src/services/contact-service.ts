import { PaginatedResult } from "../types/shared.types";
import {
  Contact,
  CreateContactInput,
  GetAllContactsOptions,
  UpdateContactInput,
} from "../types/contact.types";

import { ContactModel } from "../models/contact-model";
import { ActivityLogModel } from "../models/activity-log-model";

import { LOG_ACTIONS } from "../constants/activity-log";
import { LOG_TARGETS } from "../constants/activity-log";

export const ContactService = {
  async getAll({
    page,
    limit,
    filters,
    search,
    sortBy,
    order,
  }: GetAllContactsOptions): Promise<PaginatedResult<Contact>> {
    return await ContactModel.getAll({
      page,
      limit,
      filters,
      search,
      sortBy,
      order,
    });
  },

  async getById(contactId: number): Promise<Contact | null> {
    return await ContactModel.findById(contactId);
  },

  async findOrCreate(data: CreateContactInput, authorId?: number) {
    const existing = await ContactModel.findByExternalId(
      data.source,
      data.external_id
    );

    if (existing) return existing;

    const contact = await ContactModel.create(data);

    if (data.source === "manually") {
      await ActivityLogModel.logAction({
        actor_id: authorId || null,
        action: LOG_ACTIONS.CREATE_CONTACT,
        target_type: LOG_TARGETS.CONTACT,
        target_id: contact.id,
        details: {
          contact,
        },
      });
    }
    return contact;
  },

  async update(
    contactId: number,
    data: UpdateContactInput,
    actorId?: number
  ): Promise<Contact> {
    const updatedContact = await ContactModel.update(contactId, data);

    await ActivityLogModel.logAction({
      actor_id: actorId || null,
      action: LOG_ACTIONS.UPDATE_CONTACT,
      target_type: LOG_TARGETS.CONTACT,
      target_id: contactId,
      details: {
        data,
      },
    });

    return updatedContact;
  },

  async delete(contactId: number, actorId?: number): Promise<number> {
    const result = await ContactModel.delete(contactId);

    await ActivityLogModel.logAction({
      actor_id: actorId || null,
      action: LOG_ACTIONS.DELETE_CONTACT,
      target_type: LOG_TARGETS.CONTACT,
      target_id: contactId,
    });

    return result;
  },
};

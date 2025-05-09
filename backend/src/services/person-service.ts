import {
  CreatePersonInput,
  GetAllPersonsOptions,
  SafePerson,
  UpdatePersonInput,
} from "../types/person.types";
import { PaginatedResult } from "../types/shared.types";

import bcryptjs from "bcryptjs";

import { PersonModel } from "../models/person-model";
import { ActivityLogModel } from "../models/activity-log-model";

import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";
import { LOG_ACTIONS, LOG_TARGETS } from "../constants/activity-log";

export const PersonService = {
  async getAll({
    page,
    limit,
    filters,
    search,
    sortBy,
    order,
  }: GetAllPersonsOptions): Promise<PaginatedResult<SafePerson>> {
    return await PersonModel.getAll({
      page,
      limit,
      filters,
      search,
      sortBy,
      order,
    });
  },

  async getById(userId: number): Promise<SafePerson | null> {
    return await PersonModel.findById(userId);
  },

  async create(
    data: CreatePersonInput,
    authorId?: number
  ): Promise<SafePerson> {
    const numbers = data.phones.map((p) => p.number);
    const emails = data.emails?.map((e)=> e.email );
    const existingPhone = await PersonModel.findByPhone(numbers);

    if (emails) {
      const existingEmail = await PersonModel.findByEmail(emails);
      if (existingEmail) {
        throw new AppError(ERROR_MESSAGES.EMAIL_EXISTS, 409);
      }
    }

    if (existingPhone) {
      throw new AppError(ERROR_MESSAGES.PHONE_EXISTS, 409);
    }

    const hashedPassword = data.password
      ? await bcryptjs.hash(data.password, 10)
      : undefined;

    const person = await PersonModel.create({
      ...data,
      password: hashedPassword,
    });

    await ActivityLogModel.logAction({
      actor_id: authorId || null,
      action: LOG_ACTIONS.CREATE_PERSON,
      target_type: LOG_TARGETS.PERSON,
      target_id: person.id,
      details: {
        person,
      },
    });
    return person;
  },

  async update(
    personId: number,
    data: UpdatePersonInput,
    actorId?: number
  ): Promise<SafePerson | null> {
    const updatedPerson = await PersonModel.update(personId, data);
console.log(actorId)
    await ActivityLogModel.logAction({
      actor_id: actorId || null,
      action: LOG_ACTIONS.UPDATE_PERSON,
      target_type: LOG_TARGETS.PERSON,
      target_id: personId,
      details: {
        data,
      },
    });

    return updatedPerson;
  },

  async delete(personId: number, actorId?: number): Promise<number> {
    const result = await PersonModel.delete(personId);

    await ActivityLogModel.logAction({
      actor_id: actorId || null,
      action: LOG_ACTIONS.DELETE_PERSON,
      target_type: LOG_TARGETS.PERSON,
      target_id: personId,
    });

    return result;
  },
};

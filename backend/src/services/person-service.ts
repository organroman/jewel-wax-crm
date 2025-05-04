import { CreatePersonInput, UpdatePersonInput } from "../types/person.types";

import bcryptjs from "bcryptjs";

import { PersonModel } from "../models/person-model";
import { ActivityLogModel } from "../models/activity-log-model";

import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";
import { LOG_ACTIONS, LOG_TARGET } from "../constants/activity-log";

export const PersonService = {
  async getAll() {
    return await PersonModel.getAll();
  },

  async getById(userId: number) {
    return await PersonModel.findById(userId);
  },

  async create(data: CreatePersonInput, authorId?: number) {
    const numbers = data.phones.map((p) => p.number);
    const existingPhone = await PersonModel.findByPhone(numbers);

    if (data.email) {
      const existingEmail = await PersonModel.findByEmail(data.email);
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
      target_type: LOG_TARGET.PERSON,
      target_id: person.id,
      details: {
        person,
      },
    });
    return person;
  },

  async update(personId: number, data: UpdatePersonInput, actorId?: number) {
    const updatedPerson = await PersonModel.update(personId, data);

    await ActivityLogModel.logAction({
      actor_id: actorId || null,
      action: LOG_ACTIONS.UPDATE_PERSON,
      target_type: LOG_TARGET.PERSON,
      target_id: personId,
      details: {
        data,
      },
    });

    return updatedPerson;
  },

  async delete(personId: number, actorId?: number) {
    const result = await PersonModel.delete(personId);
    await ActivityLogModel.logAction({
      actor_id: actorId || null,
      action: LOG_ACTIONS.DELETE_PERSON,
      target_type: LOG_TARGET.PERSON,
      target_id: personId,
    });

    return result;
  },
};

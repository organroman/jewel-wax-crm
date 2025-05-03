import { CreatePersonInput, UpdatePersonInput } from "../types/person.types";

import bcryptjs from "bcryptjs";

import { PersonModel } from "../models/person-model";
import db from "../db/db";
import ERROR_MESSAGES from "../constants/error-messages";
import AppError from "../utils/AppError";

export const PersonService = {
  async getAll() {
    return await PersonModel.getAll();
  },

  async getById(userId: number) {
    return await PersonModel.findById(userId);
  },

  async create(data: CreatePersonInput) {
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
    return await PersonModel.create({
      ...data,
      password: hashedPassword,
    });
  },

  async update(personId: number, data: UpdatePersonInput) {
    return await PersonModel.update(personId, data);
  },

  async delete(personId: number) {
    return await PersonModel.delete(personId);
  },
};

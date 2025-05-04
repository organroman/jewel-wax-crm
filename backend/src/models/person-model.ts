
import {
  CreatePersonInput,
  Person,
  SafePerson,
  UpdatePersonInput,
} from "../types/person.types";

import db from "../db/db";

import { stripPassword } from "../utils/helpers";
import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";

export const PersonModel = {
  async getAll(): Promise<SafePerson[]> {
    const persons = await db("persons").select("*");

    return await Promise.all(
      persons.map(async (person) => {
        const phones = await db("phones").where("person_id", person.id);
        const addresses = await db("delivery_addresses").where(
          "person_id",
          person.id
        );
        return {
          ...(stripPassword(person) as SafePerson),
          delivery_addresses: addresses,
          phones,
        };
      })
    );
  },

  async findById(personId: number): Promise<SafePerson | null> {
    const [person] = await db("persons").where("id", personId).select("*");

    if (!person) {
      return null;
    }
    const phones = await db("phones").where("person_id", person.id);
    const addresses = await db("delivery_addresses").where(
      "person_id",
      personId
    );

    return {
      ...(stripPassword(person) as SafePerson),
      delivery_addresses: addresses,
      phones,
    };
  },

  async create(data: CreatePersonInput): Promise<SafePerson> {
    const [newPerson] = await db("persons")
      .insert({
        first_name: data.first_name,
        last_name: data.last_name,
        patronymic: data.patronymic,
        email: data.email,
        city: data.city,
        role: data.role,
        password: data.password,
        is_active: true,
      })
      .returning<Person[]>("*");

    await db("phones").insert(
      data.phones.map((phone) => ({
        ...phone,
        person_id: newPerson.id,
      }))
    );

    if (data.delivery_addresses?.length) {
      await db("delivery_addresses").insert(
        data.delivery_addresses.map((address) => ({
          ...address,
          person_id: newPerson.id,
        }))
      );
    }
    const result = await PersonModel.findById(newPerson.id);

    if (!result) {
      throw new AppError(ERROR_MESSAGES.FAILED_TO_LOAD_AFTER_CREATION, 500);
    }
    return result;
  },

  async update(
    personId: number,
    data: UpdatePersonInput
  ): Promise<SafePerson | null> {
    const { phones, delivery_addresses, ...personFields } = data;
    const [updatedPerson] = await db("persons")
      .where("id", personId)
      .update({ ...personFields, updated_at: new Date() })
      .returning<Person[]>("*");

    if (!updatedPerson) {
      return null;
    }

    if (phones) {
      await db("phones").where("person_id", personId).del();
      await db("phones").insert(
        phones.map((phone) => ({
          ...phone,
          person_id: personId,
        }))
      );
    }

    if (delivery_addresses) {
      await db("delivery_addresses").where({ person_id: personId }).del();
      await db("delivery_addresses").insert(
        delivery_addresses.map((address) => ({
          ...address,
          person_id: personId,
        }))
      );
    }

    return await PersonModel.findById(personId);
  },

  async updatePassword(personId: number, hashedPassword: string) {
    await db("persons").where("id", personId).update({
      password: hashedPassword,
      updated_at: new Date(),
    });
  },

  async delete(personId: number): Promise<number> {
    return await db("persons").where("id", personId).del();
  },

  async findByEmail(email: string | undefined): Promise<Person | null> {
    return db("persons").where("email", email).first();
  },

  async findByPhone(phoneNumbers: string[]) {
    return db("phones").whereIn("number", phoneNumbers).first();
  },
};

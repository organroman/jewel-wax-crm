import db from "../db/db";

import { stripPassword } from "../utils/helpers";

import {
  CreatePersonInput,
  Person,
  SafePerson,
  UpdatePersonInput,
} from "../types/person.types";
import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";

export const PersonModel = {
  async getAll(): Promise<SafePerson[]> {
    const persons = await db("users").select("*");
    return await Promise.all(
      persons.map(async (person) => {
        const addresses = await db("delivery_addresses").where(
          "person_id",
          person.id
        );
        return {
          ...(stripPassword(person) as SafePerson),
          delivery_addresses: addresses,
        };
      })
    );
  },

  async findById(personId: number): Promise<SafePerson | null> {
    const [person] = await db("users").where("id", personId).select("*");

    if (!person) {
      return null;
    }

    const addresses = await db("delivery_addresses").where(
      "person_id",
      personId
    );

    return {
      ...(stripPassword(person) as SafePerson),
      delivery_addresses: addresses,
    };
  },

  async create(data: CreatePersonInput): Promise<SafePerson> {
    const [newPerson] = await db("persons")
      .insert({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        role: data.role,
        password: data.password,
        is_active: true,
      })
      .returning<Person[]>("*");

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
    const [updatedPerson] = await db("persons")
      .where("id", personId)
      .update({ ...data, updated_at: new Date() })
      .returning<Person[]>("*");

    if (!updatedPerson) {
      return null;
    }

    if (data.delivery_addresses) {
      await db("delivery_addresses").where({ person_id: personId }).del();
      await db("delivery_addresses").insert(
        data.delivery_addresses.map((address) => ({
          ...address,
          person_id: personId,
        }))
      );
    }

    return await PersonModel.findById(personId);
  },
  async delete(personId: number): Promise<number> {
    return await db("persons").where("id", personId).del();
  },
  async findByEmailOrPhone(email: string | undefined, phone?: string) {
    return db("persons").where("email", email).orWhere("phone", phone).first();
  },
};

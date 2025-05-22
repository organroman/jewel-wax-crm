import {
  CreatePersonInput,
  Person,
  SafePerson,
  UpdatePersonInput,
  GetAllPersonsOptions,
  SafePersonWithRole,
} from "../types/person.types";
import { PaginatedResult } from "../types/shared.types";

import db from "../db/db";

import { stripPassword } from "../utils/helpers";
import AppError from "../utils/AppError";
import { paginateQuery } from "../utils/pagination";
import ERROR_MESSAGES from "../constants/error-messages";

export const PersonModel = {
  async getAll({
    page,
    limit,
    filters,
    search,
    sortBy = "created_at",
    order = "desc",
  }: GetAllPersonsOptions): Promise<PaginatedResult<SafePerson>> {
    const baseQuery = db<Person>("persons").select("*");

    if (filters?.role) baseQuery.where("role", filters.role);
    if (typeof filters?.is_active === "boolean")
      baseQuery.where("is_active", filters.is_active);

    if (filters?.city)
      baseQuery.where((qb) => {
        qb.whereIn("id", function () {
          this.select("person_id")
            .from("person_locations")
            .where("city_id", filters.city);
        });
      });

    if (filters?.country)
      baseQuery.where((qb) => {
        qb.whereIn("id", function () {
          this.select("person_id")
            .from("person_locations")
            .where("country_id", filters.country);
        });
      });

    if (search) {
      baseQuery.where((qb) => {
        qb.whereILike("first_name", `%${search}%`)
          .orWhereILike("last_name", `%${search}%`)
          .orWhereIn("id", function () {
            this.select("person_id")
              .from("person_emails")
              .whereILike("email", `%${search}%`);
          })
          .orWhereIn("id", function () {
            this.select("person_id")
              .from("phones")
              .whereILike("number", `%${search}%`);
          });
      });
    }

    const paginated = await paginateQuery<Person>(baseQuery, {
      page,
      limit,
      order,
      sortBy,
    });

    const enriched = await Promise.all(
      paginated.data.map(async (person) => {
        const role = await db("enums")
          .where("value", person.role)
          .first()
          .select("value", "label");
        const phones = await db("phones").where("person_id", person.id);
        const emails = await db("person_emails").where("person_id", person.id);
        const messengers = await db("person_messengers").where(
          "person_id",
          person.id
        );
        const delivery_addresses = await db("delivery_addresses").where(
          "person_id",
          person.id
        );
        const locations = await db("person_locations")
          .leftJoin("cities", "person_locations.city_id", "cities.id")
          .leftJoin("countries", "person_locations.country_id", "countries.id")
          .where("person_locations.person_id", person.id)
          .select(
            "person_locations.id",
            "person_locations.is_main",
            "cities.id as city_id",
            "cities.name as city_name",
            "countries.id as country_id",
            "countries.name as country_name"
          );

        return {
          ...(stripPassword(person) as SafePerson),
          role,
          delivery_addresses: delivery_addresses,
          phones,
          emails,
          messengers,
          locations,
        };
      })
    );

    return {
      ...paginated,
      data: enriched,
    };
  },

  async findById(personId: number): Promise<SafePersonWithRole | null> {
    const [person] = await db<Person>("persons")
      .where("id", personId)
      .select("*");

    if (!person) {
      return null;
    }
    const role = await db("enums")
      .where("value", person.role)
      .first()
      .select("value", "label");
    const phones = await db("phones").where("person_id", person.id);
    const emails = await db("person_emails").where("person_id", person.id);
    const locations = await db("person_locations")
      .leftJoin("cities", "person_locations.city_id", "cities.id")
      .leftJoin("countries", "person_locations.country_id", "countries.id")
      .where("person_locations.person_id", person.id)
      .select(
        "person_locations.id",
        "person_locations.is_main",
        "cities.id as city_id",
        "cities.name as city_name",
        "countries.id as country_id",
        "countries.name as country_name"
      );

    const addresses = await db("delivery_addresses").where(
      "person_id",
      personId
    );
    const contacts = await db("person_contacts")
      .join("contacts", "person_contacts.contact_id", "contacts.id")
      .where("person_contacts.person_id", person.id)
      .select(
        "contacts.id",
        "contacts.source",
        "contacts.external_id",
        "contacts.username",
        "contacts.full_name",
        "contacts.phone"
      );
    const messengers = await db("person_messengers").where(
      "person_id",
      person.id
    );
    const bank_details = await db("person_bank_accounts").where(
      "person_id",
      person.id
    );

    const base = stripPassword(person);

    const safePerson: SafePersonWithRole = {
      ...base,
      role,
      delivery_addresses: addresses,
      phones,
      emails,
      locations,
      contacts,
      messengers,
      bank_details,
    };

    return safePerson;
  },

  async create(data: CreatePersonInput): Promise<SafePerson> {
    const [newPerson] = await db<Person>("persons")
      .insert({
        first_name: data.first_name,
        last_name: data.last_name,
        patronymic: data.patronymic,
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

    if (data.emails?.length) {
      await db("person_emails").insert(
        data.emails.map((email) => ({
          ...email,
          person_id: newPerson.id,
        }))
      );
    }
    if (data.locations?.length) {
      await db("person_locations").insert(
        data.locations.map((location) => ({
          person_id: newPerson.id,
          city_id: location.city_id,
          country_id: location.country_id,
          is_main: location.is_main,
        }))
      );
    }

    if (data.delivery_addresses?.length) {
      await db("delivery_addresses").insert(
        data.delivery_addresses.map((address) => ({
          ...address,
          person_id: newPerson.id,
        }))
      );
    }
    if (data.bank_details?.length) {
      await db("person_bank_accounts").insert(
        data.bank_details.map((bank) => ({
          ...bank,
          person_id: newPerson.id,
        }))
      );
    }
    if (data.contacts?.length) {
      await db("person_contacts").insert(
        data.contacts.map((contact) => ({
          contact_id: contact.id,
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
    const {
      phones,
      emails,
      locations,
      contacts,
      bank_details,
      delivery_addresses,
      ...personFields
    } = data;
    const [updatedPerson] = await db<Person>("persons")
      .where("id", personId)
      .update({ ...personFields, updated_at: new Date() })
      .returning<Person[]>("*");

    if (!updatedPerson) {
      return null;
    }

    if (phones?.length) {
      await db("phones").where("person_id", personId).del();
      await db("phones").insert(
        phones.map((phone) => ({
          ...phone,
          person_id: personId,
        }))
      );
    }

    if (emails?.length) {
      await db("person_emails").where("person_id", personId).del();
      await db("person_emails").insert(
        emails.map((email) => ({
          ...email,
          person_id: personId,
        }))
      );
    }
    if (delivery_addresses?.length) {
      await db("delivery_addresses").where({ person_id: personId }).del();
      await db("delivery_addresses").insert(
        delivery_addresses.map((address) => ({
          ...address,
          person_id: personId,
        }))
      );
    }

    if (locations?.length) {
      await db("person_locations").where("person_id", personId).del();
      await db("person_locations").insert(
        locations.map((location) => ({
          id: location.id,
          is_main: location.is_main,
          city_id: location.city_id,
          country_id: location.country_id,
          person_id: personId,
        }))
      );
    }

    if (contacts?.length) {
      await db("person_contacts").where("person_id", personId).del();
      await db("person_contacts").insert(
        contacts.map((contact) => ({
          contact_id: contact.id,
          person_id: personId,
        }))
      );
    }

    if (bank_details?.length) {
      await db("person_bank_accounts").where("person_id", personId).del();
      await db("person_bank_accounts").insert(
        bank_details.map((bank) => ({
          ...bank,
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
    return await db<Person>("persons").where("id", personId).del();
  },

  async findByEmail(emails: string[]) {
    return db("persons")
      .join("person_emails", "persons.id", "person_emails.person_id")
      .whereIn("email", emails)
      .select("persons.*")
      .first();
  },

  async findByPhone(phoneNumbers: string[]) {
    return db("phones").whereIn("number", phoneNumbers).first();
  },
};

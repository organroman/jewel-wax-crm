import {
  CreatePersonInput,
  Person,
  SafePerson,
  GetAllPersonsOptions,
  PersonBase,
  Location,
  PersonContact,
  BankDetails,
  PersonRole,
} from "../../types/person.types";
import { PaginatedResult } from "../../types/shared.types";

import db from "../../db/db";

import { getFullName, stripPassword } from "../../utils/helpers";
import { paginateQuery } from "../../utils/pagination";
import { PersonPhoneModel } from "./phone-model";
import { PersonEmailModel } from "./email-model";
import { PersonDeliveryAddressModel } from "./delivery-address-model";

export const PersonModel = {
  async getAll({
    page,
    limit,
    filters,
    search,
    sortBy = "created_at",
    order = "desc",
  }: GetAllPersonsOptions): Promise<PaginatedResult<PersonBase>> {
    const baseQuery = db<Person>("persons").select("*");

    if (filters?.role) baseQuery.where("role", filters.role);
    if (filters?.person_id) baseQuery.where("id", filters.person_id);
    if (filters?.is_active?.length)
      baseQuery.whereIn("is_active", filters.is_active);

    if (filters?.city && filters.city.length > 0)
      baseQuery.where((qb) => {
        qb.whereIn("id", function () {
          this.select("person_id")
            .from("person_locations")
            .whereIn("city_id", filters.city as number[]);
        });
      });

    if (filters?.country && filters.country.length > 0)
      baseQuery.where((qb) => {
        qb.whereIn("id", function () {
          this.select("person_id")
            .from("person_locations")
            .whereIn("country_id", filters.country as number[]);
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

    return await paginateQuery<Person>(baseQuery, {
      page,
      limit,
      order,
      sortBy,
    });
  },

  async getPersonsBaseByIds(ids: number[]): Promise<PersonBase[]> {
    return await db<Person>("persons").whereIn("id", ids).select("*");
  },

  async getPaginatedPersonsByRoleWithSearch(
    role: PersonRole,
    search?: string
  ): Promise<PaginatedResult<Partial<SafePerson>>> {
    const baseQuery = db<Person>("persons").where("role", role).select("*");

    if (search) {
      baseQuery.where((qb) => {
        qb.whereILike("first_name", `%${search}%`).orWhereILike(
          "last_name",
          `%${search}%`
        );
      });
    }

    const paginated = await paginateQuery<Person>(baseQuery, {
      page: 1,
      limit: 20,
    });

    const enriched = await Promise.all(
      paginated.data.map(async (person) => {
        const delivery_addresses = await db("delivery_addresses").where(
          "person_id",
          person.id
        );
        const phones = await db("phones").where("person_id", person.id);

        return {
          ...(stripPassword(person) as SafePerson),
          delivery_addresses,
          phones,
        };
      })
    );
    return {
      ...paginated,
      data: enriched,
    };
  },

  async findById(personId: number): Promise<SafePerson | null> {
    const [person] = await db<Person>("persons")
      .where("id", personId)
      .select("*");

    if (!person) {
      return null;
    }
    const phones = await PersonPhoneModel.getPhonesByPersonId(person.id);
    const emails = await PersonEmailModel.getEmailsByPersonId(person.id);

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

    const addresses =
      await PersonDeliveryAddressModel.getDeliveryAddressesByPersonId(
        person.id
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
    const bank_details = await this.getBankDetailsByPersonId(person.id);

    const base = stripPassword(person);

    const safePerson: SafePerson = {
      ...base,
      // role,
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

  async createPersonBase(data: CreatePersonInput): Promise<PersonBase> {
    const [newPerson] = await db<Person>("persons")
      .insert({
        first_name: data.first_name,
        last_name: data.last_name,
        patronymic: data.patronymic,
        role: data.role,
        password: data.password,
        is_active: true,
        avatar_url: data.avatar_url,
      })
      .returning<PersonBase[]>("*");
    return newPerson;
  },

  async updateBasePerson(personId: number, fields: Partial<PersonBase>) {
    return await db<PersonBase>("persons")
      .where("id", personId)
      .update({ ...fields, updated_at: new Date() })
      .returning("*");
  },


  async getContactsByPersonId(personId: number): Promise<PersonContact[]> {
    return await db<PersonContact>("person_contacts").where(
      "person_id",
      personId
    );
  },
  async createContacts(personId: number, contact: PersonContact[]) {
    await db("person_contacts").insert(
      contact.map((contact) => ({
        contact_id: contact.id,
        person_id: personId,
      }))
    );
  },
  async deleteContacts(contactIds: number[]) {
    await db<PersonContact>("person_contacts").whereIn("id", contactIds).del();
  },

  async getBankDetailsByPersonId(personId: number): Promise<BankDetails[]> {
    return await db<BankDetails>("person_bank_accounts").where(
      "person_id",
      personId
    );
  },
  async createBankDetails(personId: number, bankDetail: BankDetails[]) {
    await db("person_bank_accounts").insert(
      bankDetail.map((bankDetail) => ({
        ...bankDetail,
        person_id: personId,
      }))
    );
  },
  async deleteBankDetails(bankDetailIds: number[]) {
    await db<BankDetails>("person_bank_accounts")
      .whereIn("id", bankDetailIds)
      .del();
  },
  async updateBankDetails(
    toUpdate: BankDetails[],
    updatedBankDetails: BankDetails[]
  ) {
    await Promise.all(
      toUpdate.map((p) => {
        const updated = updatedBankDetails.find((u) => u.id === p.id);
        if (!updated) return;
        return db<BankDetails>("person_bank_accounts")
          .where("id", p.id)
          .update(updated);
      })
    );
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

  async getOrderPerformersByRole(
    role: PersonRole
  ): Promise<{ id: number; fullname: string }[]> {
    const personsFull = await db<Person>("persons")
      .whereIn("role", ["super_admin", role])
      .select("id", "first_name", "last_name", "patronymic");

    const persons = personsFull.map((item) => ({
      id: item.id,
      fullname: getFullName(item.first_name, item.last_name, item.patronymic),
    }));

    return persons;
  },

  async getRoleById(id: number): Promise<{ role: PersonRole }> {
    const [role] = await db<Person>("persons").where("id", id).select("role");
    return role;
  },
};

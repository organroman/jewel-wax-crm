import {
  CreatePersonInput,
  Person,
  SafePerson,
  GetAllPersonsOptions,
  PersonBase,
  Phone,
  Email,
  DeliveryAddress,
  Location,
  PersonContact,
  BankDetails,
  PersonRole,
  PersonMessenger,
} from "../types/person.types";
import { PaginatedResult } from "../types/shared.types";

import db from "../db/db";

import { getFullName, stripPassword } from "../utils/helpers";
import { paginateQuery } from "../utils/pagination";

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

  async getCustomers(
    search?: string
  ): Promise<PaginatedResult<Partial<SafePerson>>> {
    const baseQuery = db<Person>("persons").where("role", "client").select("*");

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
    const role = await db("enums")
      .where("value", person.role)
      .first()
      .select("value", "label");
    const phones = await this.getPhonesByPersonId(person.id);
    const emails = await this.getEmailsByPersonId(person.id);
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

    const addresses = await this.getDeliveryAddressesByPersonId(person.id);
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

  async createPersonBase(data: CreatePersonInput): Promise<PersonBase> {
    const [newPerson] = await db<Person>("persons")
      .insert({
        first_name: data.first_name,
        last_name: data.last_name,
        patronymic: data.patronymic,
        role: data.role,
        password: data.password,
        is_active: true,
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

  async getPersonMessengers(personId: number): Promise<PersonMessenger[]> {
    return await db<PersonMessenger>("person_messengers").where(
      "person_id",
      personId
    );
  },

  async getPhonesByPersonId(personId: number): Promise<Phone[]> {
    return await db<Phone>("phones").where("person_id", personId);
  },

  async createPhones(personId: number, phones: Phone[]) {
    await db("phones").insert(
      phones.map((phone) => ({
        ...phone,
        person_id: personId,
      }))
    );
  },
  async deletePhones(phoneIds: number[]) {
    await db<Phone>("phones").whereIn("id", phoneIds).del();
  },
  async updatePhones(toUpdate: Phone[], updatedPhones: Phone[]) {
    await Promise.all(
      toUpdate.map((p) => {
        const updated = updatedPhones.find((u) => u.id === p.id);
        return db<Phone>("phones")
          .where("id", p.id)
          .update({
            ...updated,
            updated_at: new Date(),
          });
      })
    );
  },

  async getEmailsByPersonId(personId: number): Promise<Email[]> {
    return await db<Email>("person_emails").where("person_id", personId);
  },

  async createEmails(personId: number, emails: Email[]) {
    await db("person_emails").insert(
      emails.map((email) => ({
        ...email,
        person_id: personId,
      }))
    );
  },

  async deleteEmails(emailIds: number[]) {
    await db<Email>("person_emails").whereIn("id", emailIds).del();
  },

  async updateEmails(toUpdate: Email[], updatedEmails: Email[]) {
    await Promise.all(
      toUpdate.map((p) => {
        const updated = updatedEmails.find((u) => u.id === p.id);
        return db<Email>("person_emails")
          .where("id", p.id)
          .update({
            ...updated,
            updated_at: new Date(),
          });
      })
    );
  },

  async getDeliveryAddressesByPersonId(
    personId: number
  ): Promise<DeliveryAddress[]> {
    return await db<DeliveryAddress>("delivery_addresses")
      .where("person_id", personId)
      .leftJoin("cities", "delivery_addresses.city_id", "cities.id")
      .select(
        "delivery_addresses.id",
        "delivery_addresses.person_id",
        "delivery_addresses.type",
        "delivery_addresses.np_warehouse_ref",
        "delivery_addresses.np_warehouse",
        "delivery_addresses.np_warehouse_siteKey",
        "delivery_addresses.street",
        "delivery_addresses.street_ref",
        "delivery_addresses.house_number",
        "delivery_addresses.flat_number",
        "delivery_addresses.np_recipient_ref",
        "delivery_addresses.np_contact_recipient_ref",
        "delivery_addresses.is_main",
        "delivery_addresses.city_id",
        "cities.name as city_name",
        "cities.ref as city_ref",
        "cities.region",
        "cities.area"
      );
  },

  async createDeliveryAddresses(
    personId: number,
    deliveryAddress: DeliveryAddress[]
  ) {
    await db("delivery_addresses").insert(
      deliveryAddress.map((deliveryAddress) => ({
        ...deliveryAddress,
        person_id: personId,
      }))
    );
  },

  async deleteDeliveryAddresses(deliveryAddressIds: number[]) {
    await Promise.all(
      deliveryAddressIds.map((id) => {
        return db<DeliveryAddress>("delivery_addresses")
          .where("id", id)
          .update({
            person_id: null,
          });
      })
    );
  },

  async updateDeliveryAddresses(
    toUpdate: DeliveryAddress[],
    updatedDeliveryAddress: DeliveryAddress[]
  ) {
    await Promise.all(
      toUpdate.map((p) => {
        const updated = updatedDeliveryAddress.find((u) => u.id === p.id);
        if (!updated) return;
        return db<DeliveryAddress>("delivery_addresses")
          .where("id", p.id)
          .update({
            ...updated,
            updated_at: new Date(),
          });
      })
    );
  },

  async getLocationsByPersonId(personId: number): Promise<Location[]> {
    return await db("person_locations")
      .leftJoin("cities", "person_locations.city_id", "cities.id")
      .leftJoin("countries", "person_locations.country_id", "countries.id")
      .where("person_locations.person_id", personId)
      .select(
        "person_locations.id",
        "person_locations.is_main",
        "cities.id as city_id",
        "cities.name as city_name",
        "countries.id as country_id",
        "countries.name as country_name"
      );
  },
  async createLocations(personId: number, location: Location[]) {
    await db("person_locations").insert(
      location.map((location) => ({
        is_main: location.is_main,
        city_id: location.city_id,
        country_id: location.country_id,
        person_id: personId,
      }))
    );
  },
  async deleteLocations(locationIds: number[]) {
    await db<Location>("person_locations").whereIn("id", locationIds).del();
  },
  async updateLocations(toUpdate: Location[], updatedLocation: Location[]) {
    await Promise.all(
      toUpdate.map((p) => {
        const updated = updatedLocation.find((u) => u.id === p.id);
        if (!updated) return;
        return db<Location>("person_locations").where("id", p.id).update({
          id: updated.id,
          is_main: updated.is_main,
          city_id: updated.city_id,
          country_id: updated.country_id,
          person_id: updated.person_id,
        });
      })
    );
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

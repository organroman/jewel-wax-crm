import {
  CreatePersonInput,
  DeliveryAddress,
  GetAllPersonsOptions,
  PersonRole,
  SafePerson,
  UpdatePersonInput,
  Phone,
  User,
} from "../types/person.types";
import { Location } from "../types/person.types";
import { PaginatedResult } from "../types/shared.types";

import bcryptjs from "bcryptjs";

import { PersonModel } from "../models/person/person-model";
import { PersonPhoneModel } from "../models/person/phone-model";
import { PersonEmailModel } from "../models/person/email-model";
import { PersonMessengerModel } from "../models/person/messenger-model";
import { PersonDeliveryAddressModel } from "../models/person/delivery-address-model";
import { PersonLocationModel } from "../models/person/location-model";
import { ActivityLogModel } from "../models/activity-log-model";
import { LocationModel } from "../models/location-model";
import { NovaPoshtaModel } from "../models/novaposhta-model";
import { ConversationModel } from "../models/chat/conversation-model";

import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";
import { LOG_ACTIONS, LOG_TARGETS } from "../constants/activity-log";

import { getDoorAddress, getFullName, stripPassword } from "../utils/helpers";

export const PersonService = {
  async getAll({
    page,
    limit,
    filters,
    search,
    sortBy,
    order,
  }: GetAllPersonsOptions): Promise<PaginatedResult<SafePerson>> {
    const persons = await PersonModel.getAll({
      page,
      limit,
      filters,
      search,
      sortBy,
      order,
    });

    const enriched = await Promise.all(
      persons.data.map(async (person) => {
        const phones = await PersonPhoneModel.getPhonesByPersonId(person.id);
        const emails = await PersonEmailModel.getEmailsByPersonId(person.id);
        const messengers = await PersonMessengerModel.getPersonMessengers(
          person.id
        );

        const delivery_addresses =
          await PersonDeliveryAddressModel.getDeliveryAddressesByPersonId(
            person.id
          );

        const locations = await PersonLocationModel.getLocationsByPersonId(
          person.id
        );

        return {
          ...(stripPassword(person) as SafePerson),
          delivery_addresses: delivery_addresses,
          phones,
          emails,
          messengers,
          locations,
        };
      })
    );

    return {
      ...persons,
      data: enriched,
    };
  },

  async getById(userId: number): Promise<SafePerson | null> {
    if (Number.isNaN(userId)) {
      throw new AppError(ERROR_MESSAGES.INVALID_DATA, 400);
    }
    return await PersonModel.findById(userId);
  },
  async getCustomers(search?: string): Promise<
    PaginatedResult<{
      id?: number;
      first_name?: string;
      last_name?: string;
      patronymic?: string;
      phones?: Phone[];
      delivery_addresses?: Partial<DeliveryAddress>[];
    }>
  > {
    const customers = await PersonModel.getPaginatedPersonsByRoleWithSearch(
      "client",
      search
    );

    const { data, page, total, limit } = customers;

    const enriched = data.map((customer) => ({
      id: customer.id,
      first_name: customer.first_name,
      last_name: customer.last_name,
      patronymic: customer.patronymic,
      phones: customer.phones,
      delivery_addresses: customer.delivery_addresses?.map((a) => {
        const { id, ...rest } = a;
        return {
          ...rest,
          delivery_address_id: id,
          address_line:
            a.type === "door"
              ? getDoorAddress(a.street, a.house_number, a.flat_number)
              : a.np_warehouse || "",
        };
      }),
    }));
    return { page, total, limit, data: enriched };
  },
  async getPaginatedPersonsByRoleWithSearch(
    role: PersonRole,
    search?: string
  ): Promise<
    PaginatedResult<{
      id?: number;
      fullname: string;
    }>
  > {
    const persons = await PersonModel.getPaginatedPersonsByRoleWithSearch(
      role,
      search
    );

    const { data, page, total, limit } = persons;

    const enriched = data.map((person) => ({
      id: person.id,
      fullname: getFullName(
        person.first_name,
        person.last_name,
        person.patronymic
      ),
    }));
    return { page, total, limit, data: enriched };
  },

  async create(
    data: CreatePersonInput,
    authorId?: number
  ): Promise<SafePerson> {
    const numbers = data.phones.map((p) => p.number);
    const emails = data.emails?.map((e) => e.email);
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

    const person = await PersonModel.createPersonBase({
      ...data,
      password: hashedPassword,
    });

    await PersonPhoneModel.createPhones(person.id, data.phones);

    if (data.emails?.length) {
      await PersonEmailModel.createEmails(person.id, data.emails);
    }

    if (data.locations?.length) {
      await PersonLocationModel.createLocations(person.id, data.locations);
      await this.updateCitiesWithRegion(data.locations);
    }

    if (data.delivery_addresses?.length) {
      await PersonDeliveryAddressModel.createDeliveryAddresses(
        person.id,
        data.delivery_addresses
      );
    }

    if (data.bank_details?.length) {
      await PersonModel.createBankDetails(person.id, data.bank_details);
    }

    if (data.contacts?.length) {
      await PersonModel.createContacts(person.id, data.contacts);
    }

    if (data.contact_id && data.conversation_id) {
      await ConversationModel.updateParticipant({
        conversation_id: data.conversation_id,
        person_id: person.id,
        contact_id: data.contact_id,
      });
    }

    const newMessengers = data.messengers?.filter((m) => !m.id) ?? [];
    if (newMessengers.length) {
      await PersonMessengerModel.createMessengers(person.id, newMessengers);
    }

    const result = await PersonModel.findById(person.id);

    if (!result) {
      throw new AppError(ERROR_MESSAGES.FAILED_TO_LOAD_AFTER_CREATION, 500);
    }

    await ActivityLogModel.logAction({
      actor_id: authorId || null,
      action: LOG_ACTIONS.CREATE_PERSON,
      target_type: LOG_TARGETS.PERSON,
      target_id: person.id,
      details: {
        person,
      },
    });
    return result;
  },

  async update(
    personId: number,
    data: UpdatePersonInput,
    actorId?: number
  ): Promise<SafePerson | null> {
    const {
      phones,
      emails,
      locations,
      contacts,
      bank_details,
      delivery_addresses,
      messengers,
      contact_id,
      conversation_id,
      ...personFields
    } = data;

    const updatedPerson = await PersonModel.updateBasePerson(
      personId,
      personFields
    );

    if (!updatedPerson) return null;

    const existingPhones = await PersonPhoneModel.getPhonesByPersonId(personId);

    const newPhones = phones?.filter((p) => !p.id) ?? [];
    const incomingPhones = phones?.filter((p) => p.id) ?? [];

    const toUpdatePhones = existingPhones.filter((dbPhone) => {
      const incomingMatch = incomingPhones?.find((p) => p.id === dbPhone.id);
      return incomingMatch;
    });

    const toDeletePhones = existingPhones.filter(
      (dbPhone) => !incomingPhones.find((m) => m.id === dbPhone.id)
    );

    if (toDeletePhones.length) {
      await PersonPhoneModel.deletePhones(toDeletePhones.map((m) => m.id));
    }

    if (toUpdatePhones.length) {
      await PersonPhoneModel.updatePhones(toUpdatePhones, incomingPhones);
    }

    if (newPhones.length) {
      await PersonPhoneModel.createPhones(personId, newPhones);
    }

    const existingEmails = await PersonEmailModel.getEmailsByPersonId(personId);

    const newEmails = emails?.filter((p) => !p.id) ?? [];
    const incomingEmails = emails?.filter((p) => p.id) ?? [];

    const toUpdateEmails = existingEmails.filter((dbEmail) => {
      const incomingMatch = incomingEmails?.find((p) => p.id === dbEmail.id);
      return incomingMatch;
    });

    const toDeleteEmails = existingEmails.filter(
      (dbEmail) => !incomingEmails.find((m) => m.id === dbEmail.id)
    );

    if (toDeleteEmails.length) {
      await PersonEmailModel.deleteEmails(toDeleteEmails.map((m) => m.id));
    }

    if (toUpdateEmails.length) {
      await PersonEmailModel.updateEmails(toUpdateEmails, incomingEmails);
    }

    if (newEmails.length) {
      await PersonEmailModel.createEmails(personId, newEmails);
    }

    const existingDeliveryAddresses =
      await PersonDeliveryAddressModel.getDeliveryAddressesByPersonId(personId);

    const newDelAddresses = delivery_addresses?.filter((p) => !p.id) ?? [];
    const incomingDelAddresses = delivery_addresses?.filter((p) => p.id) ?? [];

    const toUpdateDelAddresses = existingDeliveryAddresses.filter((dbItem) => {
      const incomingMatch = incomingDelAddresses?.find(
        (p) => p.id === dbItem.id
      );
      return incomingMatch;
    });

    const toDeleteDelAddresses = existingDeliveryAddresses.filter(
      (dbItem) => !incomingDelAddresses.find((m) => m.id === dbItem.id)
    );

    if (toDeleteDelAddresses.length) {
      await PersonDeliveryAddressModel.deleteDeliveryAddresses(
        toDeleteDelAddresses.map((m) => m.id)
      );
    }

    if (toUpdateDelAddresses.length) {
      await PersonDeliveryAddressModel.updateDeliveryAddresses(
        toUpdateDelAddresses,
        incomingDelAddresses
      );
    }

    if (newDelAddresses.length) {
      await PersonDeliveryAddressModel.createDeliveryAddresses(
        personId,
        newDelAddresses
      );
    }

    const existingLocations = await PersonLocationModel.getLocationsByPersonId(
      personId
    );

    const newLocations = locations?.filter((i) => !i.id) ?? [];
    const incomingLocations = locations?.filter((i) => i.id) ?? [];

    if (locations?.length) {
      await this.updateCitiesWithRegion(locations);
    }

    const toUpdateLocations = existingLocations.filter((dbItem) => {
      const incomingMatch = existingLocations?.find((p) => p.id === dbItem.id);
      return incomingMatch;
    });

    const toDeleteLocations = existingLocations.filter(
      (dbItem) => !incomingLocations.find((m) => m.id === dbItem.id)
    );

    if (toDeleteLocations.length) {
      await PersonLocationModel.deleteLocations(
        toDeleteLocations.map((m) => m.id)
      );
    }

    if (toUpdateLocations.length) {
      await PersonLocationModel.updateLocations(
        toUpdateLocations,
        incomingLocations
      );
    }

    if (newLocations.length) {
      await PersonLocationModel.createLocations(personId, newLocations);
    }

    const existingContacts = await PersonModel.getContactsByPersonId(personId);

    if (existingContacts.length) {
      await PersonModel.deleteContacts(existingContacts.map((m) => m.id));
    }

    if (contacts?.length) {
      await PersonModel.createContacts(personId, contacts);
    }

    const existingBank = await PersonModel.getBankDetailsByPersonId(personId);

    const newBank = bank_details?.filter((i) => !i.id) ?? [];
    const incomingBank = bank_details?.filter((i) => i.id) ?? [];

    const toUpdateBank = existingBank.filter((dbItem) => {
      const incomingMatch = existingBank?.find((p) => p.id === dbItem.id);
      return incomingMatch;
    });

    const toDeleteBank = existingBank.filter(
      (dbItem) => !incomingBank.find((m) => m.id === dbItem.id)
    );

    if (toDeleteBank.length) {
      await PersonModel.deleteBankDetails(toDeleteBank.map((m) => m.id));
    }

    if (toUpdateBank.length) {
      await PersonModel.updateBankDetails(toUpdateBank, incomingBank);
    }

    if (newBank.length) {
      await PersonModel.createBankDetails(personId, newBank);
    }

    const existingMessengers = await PersonMessengerModel.getPersonMessengers(
      personId
    );
    const newMessengers = messengers?.filter((m) => !m.id) ?? [];
    const incomingMessengers = messengers?.filter((m) => m.id) ?? [];

    const toUpdateMessengers = existingMessengers.filter((dbItem) => {
      const incomingMatch = existingMessengers?.find((p) => p.id === dbItem.id);
      return incomingMatch;
    });

    if (newMessengers.length) {
      await PersonMessengerModel.createMessengers(personId, newMessengers);
    }

    await ActivityLogModel.logAction({
      actor_id: actorId || null,
      action: LOG_ACTIONS.UPDATE_PERSON,
      target_type: LOG_TARGETS.PERSON,
      target_id: personId,
      details: {
        data,
      },
    });

    return await PersonService.getById(personId);
  },

  async updateUser(
    personId: number,
    data: User,
    actorId?: number
  ): Promise<SafePerson | null> {
    const { location, phone, email, ...rest } = data;
    const updatedPerson = await PersonModel.updateBasePerson(personId, rest);

    if (!updatedPerson) return null;

    if (location) {
      const existingLocations =
        await PersonLocationModel.getLocationsByPersonId(personId);

      const toUpdateLocations = existingLocations.filter((dbItem) => {
        const incomingMatch = location.id === dbItem.id;
        return incomingMatch;
      });

      await PersonLocationModel.updateLocations(toUpdateLocations, [location]);
    }

    if (phone) {
      const isNewPhone = Boolean(phone.id);
      const existingPhones = await PersonPhoneModel.getPhonesByPersonId(
        personId
      );

      const toUpdatePhones = existingPhones.filter((dbItem) => {
        const incomingMatch = phone.id === dbItem.id;
        return incomingMatch;
      });

      !isNewPhone
        ? await PersonPhoneModel.createPhones(personId, [phone])
        : await PersonPhoneModel.updatePhones(toUpdatePhones, [phone]);
    }

    if (email) {
      const isNewEmail = Boolean(email.id);
      const existingEmails = await PersonEmailModel.getEmailsByPersonId(
        personId
      );

      const toUpdateEmails = existingEmails.filter((dbItem) => {
        const incomingMatch = email.id === dbItem.id;
        return incomingMatch;
      });

      !isNewEmail
        ? await PersonEmailModel.createEmails(personId, [email])
        : await PersonEmailModel.updateEmails(toUpdateEmails, [email]);
    }

    await ActivityLogModel.logAction({
      actor_id: actorId || null,
      action: LOG_ACTIONS.UPDATE_PERSON,
      target_type: LOG_TARGETS.PERSON,
      target_id: personId,
      details: {
        data,
      },
    });

    return await PersonService.getById(personId);
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

  async getOrderPerformersByRole(
    role: PersonRole
  ): Promise<{ id: number; fullname: string }[]> {
    return await PersonModel.getOrderPerformersByRole(role);
  },
  async updateCitiesWithRegion(locations: Location[]) {
    const existingCities = await Promise.all(
      locations.map(async (location) => {
        return await LocationModel.getCityById(location.city_id);
      })
    );

    const citiesToUpdate = existingCities.filter(
      (city) => city?.region === null
    );

    if (citiesToUpdate.length) {
      const updatedCities = await Promise.all(
        citiesToUpdate.map(async (item) => {
          if (item) {
            const { success, data } = await NovaPoshtaModel.getSettlements(
              item.name
            );

            if (!success || !data?.[0]?.Addresses?.length) {
              console.warn(`No region data found for city: ${item.name}`);
              return null;
            }
            const region = data[0].Addresses[0].Region;
            return {
              ...item,
              region,
            };
          }
        })
      );

      const citiesWithRegion = updatedCities.filter(Boolean);

      await Promise.all(
        citiesWithRegion.map(
          async (city) =>
            city &&
            (await LocationModel.updateCity(city.id, { region: city.region }))
        )
      );
    }
  },
};

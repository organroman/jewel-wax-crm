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
    if (Number.isNaN(userId)) {
      throw new AppError(ERROR_MESSAGES.INVALID_DATA, 400);
    }
    return await PersonModel.findById(userId);
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

    // const person = await PersonModel.create({
    //   ...data,
    //   password: hashedPassword,
    // });

    const person = await PersonModel.createPersonBase({
      ...data,
      password: hashedPassword,
    });

    await PersonModel.createPhones(person.id, data.phones);

    if (data.emails?.length) {
      await PersonModel.createEmails(person.id, data.emails);
    }

    if (data.locations?.length) {
      await PersonModel.createLocations(person.id, data.locations);
    }

    if (data.delivery_addresses?.length) {
      await PersonModel.createDeliveryAddresses(
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
      ...personFields
    } = data;

    const updatedPerson = await PersonModel.updateBasePerson(
      personId,
      personFields
    );

    if (!updatedPerson) return null;

    const existingPhones = await PersonModel.getPhonesByPersonId(personId);

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
      await PersonModel.deletePhones(toDeletePhones.map((m) => m.id));
    }

    if (toUpdatePhones.length) {
      await PersonModel.updatePhones(toUpdatePhones, incomingPhones);
    }

    if (newPhones.length) {
      await PersonModel.createPhones(personId, newPhones);
    }

    const existingEmails = await PersonModel.getEmailsByPersonId(personId);

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
      await PersonModel.deleteEmails(toDeleteEmails.map((m) => m.id));
    }

    if (toUpdateEmails.length) {
      await PersonModel.updateEmails(toUpdateEmails, incomingEmails);
    }

    if (newEmails.length) {
      await PersonModel.createEmails(personId, newEmails);
    }

    const existingDeliveryAddresses =
      await PersonModel.getDeliveryAddressesByPersonId(personId);

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
      await PersonModel.deleteDeliveryAddresses(
        toDeleteDelAddresses.map((m) => m.id)
      );
    }

    if (toUpdateDelAddresses.length) {
      await PersonModel.updateDeliveryAddresses(
        toUpdateDelAddresses,
        incomingDelAddresses
      );
    }

    if (newDelAddresses.length) {
      await PersonModel.createDeliveryAddresses(personId, newDelAddresses);
    }

    const existingLocations = await PersonModel.getLocationsByPersonId(
      personId
    );

    const newLocations = locations?.filter((i) => !i.id) ?? [];
    const incomingLocations = locations?.filter((i) => i.id) ?? [];

    const toUpdateLocations = existingLocations.filter((dbItem) => {
      const incomingMatch = existingLocations?.find((p) => p.id === dbItem.id);
      return incomingMatch;
    });

    const toDeleteLocations = existingLocations.filter(
      (dbItem) => !incomingLocations.find((m) => m.id === dbItem.id)
    );

    if (toDeleteLocations.length) {
      await PersonModel.deleteLocations(toDeleteLocations.map((m) => m.id));
    }

    if (toUpdateLocations.length) {
      await PersonModel.updateLocations(toUpdateLocations, incomingLocations);
    }

    if (newLocations.length) {
      await PersonModel.createLocations(personId, newLocations);
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

  async getModellers(): Promise<{ id: number; fullname: string }[]> {
    return await PersonModel.getModellers();
  },
  async getMillers(): Promise<{ id: number; fullname: string }[]> {
    return await PersonModel.getMillers();
  },
  async getPrinters(): Promise<{ id: number; fullname: string }[]> {
    return await PersonModel.getPrinters();
  },
};

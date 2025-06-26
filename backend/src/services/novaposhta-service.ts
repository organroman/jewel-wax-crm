import { City, Street, Warehouse } from "../types/location-types";
import {
  CargoType,
  CreateDeclarationInput,
  DeliveryDeclaration,
} from "../types/novaposhta.types";

import { NovaPoshtaModel } from "../models/novaposhta-model";
import { OrderModel } from "../models/order-model";

import { ensureRecipientExists } from "../utils/novaposhta";
import AppError from "../utils/AppError";
import { parseDate } from "../utils/helpers";
import ERROR_MESSAGES from "../constants/error-messages";

export const NovaPoshtaService = {
  async findCities(search: string): Promise<Omit<City, "id">[]> {
    const { success, data, errors } = await NovaPoshtaModel.getCities(search);

    if (!success) {
      throw new AppError(errors?.[0] || ERROR_MESSAGES.FAILED_TO_FETCH, 500);
    }

    return data.map((city) => ({
      ref: city.Ref,
      name: city.Description,
      area_ref: city.Area,
      area: city.AreaDescription,
      settlementType_ref: city.SettlementType,
      settlementType: city.SettlementTypeDescription,
      region: null,
    }));
  },

  async getCityWarehouses(
    cityRef: string,
    search: string
  ): Promise<Warehouse[]> {
    const { success, data, errors } = await NovaPoshtaModel.getWarehouses(
      cityRef,
      search
    );

    if (!success) {
      throw new AppError(errors?.[0] || ERROR_MESSAGES.FAILED_TO_FETCH, 500);
    }

    return data.map((warehouse) => ({
      np_warehouse_ref: warehouse.Ref,
      np_warehouse: warehouse.Description,
      np_warehouse_siteKey: warehouse.SiteKey,
    }));
  },

  async getCityStreets(cityRef: string, streetName: string): Promise<Street[]> {
    const { success, data, errors } = await NovaPoshtaModel.getCityStreets(
      streetName,
      cityRef
    );

    if (!success) {
      throw new AppError(errors?.[0] || ERROR_MESSAGES.FAILED_TO_FETCH, 500);
    }

    return data.map((street) => ({
      street: street.Description,
      street_ref: street.Ref,
    }));
  },

  async getCargoTypes(): Promise<CargoType[]> {
    const { success, data, errors } = await NovaPoshtaModel.getCargoTypes();

    if (!success) {
      throw new AppError(errors?.[0] || ERROR_MESSAGES.FAILED_TO_FETCH, 500);
    }

    return data.map((item) => ({
      label: item.Description,
      value: item.Ref,
    }));
  },

  async createDeclaration(
    data: CreateDeclarationInput
  ): Promise<DeliveryDeclaration[]> {
    const payload: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      const newKey = key.charAt(0).toUpperCase() + key.slice(1);
      const newValue =
        typeof value === "string"
          ? value.charAt(0).toUpperCase() + value.slice(1)
          : value;

      payload[newKey] = newValue;
    }

    const { recipientRef, contactRef } = await ensureRecipientExists(
      {
        np_recipient_ref: payload.RecipientRef,
        np_contact_recipient_ref: payload.ContactRecipientRef,
        delivery_address_id: payload.Delivery_address_id,
      },
      {
        firstName: payload.RecipientFirstName,
        lastName: payload.RecipientLastName,
        phone: payload.RecipientsPhone,
      }
    );

    const {
      success,
      data: declaration,
      errors,
    } = await NovaPoshtaModel.createDeclaration({
      ...payload,
      CitySender: process.env.NOVA_POSHAT_SENDER_CITY_REF,
      Sender: process.env.NOVA_POSHTA_COUNTERPARTY_REF,
      ContactSender: process.env.NOVA_POSHTA_SENDER_CONTACT_REF,
      Recipient: recipientRef,
      ContactRecipient: contactRef,
    } as CreateDeclarationInput);

    if (!success || !declaration) {
      throw new AppError(errors?.[0] || ERROR_MESSAGES.FAILED_TO_FETCH, 500);
    }

    await OrderModel.updateDelivery(payload.OrderId, {
      declaration_number: declaration[0].IntDocNumber,
      estimated_delivery_date: parseDate(declaration[0].EstimatedDeliveryDate),
      cost:
        payload.PayerType === "Recipient"
          ? 0.0
          : Number(declaration[0].CostOnSite),
    });

    return declaration;
  },
};

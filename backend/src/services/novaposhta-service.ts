import { City, Street, Warehouse } from "../types/location-types";
import {
  CargoType,
  CreateDeclarationInput,
  DeliveryDeclaration,
} from "../types/novaposhta.types";

import { NovaPoshtaModel } from "../models/novaposhta-model";
import { OrderModel } from "../models/order-model";
import { LocationModel } from "../models/location-model";

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
    const {
      thirdPartyCityName,
      thirdPartyWarehouseName,
      delivery_address_id,
      tax_id,
      ...restData
    } = data;

    const payload: Record<string, any> = {};
    for (const [key, value] of Object.entries(restData)) {
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
        delivery_address_id: delivery_address_id,
      },
      {
        firstName: payload.RecipientFirstName,
        lastName: payload.RecipientLastName,
        phone: payload.RecipientsPhone,
        tax_id: tax_id?.toString(),
      },
      data.isThirdParty
    );

    let RecipientRegion = null;

    if (restData.isThirdParty && payload.RecipientCityName) {
      const existingCity = await LocationModel.findCityByName(
        payload.RecipientCityName
      );

      if (!existingCity.region) {
        const { success, data } = await NovaPoshtaModel.getSettlements(
          payload.RecipientCityName
        );

        if (!success || !data?.[0]?.Addresses?.length) {
          console.warn(
            `No region data found for city: ${payload.RecipientCityName}`
          );
        }

        const region = data[0].Addresses[0].Region;
        RecipientRegion = region;

        await LocationModel.updateCity(existingCity.id, { region: region });
      }
    }
    const existingDelivery = await OrderModel.getDelivery(payload.OrderId);

    if (restData.isThirdParty) {
      const flat = payload.RecipientFlat
        ? `кв. ${payload.RecipientFlat}`
        : null;
      const deliveryAddress =
        payload.ServiceType === "WarehouseDoors"
          ? `${payload.RecipientCityName}, ${
              payload.RecipientAddressName
            }, буд. ${payload.RecipientHouse} ${flat ?? ""}`
          : `${thirdPartyCityName} ${thirdPartyWarehouseName}`;
      const phoneNumber = payload.RecipientsPhone;
      const recipientFullName = tax_id
        ? `${payload.RecipientFirstName}`
        : `${payload.RecipientLastName}, ${payload.RecipientFirstName}`;

      if (existingDelivery) {
        await OrderModel.updateDelivery(payload.OrderId, {
          manual_recipient_phone: phoneNumber,
          manual_recipient_name: recipientFullName,
          manual_delivery_address: deliveryAddress,
        });
      } else
        await OrderModel.insertDelivery({
          manual_recipient_phone: phoneNumber,
          manual_recipient_name: recipientFullName,
          manual_delivery_address: deliveryAddress,
          is_third_party: restData.isThirdParty,
          order_id: payload.OrderId,
          delivery_service: "nova_poshta",
        });
    }

    if (!existingDelivery && !restData.isThirdParty) {
      await OrderModel.insertDelivery({
        delivery_service: "nova_poshta",
        cost: 0.0,
        declaration_number: "",
        order_id: payload.OrderId,
        delivery_address_id: delivery_address_id,
        is_third_party: restData.isThirdParty,
      });
    }

    const {
      success,
      data: declaration,
      errors,
    } = await NovaPoshtaModel.createDeclaration({
      ...payload,
      CitySender: process.env.NOVA_POSHAT_SENDER_CITY_REF,
      Sender: process.env.NOVA_POSHTA_COUNTERPARTY_REF,
      ContactSender: process.env.NOVA_POSHTA_SENDER_CONTACT_REF,
      RecipientRegion,
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

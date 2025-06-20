import AppError from "../utils/AppError";
import { NovaPoshtaModel } from "../models/novaposhta-model";
import ERROR_MESSAGES from "../constants/error-messages";
import { City, Street, Warehouse } from "../types/location-types";

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
};

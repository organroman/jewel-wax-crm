import AppError from "../utils/AppError";
import { NovaPoshtaModel } from "../models/novaposhta-model";
import ERROR_MESSAGES from "../constants/error-messages";
import { City } from "../types/location-types";

export const NovaPoshtaService = {
  async findCities(search: string): Promise<City[]> {
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

  async getCityWarehouses(cityRef: string) {
    const { success, data, errors } = await NovaPoshtaModel.getWarehouses(
      cityRef
    );

    if (!success) {
      throw new AppError(errors?.[0] || ERROR_MESSAGES.FAILED_TO_FETCH, 500);
    }

    return data;
  },
};

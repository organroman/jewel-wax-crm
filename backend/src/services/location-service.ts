import {
  City,
  Country,
  CreateCityInput,
  CreateCountryInput,
} from "../types/location-types";
import { PaginatedResult } from "../types/shared.types";

import { ActivityLogModel } from "../models/activity-log-model";
import { LocationModel } from "../models/location-model";

import { LOG_ACTIONS, LOG_TARGETS } from "../constants/activity-log";
import ERROR_MESSAGES from "../constants/error-messages";
import AppError from "../utils/AppError";

export const LocationService = {
  async getAllCountries(): Promise<Country[]> {
    return await LocationModel.getAllCountries();
  },

  async getCountryById(countryId: number): Promise<Country | null> {
    return await LocationModel.getCountryById(countryId);
  },

  async getCitiesByCountry(
    countryId: number,
    search: string
  ): Promise<PaginatedResult<City>> {
    return await LocationModel.getCitiesByCountry(countryId, search);
  },

  async getPaginatedCities(
    search: string,
    ids: number[]
  ): Promise<PaginatedResult<City>> {
    return await LocationModel.getPaginatedCities({ search, ids });
  },

  async getCityById(cityId: number): Promise<City | null> {
    return await LocationModel.getCityById(cityId);
  },

  async createCountry(
    data: CreateCountryInput,
    authorId?: number
  ): Promise<Country> {
    const existing = await LocationModel.findCountryByName(data.name);

    if (existing) {
      throw new AppError(ERROR_MESSAGES.COUNTRY_EXISTS, 409);
    }
    const newCountry = await LocationModel.createCountry(data);

    await ActivityLogModel.logAction({
      actor_id: authorId || null,
      action: LOG_ACTIONS.CREATE_COUNTRY,
      target_type: LOG_TARGETS.COUNTRY,
      target_id: newCountry.id,
      details: {
        newCountry,
      },
    });
    return newCountry;
  },
  async createCity(data: CreateCityInput, authorId?: number): Promise<City> {
    const existing = await LocationModel.findCityByName(data.name);

    if (existing) {
      throw new AppError(ERROR_MESSAGES.CITY_EXISTS, 409);
    }

    const city = await LocationModel.createCity(data);
    await ActivityLogModel.logAction({
      actor_id: authorId || null,
      action: LOG_ACTIONS.CREATE_CITY,
      target_type: LOG_TARGETS.CITY,
      target_id: city?.id,
      details: {
        city,
      },
    });
    return city;
  },
};

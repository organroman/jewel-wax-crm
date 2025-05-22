import { CreateCityInput, CreateCountryInput } from "../types/location-types";
import db from "../db/db";
import { City, Country } from "./../types/location-types";
import { PaginatedResult } from "../types/shared.types";
import { paginateQuery } from "../utils/pagination";

export const LocationModel = {
  async getAllCountries(): Promise<Country[]> {
    const countries = await db<Country>("countries")
      .select("*")
      .orderBy("name", "asc");
    return countries;
  },

  async getCountryById(id: number): Promise<Country | null> {
    const [country] = await db<Country>("countries")
      .where("id", id)
      .select("*");
    return country;
  },

  async getPaginatedCities({
    search,
  }: {
    search?: string;
  }): Promise<PaginatedResult<City>> {
    const baseQuery = db<City>("cities").select("*");

    if (search) {
      baseQuery.where((qb) => {
        qb.whereILike("name", `%${search}%`);
      });
    }
    return await paginateQuery<City>(baseQuery, {
      page: 1,
      limit: 10,
    });
  },

  async getCitiesByCountry(countryId: number): Promise<City[]> {
    const cities = await db<City>("cities")
      .where("country_id", countryId)
      .select("*");
    return cities;
  },

  async getCityById(cityId: number): Promise<City | null> {
    const [city] = await db<City>("cities").where("id", cityId).select("*");
    return city;
  },

  async createCountry(data: CreateCountryInput) {
    const [country] = await db<Country>("countries")
      .insert(data)
      .returning("*");
    return country;
  },
  async createCity(data: CreateCityInput) {
    const [city] = await db<City>("cities").insert(data).returning("*");
    return city;
  },
};

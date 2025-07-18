import { CreateCityInput, CreateCountryInput } from "../types/location-types";
import { City, Country } from "./../types/location-types";
import { PaginatedResult } from "../types/shared.types";
import db from "../db/db";
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
  async findCountryByName(countryName: string): Promise<Country | null> {
    const [country] = await db<Country>("countries")
      .where("name", countryName)
      .select("*");
    return country;
  },

  async getPaginatedCities({
    search,
    ids,
  }: {
    search?: string;
    ids?: number[];
  }): Promise<PaginatedResult<City>> {
    const baseQuery = db<City>("cities").select("*");

    if (search) {
      baseQuery.where((qb) => {
        qb.whereILike("name", `${search}%`);
      });
    }
    if (ids?.length) {
      baseQuery.whereIn("id", ids);
    }
    return await paginateQuery<City>(baseQuery, {
      page: 1,
      limit: search ? 100 : 20,
      sortBy: "name",
      order: "asc",
    });
  },

  async getCitiesByCountry(
    countryId: number,
    search: string
  ): Promise<PaginatedResult<City>> {
    const baseQuery = db<City>("cities")
      .where("country_id", countryId)
      .select("*");

    if (search) {
      baseQuery.where((qb) => {
        qb.whereILike("name", `${search}`)
          .orWhereILike("name", `${search} %`)
          .orWhereILike("name", `${search},%`)
          .orWhereILike("name", `${search} (%)`)
          .orWhereILike("name", `${search}%`);
      });
    }
    return await paginateQuery<City>(baseQuery, {
      page: 1,
      limit: 20,
      sortBy: "name",
      order: "asc",
    });
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

  async findCityByName(cityName: string): Promise<City> {
    const [city] = await db<City>("cities").where("name", cityName).select("*");
    return city;
  },
  async createCity(data: CreateCityInput) {
    const [city] = await db<City>("cities")
      .insert({ name: data.name, country_id: data.country.value })
      .returning("*");
    return city;
  },
  async updateCity(cityId: number, data: Partial<City>) {
    return await db<City>("cities").where("id", cityId).update(data);
  },
};

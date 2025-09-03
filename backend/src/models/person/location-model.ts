import db from "../../db/db";
import { Location } from "../../types/person.types";

export const PersonLocationModel = {
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
  async getLocationsByPersonIds(personIds: number[]): Promise<Location[]> {
    return await db("person_locations")
      .leftJoin("cities", "person_locations.city_id", "cities.id")
      .leftJoin("countries", "person_locations.country_id", "countries.id")
      .whereIn("person_locations.person_id", personIds)
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
};

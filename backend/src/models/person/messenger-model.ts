import db from "../../db/db";
import { PersonMessenger } from "../../types/person.types";

export const PersonMessengerModel = {
  async getPersonMessengers(personId: number): Promise<PersonMessenger[]> {
    return await db<PersonMessenger>("person_messengers").where(
      "person_id",
      personId
    );
  },
  async createMessengers(personId: number, messengers: PersonMessenger[]) {
    await db("person_messengers").insert(
      messengers.map((messenger) => ({
        ...messenger,
        person_id: personId,
      }))
    );
  },
};

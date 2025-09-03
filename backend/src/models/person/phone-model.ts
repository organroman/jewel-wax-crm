import db from "../../db/db";
import { Phone } from "../../types/person.types";

export const PersonPhoneModel = {
  async getPhonesByPersonId(personId: number): Promise<Phone[]> {
    return await db<Phone>("phones").where("person_id", personId);
  },
  async getPhonesByPersonIds(personIds: number[]): Promise<Phone[]> {
    return await db<Phone>("phones").whereIn("person_id", personIds);
  },

  async createPhones(personId: number, phones: Phone[]) {
    await db("phones").insert(
      phones.map((phone) => ({
        ...phone,
        person_id: personId,
      }))
    );
  },
  async deletePhones(phoneIds: number[]) {
    await db<Phone>("phones").whereIn("id", phoneIds).del();
  },
  async updatePhones(toUpdate: Phone[], updatedPhones: Phone[]) {
    await Promise.all(
      toUpdate.map((p) => {
        const updated = updatedPhones.find((u) => u.id === p.id);
        return db<Phone>("phones")
          .where("id", p.id)
          .update({
            ...updated,
            updated_at: new Date(),
          });
      })
    );
  },
};

import db from "../../db/db";
import { Email } from "../../types/person.types";

export const PersonEmailModel = {
  async getEmailsByPersonId(personId: number): Promise<Email[]> {
    return await db<Email>("person_emails").where("person_id", personId);
  },
  async getEmailsByPersonIds(personIds: number[]): Promise<Email[]> {
    return await db<Email>("person_emails").whereIn("person_id", personIds);
  },

  async createEmails(personId: number, emails: Email[]) {
    await db("person_emails").insert(
      emails.map((email) => ({
        ...email,
        person_id: personId,
      }))
    );
  },

  async deleteEmails(emailIds: number[]) {
    await db<Email>("person_emails").whereIn("id", emailIds).del();
  },

  async updateEmails(toUpdate: Email[], updatedEmails: Email[]) {
    await Promise.all(
      toUpdate.map((p) => {
        const updated = updatedEmails.find((u) => u.id === p.id);
        return db<Email>("person_emails")
          .where("id", p.id)
          .update({
            ...updated,
            updated_at: new Date(),
          });
      })
    );
  },
};

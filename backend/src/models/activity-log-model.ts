import {
  ActivityLog,
  ActivityLogInput,
  ActivityLogWithActorFullName,
  GetActivityParams,
} from "../types/activity-log.types";

import db from "../db/db";
import { Person } from "../types/person.types";

export const ActivityLogModel = {
  async logAction(data: ActivityLogInput): Promise<void> {
    await db("activity_logs").insert({
      actor_id: data.actor_id,
      action: data.action,
      target_type: data.target_type,
      target_id: data.target_id,
      details: data.details ?? null,
    });
  },
  async getLogsByTargetAndTargetId({
    target,
    targetId,
  }: GetActivityParams): Promise<ActivityLogWithActorFullName[]> {
    const logs = await db<ActivityLog>("activity_logs")
      .where("target_type", target)
      .andWhere("target_id", targetId)
      .select("*");

    const enriched = await Promise.all(
      logs.map(async (log) => {
        const [person] = await db<Person>("persons")
          .where("id", log.actor_id)
          .select("first_name", "last_name", "patronymic");

        return {
          ...log,
          actor_fullname: `${person.last_name} ${person.first_name} ${
            person.patronymic ? person.patronymic : ""
          }`,
        };
      })
    );

    return enriched;
  },
};

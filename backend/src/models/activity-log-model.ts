import {
  ActivityLog,
  ActivityLogInput,
  GetActivityParams,
} from "../types/activity-log.types";

import db from "../db/db";

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
  }: GetActivityParams): Promise<ActivityLog[]> {
    const logs = await db<ActivityLog>("activity_logs")
      .where("target_type", target)
      .andWhere("target_id", targetId)
      .select("*");

    return logs;
  },
};

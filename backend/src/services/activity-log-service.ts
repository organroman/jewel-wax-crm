import { ActivityLogModel } from "../models/activity-log-model";
import { ActivityLog, GetActivityParams } from "../types/activity-log.types";

export const ActivityLogService = {
  async getByTargetTypeAndTargetId({
    target,
    targetId,
  }: GetActivityParams): Promise<ActivityLog[]> {
    return await ActivityLogModel.getLogsByTargetAndTargetId({
      target,
      targetId,
    });
  },
};

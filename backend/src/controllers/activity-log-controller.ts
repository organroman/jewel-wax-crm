import { ActivityLogService } from "./../services/activity-log-service";
import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";

export const ActivityLogController = {
  async getLogsByTargetAndTargetId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { target, targetId } = req.query;

      if (!target || !targetId) {
        throw new AppError(ERROR_MESSAGES.MISSING_TARGET_AND_TARGET_ID, 400);
      }
      const logs = await ActivityLogService.getByTargetTypeAndTargetId({
        target: target.toString(),
        targetId: +targetId,
      });

      res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  },
};

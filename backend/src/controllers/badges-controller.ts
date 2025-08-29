import { Request, Response, NextFunction } from "express";
import { computeBadges } from "../services/unread-service";

import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";

export const BadgesController = {
  async getUnread(req: Request, res: Response, next: NextFunction) {
    try {
      const personId = req.user?.id;

      if (!personId) {
        throw new AppError(ERROR_MESSAGES.ACCESS_DENIED, 403);
      }
      const badges = await computeBadges(Number(personId));
      res.status(200).json(badges);
    } catch (error) {
      next(error);
    }
  },
};

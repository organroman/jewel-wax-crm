import { PersonRole } from "./../types/person.types";

import { Request, Response, NextFunction } from "express";

import { DashboardService } from "../services/dashboard-service";

import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";

export const DashboardController = {
  async getDashboardData(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id = req.user?.id;
      const user_role = req.user?.role as PersonRole;

      if (!user_id || !user_role)
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);

      const data = await DashboardService.getDashboardData({
        user_id,
        user_role,
      });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
};

import { NextFunction, Request, Response } from "express";

import { EnumService } from "../services/enum-service";

import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";

export const EnumController = {
  async getUserRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await EnumService.getUserRoles();

      res.status(200).json(roles);
    } catch (error) {
      next(new AppError(ERROR_MESSAGES.FAILED_TO_FETCH, 500));
    }
  },
};

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
  async getRequestStatuses(req: Request, res: Response, next: NextFunction) {
    try {
      const statuses = await EnumService.getRequestStatuses();

      res.status(200).json(statuses);
    } catch (error) {
      next(error);
    }
  },
  async getRequestSources(req: Request, res: Response, next: NextFunction) {
    try {
      const sources = await EnumService.getRequestSources();

      res.status(200).json(sources);
    } catch (error) {
      next(error);
    }
  },

  async getContactSources(req: Request, res: Response, next: NextFunction) {
    try {
      const sources = await EnumService.getContactSources();

      res.status(200).json(sources);
    } catch (error) {
      next(error);
    }
  },
};

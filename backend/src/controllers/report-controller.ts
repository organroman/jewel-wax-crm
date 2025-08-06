import { Request, Response, NextFunction } from "express";

import { ReportService } from "../services/report-service";

import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";

export const ReportController = {
  async getClientsReport(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);

      const { page, limit, person_id, from, to, search } = req.query;

      const clients = await ReportService.getClientsReport({
        page: Number(page),
        limit: Number(limit),
        filters: {
          person_id: Number(person_id),
          from: from as string,
          to: to as string,
        },
      });
      res.status(200).json(clients);
    } catch (error) {
      next(error);
    }
  },
};
